import { initialProfessionalScheduleForm } from '../store/ProfessionalStore';
import { ProfessionalSchedule, ProfessionalSchedulePropsForm } from '../types/professional';
import moment from 'moment';

function formatDateHourBrazil(date: string) {
    if (!date) {
      return;
    }
  
    moment.locale('pt-BR');
    const dateHour = moment(date).format('DD/MM/YYYY HH:mm');
    return dateHour;
  }

function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(value: number) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

function validPrice(value: number | undefined) {
    if (value == undefined || value == null) return false;
    try {
        if (parseFloat(value.toString()) < 0.00) return false;
    } catch {
        console.log(' ERRO '+ value)
    }

    return true;
}

function formatBrazil(value: number) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDateBr(date: string) {
    if (!date) {
        return '';
    }

    const dateToFormat = date.substring(0, 10);
    const currentDate = new Date(dateToFormat);
    const dateFormated = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'UTC'
    }).format(currentDate);

    return dateFormated;
}

function getFormatedDate(date: string) {
    const day = moment(date).format('DD');
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

    return moment(year+"-"+month+"-"+day).format("YYYY-MM-DD");
}

function getFormatedDateTime(dateTime: string) {
    const day = moment(dateTime).format('DD');
    const month = moment(dateTime).format('MM');
    const year = moment(dateTime).format('YYYY');

    const hours = moment(dateTime).format('HH');
    const minuts = moment(dateTime).format('mm');

    return moment(year+"-"+month+"-"+day+'T'+hours+":"+minuts).format("YYYY-MM-DDTHH:mm");
}

function getFormatedDateByType(date: string, type: string) {
    let day;
    const month = moment(date).format('MM');
    const year = moment(date).format('YYYY');

   if (type == 'start') day = '01'
   else day = moment(date).endOf('month').format('DD');

   return moment(year+"-"+month+"-"+day).format("YYYY-MM-DD");
}

function addMinutes(dateTime: Date, minutes: number) {
    return moment(dateTime).add(minutes, 'm').toDate();
}

//Retorna primeira letra em Caixa alta
function capitalize(value: string) {
    const textLowerCase = value.toLowerCase();
    return textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1);
}

