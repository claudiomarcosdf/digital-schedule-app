import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { initialProcedure, useProcedureStore } from '../../../../store/ProcedureStore';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { Procedure } from '../../../../types/procedure';
import { ProfessionalType } from '../../../../types/professional';
import { validPrice } from '../../../../helpers/utils';

const ProcedureFormDialog = ({ title, visible, hideDialog }: any) => {
    const [procedure, setProcedure] = useState<Procedure | null>(initialProcedure);
    const [submitted, setSubmitted] = useState(false);

    const getProfessionalTypes = useProfessionalTypeStore((state) => state.getAllProfessionalTypes);
    const professionalTypes = useProfessionalTypeStore((state) => state.professionalTypes);
    const createProcedure = useProcedureStore((state) => state.createProcedure);
    const updateProcedure = useProcedureStore((state) => state.updateProcedure);
    const procedureStore = useProcedureStore((state) => state.procedure);

    useEffect(() => {
        if (professionalTypes.length == 0) getProfessionalTypes();
        setProcedure(procedureStore || initialProcedure);
    }, [procedureStore]);

    const onHideDialog = () => {
        setProcedure(initialProcedure);
        setSubmitted(false);
        hideDialog();
    };

    const procedureDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveProcedure} />
        </>
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        // @ts-ignore comment
        setProcedure({ ...procedure, [name]: val });
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value;
        // @ts-ignore comment
        setProcedure({ ...procedure, [name]: val });
    };

    const onDropdownValue = (e: DropdownChangeEvent) => {
        const dropdown: ProfessionalType = e.value;
        let _professionalType = { ...procedure?.professionalType };
        _professionalType.id = dropdown.id;
        _professionalType.name = dropdown.name;
        _professionalType.active = dropdown.active;

        // @ts-ignore comment
        setProcedure({ ...procedure, professionalType: _professionalType });
    };

    const onInputSwitchChange = (e: InputSwitchChangeEvent, name: string) => {
        const val = e.value;
        // @ts-ignore comment
        setProcedure({ ...procedure, [name]: val });
    };

    function saveProcedure() {
        setSubmitted(true);

        if (procedure?.name && procedure.price) {
            if (procedure?.id) {
                updateProcedure(procedure);
            } else {
                //procedure.name = '';
                createProcedure(procedure);
                // toast.current?.show({
                //     severity: 'error',
                //     summary: 'Sucesso',
                //     detail: 'Procedimento criado',
                //     life: 3000
                // });
            }
            hideDialog();
        }
    }

    return (
        <>
            <Dialog visible={visible} style={{ width: '550px' }} header={title} modal className="p-fluid" footer={procedureDialogFooter} onHide={hideDialog}>
                <div className="formgrid grid mt-4">
                    <div className="field col">
                        <span className="p-float-label">
                            <InputText
                                id="nickName"
                                value={procedure?.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !procedure?.name
                                })}
                            />
                            <label htmlFor="nickName">Nome do Procedimento</label>
                        </span>
                        {submitted && !procedure?.name && <small className="p-invalid">Nome do procedimento é obrigatório.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-4">
                    <div className="field col">
                        <span className="p-float-label">
                            <InputNumber
                                id="price"
                                value={procedure?.price}
                                onValueChange={(e) => onInputNumberChange(e, 'price')}
                                mode="currency"
                                currency="BRL"
                                locale="pt-BR"
                                min={0}
                                minFractionDigits={2}
                                className={classNames({
                                    'p-invalid': submitted && !validPrice(procedure?.price)
                                })}
                            />
                            <label htmlFor="nickName">Preço</label>
                        </span>
                        {submitted && !validPrice(procedure?.price) && <small className="p-invalid">Preço é obrigatório.</small>}
                    </div>
                </div>
                <div className="formgrid grid mt-4">
                    <div className="col-8 mb-3">
                        <Dropdown
                            value={procedure?.professionalType}
                            onChange={(e) => onDropdownValue(e)}
                            options={professionalTypes}
                            optionLabel="name"
                            placeholder="Procedimento para..."
                            required
                            className={classNames({
                                'p-invalid': submitted && !procedure?.professionalType.id
                            })}
                        />
                    </div>
                    <div className="col-4 flex justify-content-end mt-1">
                        <label htmlFor="status" className="mr-2">
                            {procedure?.active ? 'Ativo' : 'Inativo'}
                        </label>
                        <InputSwitch id="status" checked={procedure?.active ?? true} onChange={(e) => onInputSwitchChange(e, 'active')} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ProcedureFormDialog;
