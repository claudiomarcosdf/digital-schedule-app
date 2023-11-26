import { create } from "zustand";
import { toast } from 'react-toastify';

import { PatientSchedule, Schedule, ScheduleCreateUpdateResponse, ScheduleRequest } from "../types/schedule";
import { initialProfessional, initialProfessionalType } from "./ProfessionalStore";
import { initialProcedure } from "./ProcedureStore";
import { createSchedule, deleteSchedule, getSchedulesByProfessional, updateSchedule, sendConfirmation } from "../libs/ScheduleService";
import { addDay, capitalizeShortName, getColorStatus, getFormatedDate } from "../helpers/utils";
import { ProfessionalType } from "../types/professional";

type ExtendedProps = {
  patient: boolean;
}

type ScheduleEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  // allDay: boolean;
  display: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string,
  extendedProps: ExtendedProps;
}

type ScheduleStoreProps = {
  schedule: Schedule | null;
  schedules: ScheduleEvent[];
  schedulesApi: Schedule[];
  setSchedule: (schedule: Schedule | null) => void;
  createSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  removeSchedule: (schedule: Schedule) => void;
  getSchedulesByProfessional: (professionalTypeId: number, professionalId: number, startDate: string, endDate: string) => void;
  getSchedule: (id: number) => void;
  sendConfirmationMessage: (date: string) => void;
  reset: () => void;
}

const initialPatientSchedule: PatientSchedule = {
  id: 0,
  fullName: '',
  birthDay: '',
  gender: '',
  cpf: '',
  phone: '',
  phone2: ''
}

export const initialSchedule: Schedule = {
  id: null,
  startDate: '',
  endDate: '',
  description: '',
  amountPaid: 0.00,
  active: true,
  status: 'AGENDADO',
  professionalType: initialProfessionalType,
  professional: initialProfessional,
  patient: initialPatientSchedule,
  procedure: initialProcedure
}

const _updateList = (value: any, objToFin: any) => {
  value.splice(value.findIndex((schedule: any) => schedule?.id == objToFin?.id),1,objToFin);
  return value;
}

const findScheduleApiById = (listSchedules: Schedule[], id: number) => {
  const schedule: Schedule | undefined = listSchedules.find((schedule) => schedule?.id == id);

  if (schedule) {
    return schedule;
  } else return null;
}

const convertToScheduleEvent = (schedule: Schedule | ScheduleCreateUpdateResponse) : ScheduleEvent => {
  
  let patientName: string = '';
  if (schedule?.patient) {
    if (schedule?.patient.hasOwnProperty('fullName')) {
       // @ts-ignore comment
       patientName = schedule.patient.fullName;
     } else if (schedule?.patient.hasOwnProperty('person')) {
      // @ts-ignore comment
        patientName = schedule.patient.person.fullName;
     }
  }

  //to display in calendar
   return {
      id: schedule.id?.toString() || '',
      title: schedule?.patient ? "\u2013" + capitalizeShortName(patientName) : schedule.description,
      start: schedule.startDate,
      end: schedule.endDate, 
      backgroundColor: getColorStatus(schedule.status || ''),
      borderColor: getColorStatus(schedule.status || ''),
      textColor: schedule.status == 'EVENTO' ? '#57606f' : '',
      display: schedule.status == 'EVENTO' ? 'block' : 'auto',
      //start: schedule.status == 'EVENTO' ? getFormatedDate(schedule.startDate) : schedule.startDate,
      //end: schedule.status == 'EVENTO' ? addDay(schedule.endDate, 1) : schedule.endDate,
      //allDay: schedule.status == 'EVENTO' ? true : false, //--> Não deixa editar o evento | trabalha em conjunto com o display
      //display: schedule.status == 'EVENTO' ? 'background' : 'auto',
      extendedProps: {
        patient: schedule.patient ? true : false
      }
  }
}

const convertToScheduleEvents = (schedules: Schedule[]): ScheduleEvent[] => {
  // @ts-ignore comment
   const scheduleEvents: ScheduleEvent[] = schedules.map((schedule) => {
     return convertToScheduleEvent(schedule);
   })

   return scheduleEvents;
}

