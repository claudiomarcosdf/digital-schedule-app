import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import type { Professional, ProfessionalType } from '../../../../types/professional';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { maskPhone } from '../../../helpers/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { useProfessionalTypeStore } from '../../../../store/ProfessionalTypeStore';
import { initialProfessional, useProfessionalStore } from '../../../../store/ProfessionalStore';

export default function DadosPessoaisFormDialog({ hideDialog }: any) {
    const [professional, setProfessional] = useState<Professional | null>(initialProfessional);
    const [submitted, setSubmitted] = useState(false);

    const getProfessionalTypes = useProfessionalTypeStore((state) => state.getAllProfessionalTypes);
    const professionalTypes = useProfessionalTypeStore((state) => state.professionalTypes);
    const createProfessional = useProfessionalStore((state) => state.createProfessional);
    const updateProfessional = useProfessionalStore((state) => state.updateProfessional);
    const professionalStore = useProfessionalStore((state) => state.professional);

    useEffect(() => {
        if (professionalTypes.length == 0) getProfessionalTypes();

        setProfessional(professionalStore || initialProfessional);
    }, [professionalStore]);

    const onGenderChange = (e: RadioButtonChangeEvent) => {
        let _person = { ...professional?.person };
        _person.gender = e.value;
        // @ts-ignore comment
        setProfessional({ ...professional, person: _person });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        //let _professional = { ...professional };
        // _professional[`${name}`] = val;
        // @ts-ignore comment
        setProfessional({ ...professional, [name]: val });
    };

    const onInputNumberDocumentChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || null;
        // @ts-ignore comment
        setProfessional({ ...professional, [name]: val });
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

    const onInputSwitchChange = (e: InputSwitchChangeEvent, name: string) => {
        const val = e.value;
        onChangePerson(name, val);
    };

    const onDropdownValue = (e: DropdownChangeEvent) => {
        const dropdown: ProfessionalType = e.value;
        let _professionalType = { ...professional?.professionalType };
        _professionalType.id = dropdown.id;
        _professionalType.name = dropdown.name;
        _professionalType.active = dropdown.active;

        // @ts-ignore comment
        setProfessional({ ...professional, professionalType: _professionalType });
    };

    const onChangePerson = (name: string, value: any) => {
        let _person = { ...professional?.person };
        // @ts-ignore comment
        setProfessional({ ...professional, person: { ..._person, [name]: value } });
    };

    const onHideDialog = () => {
        setProfessional(initialProfessional);
        setSubmitted(false);
        hideDialog();
    };

    const ButtonsFooter = (
        <div className="flex flex-row">
            <Button label="Cancelar" icon="pi pi-times" text onClick={onHideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveProfessional} />
        </div>
    );

    function saveProfessional() {
        setSubmitted(true);

        if (professional?.nickName && professional?.person.fullName && professional?.professionalType.id && professional?.person.gender && professional?.document) {
            if (professional?.id) {
                updateProfessional(professional);
            } else {
                createProfessional(professional);
            }
        }
        //hideDialog(); Ao salvar manter na tela para cadastro de dados da jornada etc...
    }

    return (
        <>
            <div className="formgrid grid mt-5">
                <div className="field col">
                    <span className="p-float-label">
                        <InputText
                            id="nickName"
                            value={professional?.nickName}
                            onChange={(e) => onInputChange(e, 'nickName')}
                            required
                            autoFocus
                            className={classNames({
                                'p-invalid': submitted && !professional?.nickName
                            })}
                        />
                        <label htmlFor="nickName">Primeiro Nome/Apelido</label>
                    </span>
                    {submitted && !professional?.nickName && <small className="p-invalid">Primeiro nome é obrigatório.</small>}
                </div>
                <div className="field col-3">
                    <span className="p-float-label">
                        <InputText id="birthDay" type="date" value={professional?.person.birthDay} onChange={(e) => onInputChangePerson(e, 'birthDay')} style={{ height: '35px' }} />
                        <label htmlFor="birthDay">Data nascimento</label>
                    </span>
                </div>
            </div>
            <div className="field mt-3">
                <span className="p-float-label">
                    <InputText
                        id="fullName"
                        value={professional?.person.fullName}
                        onChange={(e) => onInputChangePerson(e, 'fullName')}
                        required
                        className={classNames({
                            'p-invalid': submitted && !professional?.person.fullName
                        })}
                    />
                    <label htmlFor="fullName">Nome completo</label>
                </span>
                {submitted && !professional?.person.fullName && <small className="p-invalid">Nome é obrigatório.</small>}
            </div>
            <div className="field mt-5">
                <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-at" />
                    <InputText id="email" value={professional?.person.email} onChange={(e) => onInputChangePerson(e, 'email')} />
                    <label htmlFor="email">Email</label>
                </span>
            </div>

            <div className="field">
                <label className="mb-3">Gênero</label>
                <div className="formgrid grid">
                    <div className="field-radiobutton col-4">
                        <RadioButton
                            inputId="masculino"
                            name="gender"
                            value="MASCULINO"
                            onChange={onGenderChange}
                            checked={professional?.person.gender == 'MASCULINO'}
                            className={classNames({
                                'p-invalid': submitted && !professional?.person.gender
                            })}
                        />
                        <label htmlFor="category1">Masculino</label>
                    </div>
                    <div className="field-radiobutton col-4">
                        <RadioButton
                            inputId="feminino"
                            name="gender"
                            value="FEMININO"
                            onChange={onGenderChange}
                            checked={professional?.person.gender == 'FEMININO'}
                            className={classNames({
                                'p-invalid': submitted && !professional?.person.gender
                            })}
                        />
                        <label htmlFor="category2">Feminino</label>
                    </div>
                    <div className="col-4 mb-3">
                        <Dropdown
                            value={professional?.professionalType}
                            onChange={(e) => onDropdownValue(e)}
                            options={professionalTypes}
                            optionLabel="name"
                            placeholder="Tipo de profissional"
                            required
                            className={classNames({
                                'p-invalid': submitted && !professional?.professionalType.id
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="formgrid grid mt-4">
                <div className="field col">
                    <span className="p-float-label">
                        <InputMask id="cpf" mask="999.999.999-99" value={professional?.person.cpf} onChange={(e) => onInputMaskChange(e, 'cpf')}></InputMask>
                        <label htmlFor="cpf">CPF</label>
                    </span>
                </div>
                <div className="field col">
                    <span className="p-float-label">
                        <InputNumber id="rg" format={false} value={professional?.person.rg} onValueChange={(e) => onInputNumberChange(e, 'rg')} />
                        <label htmlFor="rg">Rg</label>
                    </span>
                </div>
                <div className="field col">
                    <span className="p-float-label">
                        <InputNumber
                            id="document"
                            format={false}
                            value={professional?.document}
                            onValueChange={(e) => onInputNumberDocumentChange(e, 'document')}
                            className={classNames({
                                'p-invalid': submitted && !professional?.document
                            })}
                        />
                        <label htmlFor="document">Nº CR</label>
                    </span>
                    {submitted && !professional?.document && <small className="p-invalid">Nº do Conselho é obrigatório.</small>}
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col-3">
                    <span className="p-float-label">
                        <InputMask id="zipCode" mask="99.999-999" value={professional?.person.zipCode?.toString()} onChange={(e) => onInputMaskChange(e, 'zipCode')}></InputMask>
                        <label htmlFor="zipCode">Cep</label>
                    </span>
                </div>
                <div className="field col">
                    <span className="p-float-label">
                        <InputText id="address" value={professional?.person.address} onChange={(e) => onInputChangePerson(e, 'address')} />
                        <label htmlFor="address">Endereço</label>
                    </span>
                </div>
            </div>
            <div className="formgrid grid mt-4">
                <div className="field col-4">
                    <span className="p-float-label">
                        <InputMask id="phone" mask={maskPhone(professional?.person.phone || '')} value={professional?.person.phone} onChange={(e) => onInputMaskChange(e, 'phone')}></InputMask>
                        <label htmlFor="phone">Telefone</label>
                    </span>
                </div>
                <div className="field col-4">
                    <span className="p-float-label">
                        <InputMask id="phone2" mask={maskPhone(professional?.person.phone || '')} value={professional?.person.phone2} onChange={(e) => onInputMaskChange(e, 'phone2')}></InputMask>
                        <label htmlFor="phone2">Telefone 2</label>
                    </span>
                </div>
                <div className="col-4 flex justify-content-end mt-1">
                    <label htmlFor="status" className="mr-2">
                        {professional?.person.active ? 'Ativo' : 'Inativo'}
                    </label>
                    <InputSwitch id="status" checked={professional?.person.active ?? true} onChange={(e) => onInputSwitchChange(e, 'active')} />
                </div>
            </div>
            <div className="flex justify-content-end formgrid grid mt-5">{ButtonsFooter}</div>
        </>
    );
}
