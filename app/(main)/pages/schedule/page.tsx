'use client';

import React, { useState } from 'react';

import { DateSelectArg, EventApi, EventClickArg, FormatterInput, formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
//import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import brLocale from '@fullcalendar/core/locales/pt-br';

import { INITIAL_EVENTS, createEventId } from './event-utils';

const eventTimeFormat: FormatterInput = {
    hour: '2-digit',
    minute: '2-digit',
    omitZeroMinute: false
};

const events = [{ title: '\u2013 Fulano de Tal ', start: new Date() }];

type stateType = {
    weekendsVisible: boolean;
    currentEvents: EventApi[];
};

const SchedulePage = () => {
    const [state, setState] = useState<stateType>({
        weekendsVisible: true,
        currentEvents: []
    });

    const handleDateClick = (arg) => {
        alert(arg.dateStr);
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

    function renderSidebarEvent(event) {
        return (
            <li key={event.id}>
                {/* <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b> */}
                <b>{` ${formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric', locale: 'pt-br', hour: '2-digit', minute: '2-digit' })} `}</b>
                <i>{event.title}</i>
            </li>
        );
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Agenda</h5>
                    <div className="">
                        <FullCalendar
                            locale={brLocale}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            eventTimeFormat={eventTimeFormat}
                            //dateClick={handleDateClick}
                            nowIndicator={true}
                            initialEvents={INITIAL_EVENTS}
                            eventClick={handleEventClick}
                            eventContent={renderEventContent}
                            select={handleDateSelect}
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={state.weekendsVisible}
                            events={events}
                            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                            /* you can update a remote database when these fire:
                            eventAdd={function(){}}
                            eventChange={function(){}}
                            eventRemove={function(){}}    
                        */
                        />
                    </div>
                </div>

                <div className="demo-app-sidebar-section">
                    <h2>All Events ({state.currentEvents.length})</h2>
                    <ul>{state.currentEvents.map(renderSidebarEvent)}</ul>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;
