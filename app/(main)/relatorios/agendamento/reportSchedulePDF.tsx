import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import logo from '../logo';
import { ScheduleFilter } from './page';
import { formatDateHourBrazil, formatPhone } from '../../../../helpers/utils';
import { Schedule } from '../../../../types/schedule';

function reportSchedulePDF(schedulesApi: Schedule[], filter: ScheduleFilter) {
    let subtitleText = 'RELATÓRIO DE AGENDAMENTOS\n' + 'Profissional: ' + filter?.professionalType.name + ' - ' + filter.professional.nickName;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const titleReport = [
        {
            table: {
                headerRows: 1,
                widths: [100, '*', 100],
                heights: 70,
                body: [
                    [
                        {
                            image: logo(),
                            width: 60,
                            height: 50,
                            style: 'estiloCabecalho',
                            alignment: 'left'
                        },
                        {
                            text: '\nAGEND@DIGITAL',
                            style: 'estiloCabecalho',
                            alignment: 'center'
                        },
                        {
                            text: formatDateHourBrazil(new Date().toISOString()),
                            style: 'estiloCabecalhoDataHora',
                            alignment: 'right'
                        }
                    ]
                ]
            },
            layout: 'noBorders'
        }
    ];

    const subtitle = [
        {
            text: subtitleText,
            fontSize: 8,
            color: '#2f3640',
            alignment: 'center'
        },
        { text: '\n' }
    ];

    let totalRegisters = 0;
    const tableLines = schedulesApi.map((schedule) => {
        totalRegisters++;
        const patientName = schedule.patient?.fullName || '';
        return [
            {
                text: formatDateHourBrazil(schedule.startDate),
                fontSize: 8,
                margin: [0, 2, 0, 2]
            },
            {
                text: patientName || 'Evento agendado',
                fontSize: 8,
                bold: patientName ? true : false,
                color: patientName ? '#000000' : '#ff7979',
                margin: [0, 2, 0, 2]
            },
            {
                text: formatPhone(schedule.patient?.phone || ''),
                fontSize: 8,
                bold: true,
                margin: [0, 2, 0, 2]
            },
            {
                text: schedule.procedure?.name,
                fontSize: 8,
                margin: [0, 2, 0, 2]
            },
            {
                text: patientName ? schedule.status : 'EVENTO',
                fontSize: 8,
                margin: [0, 2, 0, 2]
            }
        ];
    });

    const content = [
        {
            table: {
                headerRows: 1,
                widths: [80, '*', 70, '*', 60],
                body: [
                    [
                        { text: 'Data agendada', style: 'estiloCabecalhoDados' },
                        { text: 'Paciente', style: 'estiloCabecalhoDados' },
                        { text: 'Telefone', style: 'estiloCabecalhoDados' },
                        { text: 'Procedimento', style: 'estiloCabecalhoDados' },
                        { text: 'Situação', style: 'estiloCabecalhoDados' }
                    ],
                    ...tableLines
                ]
            },
            //layout: 'noBorders'
            layout: 'headerLineOnly'
        }
    ];

    function footerCustom(currentPage: number, pageCount: number) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 8,
                margin: [0, 10, 20, 0]
            }
        ];
    }

    const totals = [{ text: '\n\nTotal de agendamentos: ' + totalRegisters, fontSize: 8, bold: true }];

    const document: any = {
        pageSize: 'A4',
        //pageOrientation: 'landscape',
        //pageMargins: [30, 25, 30, 30],
        pageMargins: [30, 25, 30, 30],

        header: [],
        content: [titleReport, subtitle, content, totals],
        footer: footerCustom,
        styles: {
            estiloCabecalho: {
                bold: true,
                fontSize: 12,
                color: 'black'
            },
            estiloCabecalhoDataHora: {
                bold: false,
                fontSize: 8,
                color: 'black'
            },
            estiloCabecalhoDados: {
                border: [false, false, false, true],
                fillColor: '#eeeeee',
                fontSize: 9,
                bold: true
            }
        }
    };

    var win = window.open('', '_blank');
    pdfMake.createPdf(document).open({}, win);
}

export default reportSchedulePDF;
