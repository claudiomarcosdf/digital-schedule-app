import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import ScheduleForm from './ScheduleForm';

const ScheduleFormDialog = ({ title, visible, hideDialog }: any) => {
    return (
        <>
            <Dialog visible={visible} style={{ width: '750px' }} header={title} modal className="p-fluid" onHide={hideDialog}>
                <TabView>
                    <TabPanel header="Agendamento">
                        <ScheduleForm hideDialog={hideDialog} />
                    </TabPanel>
                    <TabPanel header="Evento">
                        <span>Events</span>
                    </TabPanel>
                </TabView>
            </Dialog>
        </>
    );
};

export default ScheduleFormDialog;
