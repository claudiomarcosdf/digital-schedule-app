'use client';

import React, { useContext, useEffect, useState, useRef, MutableRefObject } from 'react';

import { DateSelectArg, DatesSetArg, EventApi, EventClickArg, FormatterInput, formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { Dropdown } from 'primereact/dropdown';
import ScheduleTypes from './ScheduleTypes';
import { Professional } from '../../../../types/professional';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import { initialSchedule, useScheduleStore } from '../../../../store/ScheduleStore';
import { getFormatedDate, getFormatedDateByType } from '../../../../helpers/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BlockUI } from 'primereact/blockui';
import ScheduleFormDialog from './ScheduleFormDialog';
import { Schedule } from '../../../../types/schedule';
import { Fieldset } from 'primereact/fieldset';
import { LayoutContext } from '../../../../layout/context/layoutcontext';

const comboProfessionalStyle = { minWidth: '250px', borderRadius: '8px', fontWeight: 'bolder' };

const eventTimeFormat: FormatterInput = {
    hour: '2-digit',
    minute: '2-digit',
    omitZeroMinute: false
};

type stateType = {
    weekendsVisible: boolean;
    currentEvents: EventApi[];
};

const SchedulePage = () => {
    const calendar = useRef<FullCalendar>(null);
    const containerRef = useRef() as MutableRefObject<HTMLDivElement>; //useRef<HTMLDivElement | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<stateType>({
        weekendsVisible: true,
        currentEvents: []
    });

    const { layoutState } = useContext(LayoutContext);

    const professionalType = useProfessionalTypeStore((state) => state.professionalType);
    const professionals = useProfessionalStore((state) => state.professionals);
    const setProfessional = useProfessionalStore((state) => state.setProfessional);
    const professional = useProfessionalStore((state) => state.professional);
    const getSchedulesByProfessional = useScheduleStore((state) => state.getSchedulesByProfessional);
    const schedules = useScheduleStore((state) => state.schedules);
    const setSchedule = useScheduleStore((state) => state.setSchedule);
    const getSchedule = useScheduleStore((state) => state.getSchedule);

    useEffect(() => {
        handleResize();
    }, [layoutState.staticMenuDesktopInactive]);

    const handleDateClick = (arg: any) => {
        alert(arg.dateStr);
    };

    const handleNavigationClick = async (arg: DatesSetArg) => {
        setLoading(true);

        const startDate = getFormatedDate(arg.view.currentStart.toISOString());
        const endDate = getFormatedDate(arg.view.currentEnd.toISOString());

        const professionalTypeId: number = professionalType?.id || 0;
        const professionalId: number = professional?.id || 0;

        if (professionalTypeId && professionalId && startDate && endDate) {
            await getSchedulesByProfessional(professionalTypeId, professionalId, startDate, endDate);
        }
        setLoading(false);
        // setTimeout(() => {
        //     setLoading(false);
        // }, 4000);

        //alert('Navigation click inicio: ' + dataInicio + '\n' + 'Fim: ' + dataFim);
    };

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        //let title = prompt('Please enter a new title for your event');
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // clear date selection

        if (professional?.id) {
            const newSchedule: Schedule = initialSchedule;
            newSchedule.startDate = selectInfo.start.toString();
            newSchedule.endDate = selectInfo.start.toString();
            if (professionalType) newSchedule.professionalType = professionalType;
            newSchedule.professional = professional;
            newSchedule.procedure = null;
            newSchedule.patient = null;
            setSchedule({ ...newSchedule });

            setOpenDialog(true);
        }
    };

    const hideDialog = () => {
        updateMonthlySchedule(professional);
        setOpenDialog(false);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const idEvent = clickInfo.event.id || null;

        if (idEvent) {
            getSchedule(parseInt(idEvent));
            setOpenDialog(true);
        }
    };

    const handleEvents = (events: EventApi[]) => {
        setState({ ...state, currentEvents: events });
    };

    function renderEventContent(eventInfo: any) {
        const patient = eventInfo?.event?.extendedProps.patient;
        return (
            <>
                <b>{patient ? eventInfo.timeText : ''}</b>
                <i>{eventInfo.event.title}</i>
            </>
        );
    }

    function renderSidebarEvent(event: any) {
        return (
            <li key={event.id}>
                {/* <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b> */}
                <b>{` ${formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric', locale: 'pt-br', hour: '2-digit', minute: '2-digit' })} `}</b>
                <i>{event.title}</i>
            </li>
        );
    }

    const updateMonthlySchedule = (professional: Professional | null) => {
        const professionalTypeId: number = professionalType?.id || 0;
        const professionalId: number = professional?.id || 0;
        const currentStartDate = getFormatedDateByType(new Date().toISOString(), 'start');
        const currentEndDate = getFormatedDateByType(new Date().toISOString(), 'end');

        getSchedulesByProfessional(professionalTypeId, professionalId, currentStartDate, currentEndDate);
    };

    const handleDropdown = (professional: Professional | null) => {
        setProfessional(professional);
        updateMonthlySchedule(professional);
    };

    const handleResize = () => {
        //Atualiza o tamanho do calendário ao esconder/mostrar o menu lateral
        const calendarApi = calendar.current?.getApi();
        calendarApi?.updateSize();
        const resizeObserver = new ResizeObserver(() => calendarApi?.updateSize());
        resizeObserver.observe(containerRef?.current);
    };

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="flex card">
                        <div className="card-professionaltype">
                            <h5>Profissional</h5>
                            <ScheduleTypes />
                        </div>
                        <div className="col-10">
                            <div className="flex">
                                <h4 style={{ marginTop: '5px' }}>Agenda</h4>
                                {professionalType ? (
                                    <div>
                                        <p className="professional-legend text-primary">Profissional {professionalType?.name.toLowerCase()}</p>
                                    </div>
                                ) : (
                                    <div style={{ width: '14.8rem' }}></div>
                                )}
                                <div className="box-professional">
                                    <Dropdown style={comboProfessionalStyle} value={professional} onChange={(e) => handleDropdown(e.value)} options={professionals} optionLabel="nickName" placeholder="Selecione o profissional" />
                                </div>
                            </div>
                            <BlockUI blocked={loading}>
                                <div ref={containerRef}>
                                    {loading && <ProgressSpinner className="overlay-spinner" />}
                                    <FullCalendar
                                        ref={calendar}
                                        height={700}
                                        eventResizableFromStart={true}
                                        locale={brLocale}
                                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'dayGridMonth,timeGridWeek,timeGridDay, listDay'
                                        }}
                                        views={{
                                            dayGridMonth: {
                                                // name of view
                                                titleFormat: { year: 'numeric', month: 'long' }
                                                // other view-specific options here
                                            }
                                        }}
                                        //displayEventTime={false}
                                        navLinks={true}
                                        datesSet={handleNavigationClick}
                                        eventTimeFormat={eventTimeFormat}
                                        //dateClick={handleDateClick}
                                        nowIndicator={true}
                                        //initialEvents={INITIAL_EVENTS}
                                        eventClick={handleEventClick}
                                        eventContent={renderEventContent}
                                        select={handleDateSelect}
                                        expandRows={true}
                                        editable={false}
                                        selectable={true}
                                        selectMirror={true}
                                        dayMaxEvents={true}
                                        weekends={state.weekendsVisible}
                                        events={schedules}
                                        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                                        /* you can update a remote database when these fire:
                            eventAdd={function(){}}
                            eventChange={function(){}}
                            eventRemove={function(){}}    
                        */
                                    />
                                </div>
                            </BlockUI>
                            <Fieldset legend="Legenda" style={{ marginTop: '.5rem', fontSize: '10px' }}>
                                <span className="status-badge status-agendado">Agendado</span>
                                <span className="status-badge status-confirmado">Confirmado</span>
                                <span className="status-badge status-presente">Presente</span>
                                <span className="status-badge status-finalizado">Finalizado</span>
                                <span className="status-badge status-cancelado">Cancelado</span>
                                <span className="status-badge status-evento">Bloqueio de horário</span>
                            </Fieldset>
                        </div>
                    </div>
                    <ScheduleFormDialog title={professional?.nickName} visible={openDialog} hideDialog={hideDialog} />
                </div>
            </div>
            <div className="demo-app-sidebar-section">
                <h2>Agendamentos ({state.currentEvents.length})</h2>
                <ul>{state.currentEvents.map(renderSidebarEvent)}</ul>
            </div>
        </>
    );
};

export default SchedulePage;
