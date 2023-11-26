import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { initialSchedule, useScheduleStore } from '../../../../store/ScheduleStore';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import { Schedule } from '../../../../types/schedule';
import { addMinutes, getColorStatus, getFormatedDateTime } from '../../../../helpers/utils';

interface Status {
    name: string;
    color: string;
}

const EventForm = ({ hideDialog }: any) => {
    const [schedule, setSchedule] = useState<Schedule | null>(initialSchedule);
    const [submitted, setSubmitted] = useState(false);
    const statusList: Status[] = [{ name: 'EVENTO', color: '#b2ddb4' }];

    const { schedule: scheduleStore, createSchedule, updateSchedule } = useScheduleStore((state) => state);
    const professional = useProfessionalStore((state) => state.professional);

    useEffect(() => {
        setSchedule(scheduleStore || initialSchedule);
    }, [scheduleStore]);

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

    const ButtonsFooter = (
        <div className="flex flex-row">
            <Button label="Cancelar" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveSchedule} />
        </div>
    );

    function saveSchedule() {
        setSubmitted(true);

        if (schedule?.description && schedule.startDate && schedule.endDate) {
            const startDate = schedule.startDate ? getFormatedDateTime(new Date(schedule.startDate.toString()).toString()) : '';
            const endDate = schedule.endDate ? getFormatedDateTime(new Date(schedule.endDate.toString()).toString()) : '';
            const statusEvent = 'EVENTO';

            if (schedule?.id) {
                updateSchedule({ ...schedule, startDate, endDate, status: statusEvent });
            } else {
                createSchedule({ ...schedule, startDate, endDate, status: statusEvent });
            }
            hideDialog();
        }
    }

    //console.log('Event: ', schedule);
    return (
        <>
            <div className="formgrid grid mt-3">
                <div className="field col-12 mb-5">
                    <span className="font-italic text-600 text-lg">Período de afastamentos, congressos, palestras, cursos etc.</span>
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
                        <Dropdown id="status" value={'EVENTO'} onChange={(e) => onSelectStatus(e.value)} options={statusList} optionLabel="name" editable placeholder="Selecione um status" style={{ backgroundColor: `${getColorStatus('EVENTO')}` }} />
                        <label htmlFor="status">Status</label>
                    </span>
                </div>
            </div>

            <div className="formgrid grid mt-5">
                <div className="field col">
                    <span className="p-float-label">
                        <InputText
                            id="description"
                            value={schedule?.description}
                            onChange={(e) => onInputText(e, 'description')}
                            className={classNames({
                                'p-invalid': submitted && !schedule?.description
                            })}
                        />
                        <label htmlFor="description">Descrição</label>
                    </span>
                    {submitted && !schedule?.description && <small className="p-invalid">A descrição do evento é obrigatória.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-5">
                <div className="field col-12 mt-5"></div>
                <div className="field col-12 mt-0"></div>
            </div>
            <div className="flex justify-content-end formgrid grid mt-5">{ButtonsFooter}</div>
        </>
    );
};

export default EventForm;
