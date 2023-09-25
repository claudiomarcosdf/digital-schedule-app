'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { classNames } from 'primereact/utils';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import type { Professional } from '../../../../types/types';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { formatDateBr, formatPhone } from '../../../helpers/utils';
import { useProfessionalStore } from '../../../../store/ProfessionalStore';
import DeleteDialog from '../../../../common/DeleteDialog';
import ProfessionalFormDialog from './ProfessionalFormDialog';

const ProfessionalList = () => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setglobalFilterValue] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [loading, setLoading] = useState(true);

    const setProfessional = useProfessionalStore((state) => state.setProfessional);
    const professional = useProfessionalStore((state) => state.professional);
    const professionals = useProfessionalStore((state) => state.professionals);
    const getProfessionals = useProfessionalStore((state) => state.getAllProfessional);
    const removeProfessional = useProfessionalStore((state) => state.removeProfessional);

    const list = useCallback(async () => {
        await getProfessionals();
    }, []);

    useEffect(() => {
        list();
        setLoading(false);
        initFilters();
    }, [list]);

    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            nickName: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'person.fullName': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'professionalType.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            }
        });
        setglobalFilterValue('');
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        let _filters = { ...filters };
        (_filters['global'] as any).value = value;

        setFilters(_filters);
        setglobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Limpar" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </span>
            </div>
        );
    };

    const editProfessional = (professional: Professional) => {
        console.log(professional);
        setTitleDialog('Atualizar dados do Profissional');
        setProfessional({ ...professional });
        setOpenDialog(true);
    };

    const confirmDeleteProfessional = (professional: Professional) => {
        setProfessional({ ...professional });
        setDeleteDialog(true);
    };

    const statusBodyTemplate = (rowData: Professional) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-thumbs-up': rowData.person.active,
                    'text-pink-500 pi-thumbs-down': !rowData.person.active
                })}
            ></i>
        );
    };

    const actionBodyTemplate = (rowData: Professional) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded text severity="info" className="mr-2" onClick={() => editProfessional(rowData)} />
                <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDeleteProfessional(rowData)} />
            </>
        );
    };

    const documentBodyTemplate = (rowData: Professional) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return rowData.document;
    };

    const phoneBodyTemplate = (rowData: Professional) => {
        return formatPhone(rowData.person.phone || '');
    };

    const rowClass = (rowData: Professional) => {
        return {
            'p-inactive': rowData.person.active == false
        };
    };

    const header = renderHeader();

    const newProfessionalClick = () => {
        setTitleDialog('Cadastrar Profissional');
        setProfessional(null);
        setOpenDialog(true);
    };

    const hideDialog = () => {
        setOpenDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const onRemoveProfessional = () => {
        //remover profissional logicamente
        if (professional) removeProfessional(professional);
        setDeleteDialog(false);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Profissionais</h5>
                    <div className="flex justify-content-between mb-2">
                        <p>Lista de profissionais cadastrados.</p>
                        <Button label="Novo Paciente" icon="pi pi-plus" onClick={newProfessionalClick} />
                    </div>

                    <DataTable
                        value={professionals}
                        paginator
                        filters={filters}
                        rowClassName={rowClass}
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        loading={loading}
                        emptyMessage="Nenhum profissional cadastrado."
                        header={header}
                    >
                        <Column field="nickName" filter header="Apelido" filterPlaceholder="buscar por apelido" style={{ minWidth: '12rem' }} />
                        <Column field="person.fullName" header="Nome" filter filterField="person.fullName" filterPlaceholder="Buscar pelo name" style={{ minWidth: '24rem' }} />
                        <Column field="professionalType.name" header="Profissional" filter filterField="professionalType.name" filterPlaceholder="Buscar pelo tipo de profissional" style={{ minWidth: '12rem' }} />
                        <Column field="document" header="Nº CR" filterField="representative" body={documentBodyTemplate} showFilterMatchModes={false} style={{ minWidth: '6rem' }} />
                        <Column field="person.phone" header="Telefone" filterField="balance" body={phoneBodyTemplate} dataType="numeric" style={{ minWidth: '10rem' }} />
                        <Column field="person.active" header="Status" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '5rem' }} body={statusBodyTemplate} />
                        <Column header="Ações" body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>

                <ProfessionalFormDialog title={titleDialog} visible={openDialog} hideDialog={hideDialog} />
                <DeleteDialog message={`Confirma a exclusão do profissional ${professional?.person.fullName}`} visible={deleteDialog} hideDeleteDialog={hideDeleteDialog} removeClick={onRemoveProfessional} />
            </div>
        </div>
    );
};

export default ProfessionalList;
