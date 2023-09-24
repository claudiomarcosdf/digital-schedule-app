import React, { useState, useEffect } from 'react';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Professional, ProfessionalSchedule, ProfessionalSchedulePropsForm } from '../../../../types/professional';
import { initialProfessional, useProfessionalStore } from '../../../../store/ProfessionalStore';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { validTime, convertToProfessionalScheduleForm, convertToProfessionalSchedule } from '../../../helpers/utils';
import { useProfessionalScheduleStore } from '../../../../store/ProfessionalScheduleStore';

function JornadaHorariosFormDialog({ hideDialog }: any) {
    const [professional, setProfessional] = useState<Professional | null>(initialProfessional);
    const [professionalScheduleForm, setProfessionalScheduleForm] = useState<ProfessionalSchedulePropsForm>();

    const professionalStore = useProfessionalStore((state) => state.professional);
    const getAllProfessional = useProfessionalStore((state) => state.getAllProfessional);

    const updateProfessional = useProfessionalStore((state) => state.updateProfessional);
    const createProfessionalSchedule = useProfessionalScheduleStore((state) => state.createProfessionalSchedule);
    const updateProfessionalSchedule = useProfessionalScheduleStore((state) => state.updateProfessionalSchedule);

    useEffect(() => {
        setProfessional(professionalStore || initialProfessional);

        if (professionalStore?.professionalSchedule) {
            const newProfessionalScheduleForm = convertToProfessionalScheduleForm(professionalStore?.professionalSchedule);
            setProfessionalScheduleForm({ ...newProfessionalScheduleForm });
        }
    }, [professionalStore]);

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || null;
        onChangeProfessional(name, val);
    };

    const onInputMaskChange = (e: InputMaskChangeEvent, name: string) => {
        const val = e.value || '';
        //if (!validTime(val)) setSubmitted(true);
        // @ts-ignore comment
        setProfessionalScheduleForm({ ...professionalScheduleForm, [name]: val });
    };

    const onChangeProfessional = (name: string, value: any) => {
        // @ts-ignore comment
        setProfessional({ ...professional, [name]: value });
    };

    const onHideDialog = () => {
        hideDialog();
    };

    const ButtonsFooter = (
        <div className="flex flex-row">
            <Button label="Cancelar" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveAll} />
        </div>
    );

    function saveAll() {
        const fieldWithInvalidClass = Array.from(document.getElementsByClassName('p-invalid'));

        //se houver campo inválido
        if (fieldWithInvalidClass.length > 0) return;
        //salva durationService e intervalService do profissional
        if (professional?.id && professional?.durationService && professional?.intervalService) updateProfessional(professional);

        //salva professionalSchedule
        if (professional?.id && professionalScheduleForm) {
            const professionalSchedule = convertToProfessionalSchedule(professionalScheduleForm);
            console.log(professionalSchedule);
            if (professionalSchedule) {
                if (professional?.professionalSchedule?.id) {
                    professionalSchedule.id = professional.professionalSchedule.id;
                    professionalSchedule.professionalId = professional.id;
                    updateProfessionalSchedule(professionalSchedule);
                } else {
                    professionalSchedule.id = null;
                    professionalSchedule.professionalId = professional.id;
                    console.log(professionalSchedule);
                    createProfessionalSchedule(professionalSchedule);
                }

                getAllProfessional(); //atualiza listagem de profissionais
            }
        }
        hideDialog();
    }

    //console.log(professionalScheduleForm);

    return (
        <>
            <div className="formgrid grid mt-5">
                <div className="field col">
                    <span className="p-float-label">
                        <InputNumber id="durationService" format={false} value={professional?.durationService} onValueChange={(e) => onInputNumberChange(e, 'durationService')} />
                        <label htmlFor="durationService">Duração da consulta/serviço</label>
                    </span>
                </div>
                <div className="field col">
                    <span className="p-float-label">
                        <InputNumber id="intervalService" format={false} value={professional?.intervalService} onValueChange={(e) => onInputNumberChange(e, 'intervalService')} />
                        <label htmlFor="intervalService">Intervalo entre consulta/serviço</label>
                    </span>
                </div>
            </div>
            <div className="p-fluid mt-4">
                <h6>Horários de atendimento/serviço</h6>
                <div className="field grid mt-4">
                    <label htmlFor="monday" className="col-12 mb-0 md:col-2 md:mb-0"></label>
                    <div className="col-12 md:col-2">
                        <label htmlFor="monday" className="col-12 mb-0 md:col-2 md:mb-0 text-purple-400">
                            Início manhã
                        </label>
                    </div>
                    <div className="col-12 md:col-2">
                        <label htmlFor="monday" className="col-12 mb-0 md:col-2 md:mb-0 text-purple-400">
                            Fim manhã
                        </label>
                    </div>
                    <div className="col-12 md:col-2">
                        <label htmlFor="monday" className="col-12 mb-0 md:col-2 md:mb-0 text-purple-400">
                            Início tarde
                        </label>
                    </div>
                    <div className="col-12 md:col-2">
                        <label htmlFor="monday" className="col-12 mb-0 md:col-2 md:mb-0 text-purple-400">
                            Fim tarde
                        </label>
                    </div>
                </div>
                <div className="field grid mt-1">
                    <label htmlFor="monday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Segunda feira
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningMonday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningMonday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningMonday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningMonday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningMonday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningMonday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningMonday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningMonday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningMonday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningMonday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningMonday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningMonday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningMonday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningMonday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningMonday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningMonday)
                            })}
                        ></InputMask>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="tuesday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Terça feira
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningTuesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningTuesday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningTuesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningTuesday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningTuesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningTuesday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningTuesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningTuesday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningTuesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningTuesday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningTuesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningTuesday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningTuesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningTuesday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningTuesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningTuesday)
                            })}
                        ></InputMask>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="wednesday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Quarta feira
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningWednesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningWednesday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningWednesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningWednesday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningWednesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningWednesday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningWednesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningWednesday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningWednesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningWednesday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningWednesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningWednesday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningWednesday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningWednesday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningWednesday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningWednesday)
                            })}
                        ></InputMask>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="thursday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Quinta feira
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningThursday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningThursday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningThursday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningThursday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningThursday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningThursday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningThursday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningThursday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningThursday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningThursday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningThursday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningThursday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningThursday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningThursday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningThursday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningThursday)
                            })}
                        ></InputMask>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="friday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Sexta feira
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningFriday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningFriday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningFriday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningFriday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningFriday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningFriday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningFriday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningFriday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningFriday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningFriday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningFriday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningFriday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningFriday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningFriday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningFriday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningFriday)
                            })}
                        ></InputMask>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="saturday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Sábado
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningSaturday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningSaturday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningSaturday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningSaturday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningSaturday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningSaturday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningSaturday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningSaturday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningSaturday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningSaturday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningSaturday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningSaturday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningSaturday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningSaturday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningSaturday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningSaturday)
                            })}
                        ></InputMask>
                    </div>
                </div>
                <div className="field grid">
                    <label htmlFor="sunday" className="col-12 mb-2 md:col-2 md:mb-0">
                        Domingo
                    </label>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniMorningSunday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniMorningSunday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniMorningSunday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniMorningSunday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinMorningSunday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinMorningSunday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinMorningSunday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinMorningSunday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrIniEveningSunday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrIniEveningSunday}
                            onChange={(e) => onInputMaskChange(e, 'hrIniEveningSunday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrIniEveningSunday)
                            })}
                        ></InputMask>
                    </div>
                    <div className="col-12 md:col-2">
                        <InputMask
                            id="hrFinEveningSunday"
                            mask="99:99"
                            value={professionalScheduleForm?.hrFinEveningSunday}
                            onChange={(e) => onInputMaskChange(e, 'hrFinEveningSunday')}
                            className={classNames({
                                'p-invalid': !validTime(professionalScheduleForm?.hrFinEveningSunday)
                            })}
                        ></InputMask>
                    </div>
                </div>
            </div>
            <div className="flex justify-content-end formgrid grid mt-5">{ButtonsFooter}</div>
        </>
    );
}

export default JornadaHorariosFormDialog;
