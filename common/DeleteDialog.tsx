import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const DeleteDialog = ({ message, visible, hideDeleteDialog, removeClick }: any) => {
    const onHideDialog = () => {
        hideDeleteDialog();
    };

    function onRemoveClick() {
        removeClick();
    }

    const deleteDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={onRemoveClick} />
        </>
    );

    return (
        <>
            <Dialog visible={visible} style={{ width: '550px' }} header="Confirme" modal footer={deleteDialogFooter} onHide={hideDeleteDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {message && <span>{`${message} ?`}</span>}
                </div>
            </Dialog>
        </>
    );
};

export default DeleteDialog;
