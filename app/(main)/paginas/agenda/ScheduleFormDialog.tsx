import React from 'react';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import ScheduleForm from './ScheduleForm';
import EventForm from './EventForm';
import { useScheduleStore } from '../../../../store/ScheduleStore';

const ScheduleFormDialog = ({ title, visible, hideDialog }: any) => {
    const schedule = useScheduleStore((state) => state.schedule);

    const getActiveTabIndex = () => {
        if (schedule?.id && !schedule?.patient?.id) {
            return 1;
        }
        return 0;
    };

    const disableTabPanel = (type: string) => {
        if (!schedule?.id) return false;

        if (type == 'event' && schedule?.id && !schedule?.patient?.id) return false;
        if (type == 'schedule' && schedule?.id && schedule?.patient?.id) return false;

        return true;
    };

    return (
        <>
            <Dialog visible={visible} style={{ width: '750px' }} header={title} modal className="p-fluid" onHide={hideDialog}>
                <TabView activeIndex={getActiveTabIndex()}>
                    <TabPanel header="Agendamento" disabled={disableTabPanel('schedule')}>
                        <ScheduleForm hideDialog={hideDialog} />
                    </TabPanel>
                    <TabPanel header="Bloqueio de horário" disabled={disableTabPanel('event')}>
                        <EventForm hideDialog={hideDialog} />
                    </TabPanel>
                </TabView>
            </Dialog>
        </>
    );
};

export default ScheduleFormDialog;
