'use client';
import React, { useCallback, useEffect, useState } from 'react';

import { classNames } from 'primereact/utils';
import { DataTable, DataTableExpandedRows, DataTableFilterMeta } from 'primereact/datatable';
import type { PatientType } from '../../../../types/types';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { formatCpfToView, formatPhone } from '../../../helpers/utils';
import { usePatientStore } from '../../../../store/PatientStore';
//import { getPatients } from '../../../../libs/apiPatients';

const PatientList = () => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setglobalFilterValue] = useState('');
    //const [patients, setPatients] = useState<PatientType.Patient[]>([]);

    const create = usePatientStore((state) => state.createPatient);
    const patient = usePatientStore((state) => state.patient);
    const patients = usePatientStore((state) => state.patients);
    const getPatients = usePatientStore((state) => state.getAllPatient);

    const list = useCallback(() => {
        getPatients();
    }, []);

    useEffect(() => {
        //getPatients().then((data) => setPatients(data));
        list();
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

    const statusBodyTemplate = (rowData: PatientType.Patient) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-thumbs-up': rowData.person.active,
                    'text-pink-500 pi-thumbs-down': !rowData.person.active
                })}
            ></i>
        );
    };

    const cpfBodyTemplate = (rowData: PatientType.Patient) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return formatCpfToView(rowData.person.cpf || '');
    };

    const phoneBodyTemplate = (rowData: PatientType.Patient) => {
        //return <span className={`customer-badge status-unqualified`}>{rowData.person.cpf}</span>;
        return formatPhone(rowData.person.phone || '');
    };

    const header = renderHeader();

    const criarClick = () => {
        const createPatient: PatientType.Patient = {
            id: null,
            nickName: 'Crudio',
            person: {
                id: null,
                fullName: 'Claudio marcos',
                email: 'manu@gmail.com',
                birthDay: '1949-10-13',
                cpf: '831.345.550-00',
                rg: 123456,
                gender: 'MASCULINO',
                address: 'travessia 69 de Março de Pedro Álvares nº 23',
                zipCode: 719393602,
                phone: '61899722318',
                phone2: '',
                personType: {
                    id: 1,
                    name: 'Paciente'
                }
            }
        };

        create(createPatient);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Pacientes</h5>
                    <p>Lista de pacientes cadastrados.</p>
                    <Button onClick={criarClick}>criar</Button>
                    <DataTable value={patients} paginator filters={filters} className="p-datatable-gridlines" showGridlines rows={10} dataKey="id" filterDisplay="menu" loading={false} emptyMessage="Nenhum paciente cadastrado." header={header}>
                        <Column field="nickName" filter header="Apelido" filterPlaceholder="buscar por apelido" style={{ minWidth: '12rem' }} />
                        <Column field="person.fullName" header="Nome" filter filterField="person.fullName" filterPlaceholder="Buscar pelo name" style={{ minWidth: '24rem' }} />
                        <Column field="person.birthDay" header="Dt Nascimento" filterField="person.birthDay" style={{ minWidth: '10rem' }} body={null} />
                        <Column field="person.cpf" header="Cpf" filterField="representative" body={cpfBodyTemplate} showFilterMatchModes={false} style={{ minWidth: '10rem' }} />
                        <Column field="person.phone" header="Telefone" filterField="balance" body={phoneBodyTemplate} dataType="numeric" style={{ minWidth: '10rem' }} />
                        <Column field="person.active" header="Status" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '5rem' }} body={statusBodyTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default PatientList;
