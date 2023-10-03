import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabPanel, TabView } from 'primereact/tabview';
import DadosPessoaisFormDialog from './DadosPessoaisFormDialog';
import JornadaHorariosFormDialog from './JornadaHorariosFormDialog';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';

const ProfessionalFormDialog = ({ title, visible, hideDialog, toast }: any) => {
    const professionalStore = useProfessionalStore((state) => state.professional);

    return (
        <>
            <Dialog visible={visible} style={{ width: '750px' }} header={title} modal className="p-fluid" onHide={hideDialog}>
                <TabView>
                    <TabPanel header="Dados pessoais">
                        <DadosPessoaisFormDialog hideDialog={hideDialog} toast={toast} />
                    </TabPanel>
                    <TabPanel header="Jornada e horários" disabled={professionalStore?.id ? false : true}>
                        <JornadaHorariosFormDialog hideDialog={hideDialog} toast={toast} />
                    </TabPanel>
                </TabView>
            </Dialog>
        </>
    );
};

export default ProfessionalFormDialog;
