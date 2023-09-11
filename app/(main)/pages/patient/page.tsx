'use client';
import React, { useEffect, useState } from 'react';

import { classNames } from 'primereact/utils';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import type { Patient } from '../../../../types/types';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { getPatients } from '../../../libs/apiPatients';
import { formatCpfToView, formatPhone } from '../../../helpers/utils';

const PatientPage = () => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue1, setGlobalFilterValue1] = useState('');
    const [patients, setPatients] = useState<Patient.Patient[]>([]);

    useEffect(() => {
        getPatients().then((data) => setPatients(data));
    }, []);

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
        setGlobalFilterValue1('');
    };

    const onGlobalFilterChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        //console.log(value);

        let _filters = { ...filters };
        (_filters['global'] as any).value = value;

        setFilters(_filters);
        setGlobalFilterValue1(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder="Buscar..." />
                </span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Patient.Patient) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-thumbs-up': rowData.person.active,
                    'text-pink-500 pi-thumbs-down': !rowData.person.active
                })}
            ></i>
        );
    };

    const cpfBodyTemplate = (rowData: Patient.Patient) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return formatCpfToView(rowData.person.cpf);
    };

    const phoneBodyTemplate = (rowData: Patient.Patient) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return formatPhone(rowData.person.phone);
    };

    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Pacientes</h5>
                    <p>Lista de pacientes cadastrados.</p>
                    <DataTable value={patients} paginator filters={filters} className="p-datatable-gridlines" showGridlines rows={10} dataKey="id" filterDisplay="menu" loading={false} emptyMessage="Nenhum paciente cadastrado." header={header}>
                        <Column field="nickName" filter header="Apelido" filterPlaceholder="Search by nickname" style={{ minWidth: '12rem' }} />
                        <Column field="person.fullName" header="Nome" filter filterField="person.fullName" filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                        <Column field="person.birthDay" header="Dt Nascimento" filterField="person.birthDay" style={{ minWidth: '12rem' }} body={null} filterPlaceholder="Search by country" />
                        <Column field="person.cpf" header="Cpf" filterField="representative" body={cpfBodyTemplate} showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }} />
                        <Column field="person.phone" header="Telefone" filterField="balance" body={phoneBodyTemplate} dataType="numeric" style={{ minWidth: '10rem' }} />
                        <Column field="person.active" header="Status" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={statusBodyTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default PatientPage;
