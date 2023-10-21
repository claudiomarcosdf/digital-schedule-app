import React, { useEffect, useState } from 'react';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Demo } from '../../../../types/demo';
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { initialSchedule, useScheduleStore } from '../../../../store/ScheduleStore';
import { Schedule } from '../../../../types/schedule';
import { useProcedureStore } from '../../../../store/ProcedureStore';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import { addMinutes, getFormatedDateTime } from '../../../../helpers/utils';
import { Procedure } from '../../../../types/procedure';
import { usePatientStore } from '../../../../store/PatientStore';
import { Patient } from '../../../../types/patient';

interface Status {
    name: string;
    color: string;
}

// interface ScheduleProps {
//     id?: number | null;
//     startDate: Nullable<Date>;
//     endDate: Nullable<Date>;
//     description: string;
//     amountPaid?: number | 0.0;
//     professionalType: ProfessionalType;
//     professional: ProfessionalSchedule;
//     patient: PatientSchedule;
//     procedure: Procedure;
//     status?: string | null;
// }

const ScheduleForm = ({ hideDialog }: any) => {
    const [schedule, setSchedule] = useState<Schedule | null>(initialSchedule);
    const [submitted, setSubmitted] = useState(false);
    //const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [value2, setValue2] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState<Status | null>({ name: 'AGENDADO', color: '#009EFA' });
    const statusList: Status[] = [
        { name: 'AGENDADO', color: '#009EFA' },
        { name: 'CONFIRMADO', color: '#F9F871' },
        { name: 'PRESENTE', color: '#00C9A7' },
        { name: 'FINALIZADO', color: '#DCB0FF' },
        { name: 'CANCELADO', color: '#FF8066' }
    ];

    const scheduleStore = useScheduleStore((state) => state.schedule);
    const professional = useProfessionalStore((state) => state.professional);
    const getActiveProceduresByProfessionalType = useProcedureStore((state) => state.getActiveProceduresByProfessionalType);
    const procedures = useProcedureStore((state) => state.procedures);
    const searchPatients = usePatientStore((state) => state.findPatientsByName);
    const patients = usePatientStore((state) => state.patients);

    useEffect(() => {
        const professionalTypeId: number = professional?.professionalType.id || 0;
        if (procedures.length == 0 || procedures[0].professionalType.id != professionalTypeId) {
            getActiveProceduresByProfessionalType(professionalTypeId);
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

    const onHideDialog = () => {
        setSubmitted(false);
        hideDialog();
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

        if (schedule?.patient.id && schedule.startDate && schedule.endDate) {
            const startDate = schedule.startDate ? getFormatedDateTime(new Date(schedule.startDate.toString()).toString()) : '';
            const endDate = schedule.endDate ? getFormatedDateTime(new Date(schedule.endDate.toString()).toString()) : '';

            if (schedule?.id) {
                //updateSchedule({ ...schedule, startDate, endDate});
            } else {
                //createSchedule({ ...schedule, startDate, endDate});
            }
            hideDialog();
        }
    }

    console.log(schedule);
    return (
        <>
            <div className="formgrid grid mt-4">
                <div className="field col">
                    <span className="p-float-label">
                        <AutoComplete id="autocomplete" value={value2} onChange={(e) => setValue2(e.value)} suggestions={patients} completeMethod={searchPatient} field="person.fullName" />
                        <label htmlFor="autocomplete">Buscar paciente...</label>
                    </span>
                    {/* {submitted && !schedule?.nickName && <small className="p-invalid">O nome é obrigatório.</small>} */}
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
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.value)}
                            options={statusList}
                            optionLabel="name"
                            editable
                            placeholder="Selecione um status"
                            style={{ backgroundColor: `${selectedStatus?.color}` }}
                        />
                        <label htmlFor="status">Status</label>
                    </span>
                </div>
            </div>

            <div className="formgrid grid mt-5">
                <div className="field col">
                    <span className="p-float-label">
                        <InputText
                            id="description"
                            // value={professional?.nickName}
                            // onChange={(e) => onInputChange(e, 'nickName')}
                        />
                        <label htmlFor="description">Descrição</label>
                    </span>
                </div>
            </div>

            <div className="formgrid grid mt-5">
                <div className="field col-6">
                    <span className="p-float-label">
                        <Dropdown id="procedure" value={schedule?.procedure} onChange={(e) => onSelectProcedure(e, 'procedure')} options={procedures} optionLabel="name" editable placeholder="Selecione um procedimento" />
                        <label htmlFor="procedure">Procedimento</label>
                    </span>
                </div>
                <div className="field col-6">
                    <span className="p-float-label">
                        <InputNumber id="amountPaid" value={schedule?.amountPaid || null} onValueChange={(e) => onInputNumberChange(e, 'amountPaid')} mode="currency" currency="BRL" locale="pt-BR" min={0} minFractionDigits={2} />
                        <label htmlFor="amountPaid">Valor do procedimento</label>
                    </span>
                </div>
            </div>
            <div className="flex justify-content-end formgrid grid mt-5">{ButtonsFooter}</div>
        </>
    );
};

export default ScheduleForm;