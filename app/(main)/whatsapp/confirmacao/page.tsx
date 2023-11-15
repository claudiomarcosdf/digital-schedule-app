'use client';
import React, { useState } from 'react';
import BlockCard from '../../../../common/BlockCard';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { useScheduleStore } from '../../../../store/ScheduleStore';

const ConfirmationPage = () => {
    const [scheduleDate, setScheduleDate] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const sendMessages = useScheduleStore((state) => state.sendConfirmationMessage);

    const handleSendMessages = () => {
        setSubmitted(true);

        if (scheduleDate) {
            console.log(scheduleDate); //year - month - day
            //send message
            sendMessages(scheduleDate); //data dos agendamentos
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <BlockCard
                    header="Confirmação de consulta/serviços"
                    subtitle="Disparo de mensagens de confirmações de consultas via Whatsapp, para os destinatários agendados, conforme dia informado abaixo:"
                    containerClassName="px-4 py-8 md:px-6 lg:px-8"
                >
                    <div className="formgrid grid mt-3">
                        <div className="flex field col mt-1 mr-3">
                            <div>
                                <span className="p-float-label">
                                    <InputText
                                        id="scheduleDate"
                                        type="date"
                                        value={scheduleDate || ''}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        required
                                        style={{ width: '15rem' }}
                                        className={classNames({
                                            'p-invalid': submitted && !scheduleDate
                                        })}
                                    />
                                    <label htmlFor="startDate">Data do agendamento</label>
                                </span>
                                {submitted && !scheduleDate && <small className="p-invalid text-red-300">Data obrigatória</small>}
                            </div>
                            <div className="ml-3">
                                <Button label="Enviar mensagens" icon="pi pi-send" onClick={handleSendMessages}></Button>
                            </div>
                        </div>
                    </div>
                </BlockCard>
            </div>
        </div>
    );
};

export default ConfirmationPage;