function capitalizeFullName(value: string) {
    var splitStr = value.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function capitalizeShortName(value: string) {
    if (!value) return value;
    var splitStr = value.toLowerCase().split(' ');
    splitStr[0] = splitStr[0].charAt(0).toUpperCase() + splitStr[0].substring(1);
    const ultimaPosicao = splitStr.length-1;
    splitStr[ultimaPosicao] = splitStr[ultimaPosicao].charAt(0).toUpperCase() + splitStr[ultimaPosicao].substring(1);
    return splitStr[0]+" "+splitStr[ultimaPosicao];
}

function formatCpfToView(value: string) {
    if (!value || value == '') return '';

    return value.substring(0, 3) + '.' + value.substring(3, 6) + '.' + value.substring(6, 9) + '-' + value.substring(9, 11);
}

function formatPhone(value: string) {
    if (!value || value == '') return ''; //6199763771

    if (value.length == 11) {
        return '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
    } else if (value.length == 10) {
        return '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6, 10);
    }
}

function maskPhone(value: string) {
    if (!value || value == '') return '(99) 99999-9999';

    value = value.replaceAll('(', '').replaceAll(')', '').replaceAll(' ', '').replaceAll('-', '');

    if (value.length == 11) return '(99) 99999-9999';
    else if (value.length == 10) return '(99) 9999-9999';
}

function validTime(valueString: string | undefined) {
    //if (!valueString || valueString == '') return false;

    const value = (valueString && valueString.replaceAll(':', '').replaceAll('__', '').replaceAll('_', '').trim()) || '';

    if (value.startsWith('3') || value.startsWith('4') || value.startsWith('5') || value.startsWith('6') || value.startsWith('7') || value.startsWith('8') || value.startsWith('9')) return false;

    const minutesTime = value.substring(2, 4);

    try {
        if (minutesTime.length == 2) {
            //2 digits
            const minInt = parseInt(minutesTime);
            if (minInt > 59) return false;
        }
    } catch (error) {
        return false;
    }

    return true;
}

function processConvert(periodValue: string | null | undefined, hourIndex: number): string {
    if (!periodValue) return '';

    if (periodValue.length == 23) {
        switch (hourIndex) {
            case 1:
                return periodValue.substring(0, 5);
            case 2:
                return periodValue.substring(6, 11);
            case 3:
                return periodValue.substring(12, 17);
            case 4:
                return periodValue.substring(18, 23);
            default:
                return '';
        } 
    } else {
        if (periodValue.startsWith("null")) {
            switch (hourIndex) {
                case 1:
                    return '';
                case 2:
                    return '';
                case 3:
                    return periodValue.substring(5, 10);
                case 4:
                    return periodValue.substring(11, 16);
                default:
                    return '';
            }             
        } else {
            switch (hourIndex) {
                case 1:
                    return periodValue.substring(0, 5);
                case 2:
                    return periodValue.substring(6, 11);
                case 3:
                    return '';
                case 4:
                    return '';
                default:
                    return '';
            }
        }
    }
}

function convertToProfessionalScheduleForm(professionalSchedule: ProfessionalSchedule) {
    let professionalScheduleForm: ProfessionalSchedulePropsForm = initialProfessionalScheduleForm;
    //08:00-12:00,13:00-18:00 or null,13:00-18:00 or 08:00-12:00,null

    professionalScheduleForm.hrIniMorningMonday = processConvert(professionalSchedule.monday, 1);
    professionalScheduleForm.hrFinMorningMonday = processConvert(professionalSchedule.monday, 2);
    professionalScheduleForm.hrIniEveningMonday = processConvert(professionalSchedule.monday, 3);
    professionalScheduleForm.hrFinEveningMonday = processConvert(professionalSchedule.monday, 4); 

    professionalScheduleForm.hrIniMorningTuesday = processConvert(professionalSchedule.tuesday, 1);
    professionalScheduleForm.hrFinMorningTuesday = processConvert(professionalSchedule.tuesday, 2);
    professionalScheduleForm.hrIniEveningTuesday = processConvert(professionalSchedule.tuesday, 3);
    professionalScheduleForm.hrFinEveningTuesday = processConvert(professionalSchedule.tuesday, 4);

    professionalScheduleForm.hrIniMorningWednesday = processConvert(professionalSchedule.wednesday, 1);
    professionalScheduleForm.hrFinMorningWednesday = processConvert(professionalSchedule.wednesday, 2);
    professionalScheduleForm.hrIniEveningWednesday = processConvert(professionalSchedule.wednesday, 3);
    professionalScheduleForm.hrFinEveningWednesday = processConvert(professionalSchedule.wednesday, 4);

    professionalScheduleForm.hrIniMorningThursday = processConvert(professionalSchedule.thursday, 1);
    professionalScheduleForm.hrFinMorningThursday = processConvert(professionalSchedule.thursday, 2);
    professionalScheduleForm.hrIniEveningThursday = processConvert(professionalSchedule.thursday, 3);
    professionalScheduleForm.hrFinEveningThursday = processConvert(professionalSchedule.thursday, 4);

    professionalScheduleForm.hrIniMorningFriday = processConvert(professionalSchedule.friday, 1);
    professionalScheduleForm.hrFinMorningFriday = processConvert(professionalSchedule.friday, 2);
    professionalScheduleForm.hrIniEveningFriday = processConvert(professionalSchedule.friday, 3);
    professionalScheduleForm.hrFinEveningFriday = processConvert(professionalSchedule.friday, 4);

    professionalScheduleForm.hrIniMorningSaturday = processConvert(professionalSchedule.saturday, 1);
    professionalScheduleForm.hrFinMorningSaturday = processConvert(professionalSchedule.saturday, 2);
    professionalScheduleForm.hrIniEveningSaturday = processConvert(professionalSchedule.saturday, 3);
    professionalScheduleForm.hrFinEveningSaturday = processConvert(professionalSchedule.saturday, 4);

    professionalScheduleForm.hrIniMorningSunday = processConvert(professionalSchedule.sunday, 1);
    professionalScheduleForm.hrFinMorningSunday = processConvert(professionalSchedule.sunday, 2);
    professionalScheduleForm.hrIniEveningSunday = processConvert(professionalSchedule.sunday, 3);
    professionalScheduleForm.hrFinEveningSunday = processConvert(professionalSchedule.sunday, 4);
    return professionalScheduleForm;
}

function validTimeField(valueString: string) {
    //08:00-12:00,14:00-18:00

    const value = (valueString && valueString.replaceAll(':', '').replaceAll('-', '')
    .replaceAll('undefined', '').trim()) || '';

    if (value == '' || value == ',') return false; 
    const arrayValues = value.split(',');

    if (arrayValues.length > 1) {
        if ((arrayValues[0] != '' && arrayValues[0].length < 8) 
        || (arrayValues[1] != '' && arrayValues[1].length < 8)) return false;
    }

    try {
        parseInt(value);
    } catch (error) {
        return false;
    }

    return true;
}

function formatPeriod(hrIniMorning: string, hrFinMorning: string, hrIniEvening: string, hrFinEvening: string) {
    //"08:00-12:00,13:00-18:00" or "08:00-12:00,null" or "null,13:00-19:00" 
    let manha: string = '';
    let tarde: string = '';
    if ((!hrIniMorning && !hrFinMorning) || (!hrIniMorning && hrFinMorning) || (hrIniMorning && !hrFinMorning)) manha = '';
    if ((!hrIniEvening && !hrFinEvening) || (!hrIniEvening && hrFinEvening) || (hrIniEvening && !hrFinEvening)) tarde = '';
    
    if (hrIniMorning && hrFinMorning) manha = hrIniMorning+'-'+hrFinMorning;
    if (hrIniEvening && hrFinEvening) tarde = hrIniEvening+'-'+hrFinEvening;

    let finalText: string = '';
    const joinText = manha + tarde;
    if (joinText.trim().length != 0) {
        if (manha == '') manha = 'null';
        if (tarde == '') tarde = 'null';

        finalText = manha+','+tarde;
    }

    return finalText;
}

function convertToProfessionalSchedule(professionalScheduleForm: ProfessionalSchedulePropsForm) {
    if (!professionalScheduleForm) return null;
    const {
        hrIniMorningMonday,
        hrFinMorningMonday,
        hrIniEveningMonday,
        hrFinEveningMonday,
        hrIniMorningTuesday,
        hrFinMorningTuesday,
        hrIniEveningTuesday,
        hrFinEveningTuesday,
        hrIniMorningWednesday,
        hrFinMorningWednesday,
        hrIniEveningWednesday,
        hrFinEveningWednesday,
        hrIniMorningThursday,
        hrFinMorningThursday,
        hrIniEveningThursday,
        hrFinEveningThursday,
        hrIniMorningFriday,
        hrFinMorningFriday,
        hrIniEveningFriday,
        hrFinEveningFriday,
        hrIniMorningSaturday,
        hrFinMorningSaturday,
        hrIniEveningSaturday,
        hrFinEveningSaturday,
        hrIniMorningSunday,
        hrFinMorningSunday,
        hrIniEveningSunday,
        hrFinEveningSunday
    } = professionalScheduleForm;

    const monday = formatPeriod(hrIniMorningMonday, hrFinMorningMonday, hrIniEveningMonday, hrFinEveningMonday);
    const tuesday = formatPeriod(hrIniMorningTuesday, hrFinMorningTuesday, hrIniEveningTuesday, hrFinEveningTuesday);
    const wednesday = formatPeriod(hrIniMorningWednesday, hrFinMorningWednesday, hrIniEveningWednesday, hrFinEveningWednesday);
    const thursday = formatPeriod(hrIniMorningThursday, hrFinMorningThursday, hrIniEveningThursday, hrFinEveningThursday);
    const friday = formatPeriod(hrIniMorningFriday, hrFinMorningFriday, hrIniEveningFriday, hrFinEveningFriday);
    const saturday = formatPeriod(hrIniMorningSaturday, hrFinMorningSaturday, hrIniEveningSaturday, hrFinEveningSaturday);
    const sunday = formatPeriod(hrIniMorningSunday, hrFinMorningSunday, hrIniEveningSunday, hrFinEveningSunday);
    
    // FORMATOS ACEITOS
    //"08:00-12:00,13:00-18:00" or "08:00-12:00,null" or "null,13:00-19:00" 
    // @ts-ignore comment
    const professionalSchedule: ProfessionalSchedule = {
        monday: monday ? monday.trim() : null,
        tuesday: tuesday ? tuesday.trim() : null,
        wednesday: wednesday ? wednesday.trim() : null,
        thursday: thursday ? thursday.trim() : null,
        friday: friday ? friday.trim() : null,
        saturday: saturday ? saturday.trim() : null,
        sunday: sunday ? sunday.trim() : null
    };

    return professionalSchedule;
}

function getColorStatus(status: string) {
    switch (status.toUpperCase() as any) {
        case "AGENDADO":
            return '#009EFA';
        case "CONFIRMADO":
            return '#f1c40f'
        case "PRESENTE":
            return '#00C9A7'
        case "FINALIZADO":
            return '#DCB0FF'     
        case "CANCELADO":
            return '#FF8066'
        default:
            return '#009EFA'
    }
}

export { formatDateHourBrazil, formatCurrency, formatNumber, validPrice, formatBrazil, formatDateBr, getFormatedDate, getFormatedDateTime, getFormatedDateByType, addMinutes, capitalize, capitalizeFullName, capitalizeShortName, formatCpfToView, formatPhone, maskPhone, validTime, convertToProfessionalScheduleForm, convertToProfessionalSchedule, getColorStatus };
