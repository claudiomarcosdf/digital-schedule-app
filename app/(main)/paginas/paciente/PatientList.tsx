'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { classNames } from 'primereact/utils';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import type { Patient } from '../../../../types/types';
import { usePatientStore } from '../../../../store/PatientStore';
import PagientFormDialog from './PatientFormDialog';
import DeleteDialog from '../../../../common/DeleteDialog';
import { formatCpfToView, formatDateBr, formatPhone } from '../../../../helpers/utils';
//import { getPatients } from '../../../../libs/apiPatients';

const PatientList = () => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setglobalFilterValue] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [loading, setLoading] = useState(true);

    const setPatient = usePatientStore((state) => state.setPatient);
    const patient = usePatientStore((state) => state.patient);
    const patients = usePatientStore((state) => state.patients);
    const getPatients = usePatientStore((state) => state.getAllPatient);
    const removePatient = usePatientStore((state) => state.removePatient);

    const list = useCallback(async () => {
        await getPatients();
    }, []);

    useEffect(() => {
        //getPatients().then((data) => setPatients(data));
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

    const editPatient = (patient: Patient) => {
        setTitleDialog('Atualizar dados do Paciente');
        setPatient({ ...patient });
        setOpenDialog(true);
    };

    const confirmDeletePatient = (patient: Patient) => {
        setPatient({ ...patient });
        setDeleteDialog(true);
    };

    const statusBodyTemplate = (rowData: Patient) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-thumbs-up': rowData.person.active,
                    'text-pink-500 pi-thumbs-down': !rowData.person.active
                })}
            ></i>
        );
    };

    const actionBodyTemplate = (rowData: Patient) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded text severity="info" className="mr-2" onClick={() => editPatient(rowData)} />
                <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDeletePatient(rowData)} disabled={!rowData.person.active} />
            </>
        );
    };

    const birthDayBodyTemplate = (rowData: Patient) => {
        return formatDateBr(rowData.person.birthDay || '');
    };

    const cpfBodyTemplate = (rowData: Patient) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return formatCpfToView(rowData.person.cpf || '');
    };

    const phoneBodyTemplate = (rowData: Patient) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return formatPhone(rowData.person.phone || '');
    };

    const rowClass = (rowData: Patient) => {
        return {
            'p-inactive': rowData.person.active == false
        };
    };

    const header = renderHeader();

    const newPacienteClick = () => {
        setTitleDialog('Cadastrar Paciente');
        setPatient(null);
        setOpenDialog(true);
    };

    const hideDialog = () => {
        setOpenDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const onRemovePatient = () => {
        //remover paciente logicamente
        if (patient) {
            removePatient(patient);
        }
        setDeleteDialog(false);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Pacientes</h5>
                    <div className="flex justify-content-between mb-2">
                        <p>Lista de pacientes cadastrados.</p>
                        <Button label="Novo Paciente" icon="pi pi-plus" onClick={newPacienteClick} />
                    </div>

                    <DataTable
                        value={patients}
                        paginator
                        filters={filters}
                        rowClassName={rowClass}
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        loading={loading}
                        emptyMessage="Nenhum paciente cadastrado."
                        header={header}
                    >
                        <Column field="nickName" filter header="Apelido" filterPlaceholder="buscar por apelido" style={{ minWidth: '12rem' }} />
                        <Column field="person.fullName" header="Nome" filter filterField="person.fullName" filterPlaceholder="Buscar pelo name" style={{ minWidth: '24rem' }} />
                        <Column field="person.birthDay" header="Dt Nascimento" filterField="person.birthDay" body={birthDayBodyTemplate} style={{ minWidth: '10rem' }} />
                        <Column field="person.cpf" header="Cpf" filterField="representative" body={cpfBodyTemplate} showFilterMatchModes={false} style={{ minWidth: '10rem' }} />
                        <Column field="person.phone" header="Telefone" filterField="balance" body={phoneBodyTemplate} dataType="numeric" style={{ minWidth: '10rem' }} />
                        <Column field="person.active" header="Status" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '5rem' }} body={statusBodyTemplate} />
                        <Column header="Ações" body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>

                <PagientFormDialog title={titleDialog} visible={openDialog} hideDialog={hideDialog} />
                <DeleteDialog message={`Confirma a exclusão do paciente ${patient?.person.fullName}`} visible={deleteDialog} hideDeleteDialog={hideDeleteDialog} removeClick={onRemovePatient} />
            </div>
        </div>
    );
};

export default PatientList;
