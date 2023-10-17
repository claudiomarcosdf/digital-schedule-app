'use client';

import React, { useEffect, useState } from 'react';

import { DateSelectArg, EventApi, EventClickArg, FormatterInput, formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Dropdown } from 'primereact/dropdown';
import ScheduleTypes from './ScheduleTypes';
import { Professional } from '../../../../types/professional';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import { useScheduleStore } from '../../../../store/ScheduleStore';
import { getFormatedDate } from '../../../helpers/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BlockUI } from 'primereact/blockui';

const comboProfessionalStyle = { minWidth: '250px', borderRadius: '8px', fontWeight: 'bolder' };

const eventTimeFormat: FormatterInput = {
    hour: '2-digit',
    minute: '2-digit',
    omitZeroMinute: false
};

const events = [{ title: '\u2013 Fulano de Tals ', start: '2023-10-16T18:00:00', backgroundColor: '#926D00', borderColor: '#926D00' }];

type stateType = {
    weekendsVisible: boolean;
    currentEvents: EventApi[];
};

const SchedulePage = () => {
    const [loading, setLoading] = useState(false);
    const [dropdownValue, setDropdownValue] = useState<Professional | null>(null);
    const [state, setState] = useState<stateType>({
        weekendsVisible: true,
        currentEvents: []
    });

    const professionalType = useProfessionalTypeStore((state) => state.professionalType);
    const getProfessionalsByType = useProfessionalStore((state) => state.getProfessionalsByType);
    const professionals = useProfessionalStore((state) => state.professionals);
    const getSchedulesByProfessional = useScheduleStore((state) => state.getSchedulesByProfessional);
    const schedules = useScheduleStore((state) => state.schedules);

    useEffect(() => {
        getProfessionalsByType(professionalType?.id || 0);
    }, [professionalType]);

    const handleDateClick = (arg: any) => {
        alert(arg.dateStr);
    };

    const handleNavigationClick = (arg: any) => {
        setLoading(true);

        const dataInicio = getFormatedDate(arg.view.currentStart);
        const dataFim = getFormatedDate(arg.view.currentEnd);

        setTimeout(() => {
            setLoading(false);
        }, 4000);

        //alert('Navigation click inicio: ' + dataInicio + '\n' + 'Fim: ' + dataFim);
    };

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        let title = prompt('Please enter a new title for your event');
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            });
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove();
        }
    };

    const handleEvents = (events: EventApi[]) => {
        setState({ ...state, currentEvents: events });
    };

    function renderEventContent(eventInfo: any) {
        return (
            <>
                <b>{eventInfo.timeText}</b>
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

    const handleDropdown = (professional: Professional | null) => {
        setDropdownValue(professional);
        const professionalTypeId: number = professionalType?.id || 0;
        const professionalId: number = professional?.id || 0;
        getSchedulesByProfessional(professionalTypeId, professionalId);
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
                                    <Dropdown style={comboProfessionalStyle} value={dropdownValue} onChange={(e) => handleDropdown(e.value)} options={professionals} optionLabel="nickName" placeholder="Selecione o profissional" />
                                </div>
                            </div>
                            <BlockUI blocked={loading}>
                                {loading && <ProgressSpinner className="overlay-spinner" />}
                                <FullCalendar
                                    height={700}
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
                                    navLinks={true}
                                    // customButtons={{
                                    //     prev: {
                                    //         text: 'Prev',
                                    //         click: function (date) {
                                    //             // so something before
                                    //             console.log(date);
                                    //             alert('PREV button is going to be executed ' + date);
                                    //             // do the original command
                                    //             //calendar.prev();
                                    //         }
                                    //     },
                                    //     next: {
                                    //         text: 'Next',
                                    //         click: function (date) {
                                    //             // so something before
                                    //             alert('NEXT button is going to be executed ' + date);
                                    //             // do the original command
                                    //             //calendar.next();
                                    //         }
                                    //     }
                                    // }}
                                    datesSet={handleNavigationClick}
                                    eventTimeFormat={eventTimeFormat}
                                    //dateClick={handleDateClick}
                                    nowIndicator={true}
                                    initialEvents={INITIAL_EVENTS}
                                    eventClick={handleEventClick}
                                    eventContent={renderEventContent}
                                    select={handleDateSelect}
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
                            </BlockUI>
                        </div>
                    </div>
                </div>
            </div>
            <div className="demo-app-sidebar-section">
                <h2>All Events ({state.currentEvents.length})</h2>
                <ul>{state.currentEvents.map(renderSidebarEvent)}</ul>
            </div>
        </>
    );
};

export default SchedulePage;
