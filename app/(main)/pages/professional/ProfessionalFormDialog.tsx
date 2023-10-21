import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import PersonalDataForm from './PersonalDataForm';
import WorkHoursForm from './WorkHoursForm';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';

const ProfessionalFormDialog = ({ title, visible, hideDialog }: any) => {
    const professionalStore = useProfessionalStore((state) => state.professional);

    return (
        <>
            <Dialog visible={visible} style={{ width: '750px' }} header={title} modal className="p-fluid" onHide={hideDialog}>
                <TabView>
                    <TabPanel header="Dados pessoais">
                        <PersonalDataForm hideDialog={hideDialog} />
                    </TabPanel>
                    <TabPanel header="Jornada e horários" disabled={professionalStore?.id ? false : true}>
                        <WorkHoursForm hideDialog={hideDialog} />
                    </TabPanel>
                </TabView>
            </Dialog>
        </>
    );
};

export default ProfessionalFormDialog;
