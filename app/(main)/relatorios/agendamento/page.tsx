'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { Professional, ProfessionalType } from '../../../../types/professional';
import { Fieldset } from 'primereact/fieldset';

const ScheduleReport = () => {
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const getProfessionalTypes = useProfessionalTypeStore((state) => state.getAllProfessionalTypes);
    const professionalTypes = useProfessionalTypeStore((state) => state.professionalTypes);

    useEffect(() => {
        if (professionalTypes.length == 0) getProfessionalTypes();
    }, []);

    const onDropdownValue = (e: DropdownChangeEvent) => {
        const dropdown: ProfessionalType = e.value;
        let _professionalType = { ...professional?.professionalType };
        _professionalType.id = dropdown.id;
        _professionalType.name = dropdown.name;
        _professionalType.active = dropdown.active;

        // @ts-ignore comment
        setProfessional({ ...professional, professionalType: _professionalType });
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Relatório de agendamentos</h5>
                    <Fieldset className="mt-5" legend="Período" toggleable>
                        <div className="formgrid grid mt-3">
                            <div className="field col-3 mt-1">
                                <span className="p-float-label">
                                    <InputText id="birthDay" type="date" value={''} onChange={() => {}} style={{ width: '15rem' }} />
                                    <label htmlFor="birthDay">Data inicial</label>
                                </span>
                            </div>
                            <div className="field col-3 mt-1">
                                <span className="p-float-label">
                                    <InputText id="birthDay" type="date" value={''} onChange={() => {}} style={{ width: '15rem' }} />
                                    <label htmlFor="birthDay">Data final</label>
                                </span>
                            </div>
                        </div>
                    </Fieldset>
                    <Fieldset
                        className="mt-5"
                        legend="
                    Filtros"
                        toggleable
                    >
                        <div className="formgrid grid mt-4">
                            <div className="col-3 mb-5">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="professionaltype"
                                        value={''}
                                        onChange={(e) => onDropdownValue(e)}
                                        options={professionalTypes}
                                        optionLabel="name"
                                        // placeholder="Tipo de profissional"
                                        required
                                        className={classNames({
                                            'p-invalid': submitted && !professional?.professionalType.id
                                        })}
                                        style={{ width: '15rem' }}
                                    />
                                    <label htmlFor="professionaltype">Tipo de profissional</label>
                                </span>
                            </div>
                            <div className="col-3 mb-5">
                                <span className="p-float-label">
                                    <Dropdown
                                        id="professional"
                                        value={''}
                                        onChange={(e) => onDropdownValue(e)}
                                        options={[]}
                                        optionLabel="name"
                                        required
                                        className={classNames({
                                            'p-invalid': submitted && !professional?.id
                                        })}
                                        style={{ width: '15rem' }}
                                    />
                                    <label htmlFor="professional">Profissional</label>
                                </span>
                            </div>
                        </div>
                    </Fieldset>
                    <div className="mt-5 mb-3">
                        <Button label="Gerar relatório"></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleReport;
