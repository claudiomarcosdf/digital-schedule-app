import React, { useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { PatientSchedule, Schedule, ScheduleRequest } from '../../../../types/schedule';
import { Procedure } from '../../../../types/procedure';
import { Patient } from '../../../../types/patient';
import { initialSchedule, useScheduleStore } from '../../../../store/ScheduleStore';
import { useProcedureStore } from '../../../../store/ProcedureStore';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import { usePatientStore } from '../../../../store/PatientStore';
import { addMinutes, getColorStatus, getFormatedDateTime } from '../../../../helpers/utils';
import PatientFormDialog from '../paciente/PatientFormDialog';

interface Status {
    name: string;
    color: string;
}

const ScheduleForm = ({ hideDialog }: any) => {
    const [schedule, setSchedule] = useState<Schedule | null>(initialSchedule);
    const [submitted, setSubmitted] = useState(false);
    //const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [openPatientDialog, setOpenPatientDialog] = useState(false);
    const [patientSearch, setPatientSearch] = useState(null);
    const statusList: Status[] = [
        { name: 'AGENDADO', color: '#009EFA' },
        { name: 'CONFIRMADO', color: '#f1c40f' },
        { name: 'PRESENTE', color: '#00C9A7' },
        { name: 'FINALIZADO', color: '#DCB0FF' },
        { name: 'CANCELADO', color: '#FF8066' }
    ];

    const { schedule: scheduleStore, createSchedule, updateSchedule } = useScheduleStore((state) => state);
    const professional = useProfessionalStore((state) => state.professional);
    const getActiveProceduresByProfessionalType = useProcedureStore((state) => state.getActiveProceduresByProfessionalType);
    const procedures = useProcedureStore((state) => state.procedures);
    const searchPatients = usePatientStore((state) => state.findPatientsByName);
    const patients = usePatientStore((state) => state.patients);
    const setPatient = usePatientStore((state) => state.setPatient);

    useEffect(() => {
        const professionalTypeId: number = professional?.professionalType.id || 0;
        if (procedures.length == 0 || procedures[0].professionalType.id != professionalTypeId) {
            getActiveProceduresByProfessionalType(professionalTypeId);
        }

        if (scheduleStore?.patient?.id) {
            // @ts-ignore comment
            setPatientSearch(scheduleStore.patient.fullName);
        }

        setSchedule(scheduleStore || initialSchedule);
    }, [scheduleStore]);

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || null;
        // @ts-ignore comment
        setSchedule({ ...schedule, [name]: val });
    };

    const onInputDate = (e: CalendarChangeEvent, name: string) => {
        const val = e.value || '';

        if (name == 'startDate') {
            const durationService = professional?.durationService || 0;
            // @ts-ignore comment
            setSchedule({ ...schedule, startDate: val, endDate: addMinutes(val as Date, durationService) });
        } else {
            // @ts-ignore comment
            setSchedule({ ...schedule, [name]: val });
        }
    };

    const onInputPatientName = (e: AutoCompleteChangeEvent) => {
        const value = e.value || null;

        if (value?.id) {
            const patient: Patient = e.value;
            const patientSchedule: PatientSchedule = {
                id: patient?.id as number,
                fullName: patient.person.fullName as string,
                birthDay: patient.person.birthDay,
                gender: patient.person.gender,
                cpf: patient.person.cpf,
                phone: patient.person.phone,
                phone2: patient.person.phone2
            };
            // @ts-ignore comment
            setSchedule({ ...schedule, patient: patientSchedule });
            setPatientSearch(value);
        } else setPatientSearch(value);
    };

    const onSelectProcedure = (e: DropdownChangeEvent, name: string) => {
        const procedure: Procedure = e.value || null;

        if (name == 'procedure') {
            const price: number = procedure.price;
            // @ts-ignore comment
            setSchedule({ ...schedule, procedure: procedure, amountPaid: price });
        } else {
            // @ts-ignore comment
            setSchedule({ ...schedule, [name]: procedure });
        }
    };

    const onInputText = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target.value || '';
        // @ts-ignore comment
        setSchedule({ ...schedule, [name]: val });
    };

    const onSelectStatus = (e: DropdownChangeEvent) => {
        const status = e || null;

        // @ts-ignore comment
        setSchedule({ ...schedule, status: status.name });
    };

    const onHideDialog = () => {
        setSubmitted(false);
        hideDialog();
    };

    const newPacienteClick = () => {
        setPatient(null);
        setOpenPatientDialog(true);
    };

    const hideDialogPatient = () => {
        setOpenPatientDialog(false);
    };

    const searchPatient = (event: AutoCompleteCompleteEvent) => {
        // in a real application, make a request to a remote url with the query and
        // return filtered results, for demo we filter at client side
        //const filtered = [];
        const nameToSearch = event.query;
        if (nameToSearch.length > 2) {
            searchPatients(nameToSearch.toLowerCase());
        }
        // for (let i = 0; i < countries.length; i++) {
        //     const country = countries[i];
        //     if (country.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        //         filtered.push(country);
        //     }
        // }
        //setFilteredPatients(filtered);
    };

    const ButtonsFooter = (
        <div className="flex flex-row">
            <Button label="Cancelar" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveSchedule} />
        </div>
    );

    function saveSchedule() {
        setSubmitted(true);

        if (schedule?.patient?.id && schedule.startDate && schedule.endDate) {
            const startDate = schedule.startDate ? getFormatedDateTime(new Date(schedule.startDate.toString()).toString()) : '';
            const endDate = schedule.endDate ? getFormatedDateTime(new Date(schedule.endDate.toString()).toString()) : '';

            if (schedule?.id) {
                updateSchedule({ ...schedule, startDate, endDate });
            } else {
                createSchedule({ ...schedule, startDate, endDate });
            }
            hideDialog();
        }
    }

    //console.log('Schedule: ', schedule);
    return (
        <>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <span className="p-float-label">
                        <AutoComplete
                            id="autocomplete"
                            value={patientSearch}
                            onChange={(e) => onInputPatientName(e)}
                            suggestions={patients}
                            completeMethod={searchPatient}
                            field="person.fullName"
                            className={classNames({
                                'p-invalid': submitted && !schedule?.patient?.id
                            })}
                        />
                        <label htmlFor="autocomplete">Buscar paciente...</label>
                    </span>
                    {submitted && !schedule?.patient?.id && <small className="p-invalid">O paciente é obrigatório.</small>}
                </div>
                <div className="field col-1">
                    <Button icon="pi pi-plus" rounded onClick={newPacienteClick} tooltip="Novo Paciente" tooltipOptions={{ position: 'top' }} />
                </div>
            </div>

            <div className="formgrid grid mt-5">
                <div className="field col-4">
                    <span className="p-float-label">
                        <Calendar id="startDate" value={new Date(schedule?.startDate || '')} onChange={(e) => onInputDate(e, 'startDate')} showTime hourFormat="24" />
                        <label htmlFor="startDate">Data e hora inicial</label>
                    </span>
                </div>
                <div className="field col-4">
                    <span className="p-float-label">
                        <Calendar id="endDate" value={new Date(schedule?.endDate || '')} onChange={(e) => onInputDate(e, 'endDate')} showTime hourFormat="24" />
                        <label htmlFor="endDate">Data e hora final</label>
                    </span>
                </div>
                <div className="field col-4">
                    <span className="p-float-label">
                        <Dropdown
                            id="status"
                            value={schedule?.status || 'AGENDADO'}
                            onChange={(e) => onSelectStatus(e.value)}
                            options={statusList}
                            optionLabel="name"
                            editable
                            placeholder="Selecione um status"
                            style={{ backgroundColor: `${getColorStatus(schedule?.status as string)}` }}
                        />
                        <label htmlFor="status">Status</label>
                    </span>
                </div>
            </div>

            <div className="formgrid grid mt-5">
                <div className="field col">
                    <span className="p-float-label">
                        <InputText id="description" value={schedule?.description} onChange={(e) => onInputText(e, 'description')} />
                        <label htmlFor="description">Descrição</label>
                    </span>
                </div>
            </div>

            <div className="formgrid grid mt-5">
                <div className="field col-8">
                    <span className="p-float-label">
                        <Dropdown
                            id="procedure"
                            value={schedule?.procedure?.name}
                            onChange={(e) => onSelectProcedure(e, 'procedure')}
                            options={procedures}
                            optionLabel="name"
                            editable
                            placeholder="Selecione um procedimento"
                            className={classNames({
                                'p-invalid': submitted && !schedule?.procedure?.id
                            })}
                        />
                        <label htmlFor="procedure">Procedimento</label>
                    </span>
                    {submitted && !schedule?.procedure?.id && <small className="p-invalid">O procedimento é obrigatório.</small>}
                </div>
                <div className="field col-4">
                    <span className="p-float-label">
                        <InputNumber id="amountPaid" value={schedule?.amountPaid || null} onValueChange={(e) => onInputNumberChange(e, 'amountPaid')} mode="currency" currency="BRL" locale="pt-BR" min={0} minFractionDigits={2} />
                        <label htmlFor="amountPaid">Valor do procedimento</label>
                    </span>
                </div>
            </div>
            <div className="flex justify-content-end formgrid grid mt-5">{ButtonsFooter}</div>
            <PatientFormDialog title={'Cadastrar paciente'} visible={openPatientDialog} hideDialog={hideDialogPatient} />
        </>
    );
};

export default ScheduleForm;
