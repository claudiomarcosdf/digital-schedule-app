import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { initialPatient, usePatientStore } from '../../../../store/PatientStore';
import { Button } from 'primereact/button';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { PatientType } from '../../../../types/patient';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { formatDateBr } from '../../../helpers/utils';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';

const PagientFormDialog = ({ title, visible, hideDialog }: any) => {
    const [patient, setPatient] = useState<PatientType.Patient | null>(initialPatient);
    const [submitted, setSubmitted] = useState(false);

    const createPatient = usePatientStore((state) => state.createPatient);
    const patientStore = usePatientStore((state) => state.patient);

    useEffect(() => {
        setPatient(patientStore || initialPatient);
    }, [patientStore]);

    const onHideDialog = () => {
        setPatient(initialPatient);
        setSubmitted(false);
        hideDialog();
    };

    const patientDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={savePatient} />
        </>
    );

    const onGenderChange = (e: RadioButtonChangeEvent) => {
        let _person = { ...patient?.person };
        _person.gender = e.value;
        // @ts-ignore comment
        setPatient({ ...patient, person: _person });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _patient = { ...patient };
        // _patient[`${name}`] = val;
        // @ts-ignore comment
        setPatient({ ...patient, [name]: val });
    };

    const onInputChangePerson = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target && e.target.value;
        onChangePerson(name, val);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || null;
        onChangePerson(name, val);
    };

    const onInputMaskChange = (e: InputMaskChangeEvent, name: string) => {
        const val = e.value || null;
        onChangePerson(name, val);
    };

    const onInputDateChange = (e: CalendarChangeEvent, name: string) => {
        const val = e.value || null;
        onChangePerson(name, val);
    };

    const onInputSwitchChange = (e: InputSwitchChangeEvent, name: string) => {
        const val = e.value || null;
        onChangePerson(name, val);
    };

    const onChangePerson = (name: string, value: any) => {
        let _person = { ...patient?.person };
        // @ts-ignore comment
        setPatient({ ...patient, person: { ..._person, [name]: value } });
    };

    function savePatient() {
        setSubmitted(true);
        console.log(patient);
        //createPatient(patient);
        //hideDialog();
    }

    return (
        <>
            <Dialog visible={visible} style={{ width: '750px' }} header={title} modal className="p-fluid" footer={patientDialogFooter} onHide={hideDialog}>
                <div className="formgrid grid mt-4">
                    <div className="field col">
                        <span className="p-float-label">
                            <InputText
                                id="nickName"
                                value={patient?.nickName}
                                onChange={(e) => onInputChange(e, 'nickName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !patient?.nickName
                                })}
                            />
                            <label htmlFor="nickName">Primeiro Nome/Apelido</label>
                        </span>
                        {submitted && !patient?.nickName && <small className="p-invalid">Primeiro nome é obrigatório.</small>}
                    </div>
                    <div className="field col-3">
                        <span className="p-float-label">
                            <Calendar inputId="birthDay" value="07/18/74"></Calendar>
                            {/* onChange={(e) => onInputDateChange(e, 'birthDay')} */}
                            {/* <InputMask id="birthDay" mask="99/99/9999" value={patient?.person.birthDay} onChange={(e) => onInputMaskChange(e, 'birthDay')} /> */}
                            <label htmlFor="birthDay">Data nascimento</label>
                        </span>
                    </div>
                </div>
                <div className="field mt-3">
                    <span className="p-float-label">
                        <InputText
                            id="fullName"
                            value={patient?.person.fullName}
                            onChange={(e) => onInputChangePerson(e, 'fullName')}
                            required
                            className={classNames({
                                'p-invalid': submitted && !patient?.person.fullName
                            })}
                        />
                        <label htmlFor="fullName">Nome completo</label>
                    </span>
                    {submitted && !patient?.person.fullName && <small className="p-invalid">Nome é obrigatório.</small>}
                </div>
                <div className="field mt-5">
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-at" />
                        <InputText id="email" value={patient?.person.email} onChange={(e) => onInputChangePerson(e, 'email')} />
                        <label htmlFor="email">Email</label>
                    </span>
                </div>

                <div className="field">
                    <label className="mb-3">Gênero</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="masculino" name="gender" value="MASCULINO" onChange={onGenderChange} checked={patient?.person.gender == 'MASCULINO'} />
                            <label htmlFor="category1">Masculino</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="feminino" name="gender" value="FEMININO" onChange={onGenderChange} checked={patient?.person.gender == 'FEMININO'} />
                            <label htmlFor="category2">Feminino</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid mt-4">
                    <div className="field col">
                        <span className="p-float-label">
                            <InputMask id="cpf" mask="999.999.999-99" value={patient?.person.cpf} onChange={(e) => onInputMaskChange(e, 'cpf')}></InputMask>
                            <label htmlFor="cpf">CPF</label>
                        </span>
                    </div>
                    <div className="field col">
                        <span className="p-float-label">
                            <InputNumber id="rg" format={false} value={patient?.person.rg} onValueChange={(e) => onInputNumberChange(e, 'rg')} />
                            <label htmlFor="rg">Rg</label>
                        </span>
                    </div>
                </div>
                <div className="formgrid grid mt-4">
                    <div className="field col-3">
                        <span className="p-float-label">
                            <InputMask id="zipCode" mask="99.999-999" value={patient?.person.zipCode?.toString()} onChange={(e) => onInputMaskChange(e, 'zipCode')}></InputMask>
                            <label htmlFor="zipCode">Cep</label>
                        </span>
                    </div>
                    <div className="field col">
                        <span className="p-float-label">
                            <InputText id="address" value={patient?.person.address} onChange={(e) => onInputChangePerson(e, 'address')} />
                            <label htmlFor="address">Endereço</label>
                        </span>
                    </div>
                </div>
                <div className="formgrid grid mt-4">
                    <div className="field col-4">
                        <span className="p-float-label">
                            <InputMask id="phone" mask="(99) 99999-9999" value={patient?.person.phone} onChange={(e) => onInputMaskChange(e, 'phone')}></InputMask>
                            <label htmlFor="phone">Telefone</label>
                        </span>
                    </div>
                    <div className="field col-4">
                        <span className="p-float-label">
                            <InputMask id="phone2" mask="(99) 99999-9999" value={patient?.person.phone2} onChange={(e) => onInputMaskChange(e, 'phone2')}></InputMask>
                            <label htmlFor="phone2">Telefone</label>
                        </span>
                    </div>
                    <div className="col-4 flex justify-content-end mt-1">
                        <label htmlFor="status" className="mr-2">
                            {patient?.person.active ? 'Ativo' : 'Inativo'}
                        </label>
                        <InputSwitch id="status" checked={patient?.person.active || true} onChange={(e) => onInputSwitchChange(e, 'active')} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default PagientFormDialog;
