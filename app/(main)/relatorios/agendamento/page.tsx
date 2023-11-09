'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { Professional, ProfessionalType } from '../../../../types/professional';
import { Fieldset } from 'primereact/fieldset';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import { useScheduleStore } from '../../../../store/ScheduleStore';
import reportSchedulePDF from './reportSchedulePDF';

export interface ScheduleFilter {
    startDate: string;
    endDate: string;
    professionalType: ProfessionalType;
    professional: Professional;
}

const ScheduleReport = () => {
    const [filter, setFilter] = useState<ScheduleFilter | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [openReport, setOpenReport] = useState(false);

    const getProfessionalTypes = useProfessionalTypeStore((state) => state.getAllProfessionalTypes);
    const professionalTypes = useProfessionalTypeStore((state) => state.professionalTypes);
    const getProfessionalsByType = useProfessionalStore((state) => state.getProfessionalsByType);
    const professionals = useProfessionalStore((state) => state.professionals);
    const getSchedulesByProfessional = useScheduleStore((state) => state.getSchedulesByProfessional);
    const schedulesApi = useScheduleStore((state) => state.schedulesApi);

    useEffect(() => {
        if (professionalTypes.length == 0) getProfessionalTypes();
    }, []);

    const onInputDate = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target && e.target.value;

        // @ts-ignore comment
        setFilter({ ...filter, [name]: val });
    };

    const onDropdownValue = (e: DropdownChangeEvent, name: string) => {
        const _professionalType: ProfessionalType = e.value;

        if (name == 'professionalType') {
            getProfessionalsByType(_professionalType?.id || 0);
        }
        // @ts-ignore comment
        setFilter({ ...filter, [name]: _professionalType });
    };

    const buildReport = () => {
        setSubmitted(true);

        if (filter?.startDate && filter?.endDate && filter?.professionalType?.id && filter.professional?.id) {
            const startDate = new Date(filter.startDate);
            const endDate = new Date(filter.endDate);

            if (startDate > endDate) return;

            getSchedulesByProfessional(filter.professionalType.id, filter?.professional.id, filter.startDate, filter.endDate);
            setOpenReport(true);
        }
    };

    const onOpenReport = () => {
        if (filter && openReport) {
            if (filter?.startDate && filter?.endDate && filter?.professionalType?.id && filter.professional?.id) {
                setOpenReport(false);
                reportSchedulePDF(
                    schedulesApi.sort((s1, s2) => Date.parse(s2.startDate) - Date.parse(s1.startDate)),
                    filter
                );
            }
        }
    };

    schedulesApi.length != 0 && onOpenReport();
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Relatório de agendamentos</h5>
                    <Fieldset className="mt-5" legend="Período">
                        <div className="formgrid grid mt-3">
                            <div className="field col-3 mt-1 mr-3">
                                <span className="p-float-label">
                                    <InputText
                                        id="startDate"
                                        type="date"
                                        value={filter?.startDate || ''}
                                        onChange={(e) => onInputDate(e, 'startDate')}
                                        required
                                        style={{ width: '15rem' }}
                                        className={classNames({
                                            'p-invalid': submitted && !filter?.startDate
                                        })}
                                    />
                                    <label htmlFor="startDate">Data inicial</label>
                                </span>
                                {submitted && !filter?.startDate && <small className="p-invalid text-red-300">Data inicial obrigatória</small>}
                            </div>
                            <div className="field col-3 mt-1">
                                <span className="p-float-label">
                                    <InputText
                                        id="endDate"
                                        type="date"
                                        value={filter?.endDate || ''}
                                        onChange={(e) => onInputDate(e, 'endDate')}
                                        required
                                        style={{ width: '15rem' }}
                                        className={classNames({
                                            'p-invalid': submitted && !filter?.endDate
                                        })}
                                    />
                                    <label htmlFor="endDate">Data final</label>
                                </span>
                                {submitted && !filter?.endDate && <small className="p-invalid text-red-300">Data final obrigatória</small>}
                            </div>
                        </div>
                    </Fieldset>
                    <Fieldset className="mt-5" legend="Filtros">
                        <div className="formgrid grid mt-4">
                            <div className="col-3 mb-5 mr-3">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="professionaltype"
                                        value={filter?.professionalType}
                                        onChange={(e) => onDropdownValue(e, 'professionalType')}
                                        options={professionalTypes}
                                        optionLabel="name"
                                        // placeholder="Tipo de profissional"
                                        required
                                        className={classNames({
                                            'p-invalid': submitted && !filter?.professionalType?.id
                                        })}
                                        style={{ width: '15rem' }}
                                    />
                                    <label htmlFor="professionaltype">Tipo de profissional</label>
                                </span>
                                {submitted && !filter?.professionalType?.id && <small className="p-invalid text-red-300">Selecione o tipo de profissional</small>}
                            </div>
                            <div className="col-3 mb-5">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="professional"
                                        value={filter?.professional}
                                        onChange={(e) => onDropdownValue(e, 'professional')}
                                        options={professionals || null}
                                        optionLabel="nickName"
                                        required
                                        className={classNames({
                                            'p-invalid': submitted && !filter?.professional?.id
                                        })}
                                        style={{ width: '15rem' }}
                                    />
                                    <label htmlFor="professional">Profissional</label>
                                </span>
                                {submitted && !filter?.professional?.id && <small className="p-invalid text-red-300">Selecione o profissional</small>}
                            </div>
                        </div>
                    </Fieldset>
                    <div className="mt-5 mb-3">
                        <Button label="Gerar relatório" icon="pi pi-file-pdf" onClick={buildReport}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleReport;
