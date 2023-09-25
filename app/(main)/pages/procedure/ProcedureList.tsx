'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { useProcedureStore } from '../../../../store/ProcedureStore';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Procedure } from '../../../../types/procedure';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { classNames } from 'primereact/utils';

const ProcedureList = () => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setglobalFilterValue] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [titleDialog, setTitleDialog] = useState('');
    const [loading, setLoading] = useState(true);
    const [professionalType, setProfessionalType] = useState();

    const getProfessionalTypes = useProfessionalTypeStore((state) => state.getAllProfessionalTypes);
    const professionalTypes = useProfessionalTypeStore((state) => state.professionalTypes);
    const getProcedures = useProcedureStore((state) => state.getProceduresByProfessionalType);
    const setProcedure = useProcedureStore((state) => state.setProcedure);
    const procedures = useProcedureStore((store) => store.procedures);

    const listProfessionalTypes = useCallback(async () => {
        await getProfessionalTypes();
    }, []);

    useEffect(() => {
        listProfessionalTypes();
        setLoading(false);
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
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

    const clearFilter = () => {
        initFilters();
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

    const header = renderHeader();

    const rowClass = (rowData: Procedure) => {
        return {
            'p-inactive': rowData.active == false
        };
    };

    const statusBodyTemplate = (rowData: Procedure) => {
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-thumbs-up': rowData.active,
                    'text-pink-500 pi-thumbs-down': !rowData.active
                })}
            ></i>
        );
    };

    const actionBodyTemplate = (rowData: Procedure) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded text severity="info" className="mr-2" onClick={() => editProcedure(rowData)} />
                <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDeleteProcedure(rowData)} />
            </>
        );
    };

    const editProcedure = (procedure: Procedure) => {
        setTitleDialog('Atualizar Procedimento');
        setProcedure({ ...procedure });
        setOpenDialog(true);
    };

    const confirmDeleteProcedure = (procedure: Procedure) => {
        setProcedure({ ...procedure });
        setDeleteDialog(true);
    };

    const newProcedimentoClick = () => {
        setTitleDialog('Cadastrar Procedimento');
        setProcedure(null);
        setOpenDialog(true);
    };

    const handleSelectProfessionalType = (e: DropdownChangeEvent) => {
        const professionalTypeSelected = e.value;
        setProfessionalType(professionalTypeSelected);
        getProcedures(professionalTypeSelected?.id);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Procedimentos</h5>
                    <div className="flex justify-content-between mb-2">
                        <p>Lista de procedimentos/serviços cadastrados.</p>
                        <Button label="Novo Procedimento" icon="pi pi-plus" onClick={newProcedimentoClick} />
                    </div>
                    <div className="mb-2">
                        <Dropdown
                            value={professionalType}
                            onChange={(e) => handleSelectProfessionalType(e)}
                            options={professionalTypes}
                            optionLabel="name"
                            placeholder="Selecione o tipo de profissional"
                            required
                            style={{ minWidth: '280px', fontWeight: 'semi-bold' }}
                        />
                    </div>
                    <DataTable
                        value={procedures}
                        paginator
                        filters={filters}
                        rowClassName={rowClass}
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={10}
                        dataKey="id"
                        filterDisplay="menu"
                        loading={loading}
                        emptyMessage="Nenhum procedimento encontrado para o tipo de profissional selecionado."
                        header={header}
                    >
                        <Column field="name" filter header="Procedimento" filterField="name" filterPlaceholder="buscar nome do procedimento" style={{ minWidth: '24rem' }} />
                        <Column field="price" header="Preço" filter style={{ minWidth: '10rem' }} />
                        <Column field="professionalType.name" header="Profissional" filter filterField="professionalType.name" filterPlaceholder="Buscar pelo tipo de profissional" style={{ minWidth: '12rem' }} />
                        <Column field="active" header="Status" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '5rem' }} body={statusBodyTemplate} />
                        <Column header="Ações" body={actionBodyTemplate} headerStyle={{ minWidth: '8rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default ProcedureList;