const convertToScheduleRequest = (schedule: Schedule) : ScheduleRequest => {
  const scheduleRequest: ScheduleRequest = {
    id: schedule?.id,
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    description: schedule.description,
    amountPaid: schedule.amountPaid || 0.0,
    professionalTypeId: schedule.professionalType.id || null,
    professionalId: schedule.professional.id as number,
    patientId: schedule.patient?.id as number,
    procedureId: schedule.procedure?.id as number,
    status: schedule.status || ('AGENDADO' as string)
  };  

  return scheduleRequest
}

const convertToSchedule = (schedule: ScheduleCreateUpdateResponse): Schedule => {
   const scheduleConverted: Schedule = {
    id: schedule.id,
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    description: schedule.description,
    amountPaid: schedule.amountPaid,
    active: schedule.active,
    status: schedule.status,
    professionalType: schedule.professionalType,
    professional: {
      id: schedule.professional?.id,
      nickName: schedule.professional.nickName,
      document: schedule.professional.document,
      durationService: schedule.professional.durationService,
      intervalService: schedule.professional.intervalService,
      phone: schedule.professional.person.phone,
      phone2: schedule.professional.person.phone2 
    },
    patient: {
      id: schedule.patient?.id || 0,
      fullName: schedule.patient?.person.fullName || '',
      birthDay: schedule.patient?.person.birthDay,
      gender: schedule.patient?.person.gender,
      cpf: schedule.patient?.person.cpf,
      phone: schedule.patient?.person.phone,
      phone2: schedule.patient?.person.phone2 
    },
    procedure: {
      id: schedule.procedure?.id,
      name: schedule.procedure?.name || '',
      price: schedule.procedure?.price || 0.00,
      active: schedule.procedure?.active as boolean,
      professionalType: schedule.procedure?.professionalType as ProfessionalType
    }
   }

   return scheduleConverted;
}

export const useScheduleStore = create<ScheduleStoreProps>((set) => ({
  schedule: initialSchedule,
  schedules: [],
  schedulesApi: [], //API Schedules list
  setSchedule: (schedule) => set((state) => ({ ...state, schedule })),
  createSchedule: async (schedule) => {
    const scheduleRequest = convertToScheduleRequest(schedule);

    const { data, error } = await createSchedule(scheduleRequest);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const scheduleResponse: ScheduleCreateUpdateResponse = data;
      const schedule: Schedule = convertToSchedule(scheduleResponse);
      const newScheduleEvent: ScheduleEvent = convertToScheduleEvent(scheduleResponse);

      set((state) => ({
        ...state, schedule: schedule, schedules: [...state.schedules, newScheduleEvent]
      }))
      toast.success("Agendamento criado", { className: 'toast-message-success' });
    }
  },
  updateSchedule: async (schedule) => {
    const scheduleRequest = convertToScheduleRequest(schedule);
    const { data, error } = await updateSchedule(scheduleRequest);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const scheduleResponse: ScheduleCreateUpdateResponse = data;
      const schedule: Schedule = convertToSchedule(scheduleResponse);
      const updatedScheduleEvent: ScheduleEvent = convertToScheduleEvent(scheduleResponse);

      set((state) => ({ ...state, schedule: schedule, schedules: _updateList(state.schedules, updatedScheduleEvent) }));
      toast.success("Agendamento atualizado", { className: 'toast-message-success' });
    }
  },
  removeSchedule: async (schedule) => {
    schedule.active = false;
    const { error } = await deleteSchedule(schedule);
    error && toast.error(error as string, { className: 'toast-message-error' });
    
    set((state) => ({ ...state, schedules: _updateList(state.schedules, schedule) }));
  },
  getSchedulesByProfessional: async (professionalTypeId: number, professionalId: number, startDate: string, endDate: string) => {
    const schedulesApi: Schedule[] = await getSchedulesByProfessional(professionalTypeId, professionalId, startDate, endDate);
    const schedules: ScheduleEvent[] = convertToScheduleEvents(schedulesApi);

    // @ts-ignore comment
    set((state) => ({...state, schedules, schedulesApi}));
  },
  getSchedule: (id: number) => {
    set((state) => ({ ...state, schedule: findScheduleApiById(state.schedulesApi, id) }));
  },
  sendConfirmationMessage: async (date: string) => {
    const { error } = await sendConfirmation(date);

    error && toast.error(error as string, { className: 'toast-message-error' });
    !error && toast.success('Mensagens enviadas com sucesso!', { className: 'toast-message-success' });
  },
  reset: () => {
    set((state) => ({...state, schedule: initialSchedule, schedules: []}));    
  }
}))