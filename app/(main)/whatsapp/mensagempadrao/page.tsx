'use client';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { useWhatsappStore } from '../../../../store/WhatsappStore';
import { FileMessage } from '../../../../types/whatsapp';

type messageType = {
    schedule: string;
    confirmation: string;
};

const MensagemPadraoPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [messages, setMessages] = useState<messageType>({
        schedule: '',
        confirmation: ''
    });

    const getMessageDefault = useWhatsappStore((state) => state.getMessage);
    const messageSchedule = useWhatsappStore((state) => state.textMessageSchedule);
    const messageConfirmation = useWhatsappStore((state) => state.textMessageConfirmation);
    const saveMessage = useWhatsappStore((state) => state.saveMessage);

    useEffect(() => {
        if (!messageSchedule) getMessageDefault('schedule');
        if (!messageConfirmation) getMessageDefault('confirmation');

        setMessages({ ...messages, schedule: messageSchedule, confirmation: messageConfirmation });
    }, [messageSchedule, messageConfirmation]);

    const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement> | undefined, name: string) => {
        setMessages({ ...messages, [name]: e?.target.value });
    };

    const onSaveMessage = (fileName: string) => {
        setSubmitted(true);

        if (fileName == 'schedule' && messages.schedule) {
            const fileMessage: FileMessage = {
                fileName: fileName,
                message: messages.schedule
            };
            saveMessage(fileMessage);
        } else if (fileName == 'confirmation' && messages.confirmation) {
            const fileMessage: FileMessage = {
                fileName: fileName,
                message: messages.confirmation
            };
            saveMessage(fileMessage);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Mensagens para Whatsapp</h5>
                    <p>Padronização de mensagens para agendamento e confirmação de agendamento</p>

                    <div className="flex align-items-center justify-content-center mt-5 mb-2">
                        <div className="formgrid grid mt-3 mb-3">
                            <div className="field col mt-1 mr-3">
                                <span className="p-float-label">
                                    <InputTextarea
                                        placeholder=""
                                        spellCheck={false}
                                        rows={15}
                                        cols={50}
                                        value={messages.schedule}
                                        onChange={(e) => handleChangeMessage(e, 'schedule')}
                                        className={classNames({
                                            'p-invalid': submitted && !messages.schedule
                                        })}
                                        style={{ color: '#575fcf' }}
                                    />
                                    <label htmlFor="startDate">Mensagem de agendamento</label>
                                </span>
                                {submitted && !messages.schedule && <small className="p-invalid text-red-300">Mensagem obrigatória</small>}
                                <div className="mt-2">
                                    <Button label="Salvar" icon="pi pi-check" onClick={() => onSaveMessage('schedule')}></Button>
                                </div>
                            </div>
                            <div className="field col mt-1">
                                <span className="p-float-label">
                                    <InputTextarea
                                        placeholder=""
                                        spellCheck={false}
                                        rows={15}
                                        cols={50}
                                        value={messages.confirmation}
                                        onChange={(e) => handleChangeMessage(e, 'confirmation')}
                                        className={classNames({
                                            'p-invalid': submitted && !messages.schedule
                                        })}
                                        style={{ color: '#575fcf' }}
                                    />
                                    <label htmlFor="startDate">Mensagem de confirmação</label>
                                </span>
                                {submitted && !messages.schedule && <small className="p-invalid text-red-300">Mensagem obrigatória</small>}
                                <div className="mt-2">
                                    <Button label="Salvar" icon="pi pi-check" onClick={() => onSaveMessage('confirmation')}></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Fieldset className="mt-3" legend="Chaves válidas">
                        <div className="message-legend">
                            <span>
                                <b>[GREEATING]</b> - Substituído por: Bom dia, Boa tarde ou Boa noite
                            </span>
                            <br />
                            <span>
                                <b>[NAME]</b> - Substituído pelo nome do paciente
                            </span>
                            <br />
                            <span>
                                <b>[PROFESSIONAL]</b> - Substituído pelo nome do profissional
                            </span>
                            <br />
                            <span>
                                <b>[NAME]</b> - Substituído pelo nome do paciente
                            </span>
                            <br />
                            <span>
                                <b>[DAY]</b> - Substituído pela data da consulta
                            </span>
                            <br />
                            <span>
                                <b>[NAME]</b> - Substituído pela hora da consulta
                            </span>
                            <br />
                            <span>
                                <b>*texto*</b> - Negrito | <b>_texto_</b> - Itálico
                            </span>
                        </div>
                    </Fieldset>
                    <Fieldset className="mt-3" legend="Emojis">
                        <p className="message-legend">Selecione com o mouse o Emoji desejado e pressione CRTL + C para copiar</p>
                        <div className="emoji-legend">
                            <span>😀</span>
                            <span>😁</span>
                            <span>😊</span>
                            <span>🥰</span>
                            <span>😉</span>
                            <span>❤️</span>
                            <span>👍</span>
                            <span>📌</span>
                        </div>
                    </Fieldset>
                </div>
            </div>
        </div>
    );
};

export default MensagemPadraoPage;
