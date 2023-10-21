import { create } from "zustand";
import { toast } from 'react-toastify';

import { PatientSchedule, Schedule } from "../types/schedule";
import { initialProfessional, initialProfessionalType } from "./ProfessionalStore";
import { initialProcedure } from "./ProcedureStore";
import { createSchedule, deleteSchedule, getSchedulesByProfessional, updateSchedule } from "../libs/ScheduleService";
import { capitalizeShortName, getColorStatus } from "../helpers/utils";

type ScheduleEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
}

type ScheduleStoreProps = {
  schedule: Schedule | null;
  schedules: ScheduleEvent[];
  setSchedule: (schedule: Schedule | null) => void;
  createSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  removeSchedule: (schedule: Schedule) => void;
  getSchedulesByProfessional: (professionalTypeId: number, professionalId: number, startDate: string, endDate: string) => void;
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

const convertToScheduleEvent = (schedule: Schedule) : ScheduleEvent => {
  // @ts-ignore comment
   return {
      id: schedule.id?.toString() || '',
      title: "\u2013" + capitalizeShortName(schedule.patient.fullName),
      start: schedule.startDate,
      end: schedule.endDate,
      backgroundColor: getColorStatus(schedule.status || '')
  }
}

const convertToScheduleEvents = (schedules: Schedule[]): ScheduleEvent[] => {
  // @ts-ignore comment
   const scheduleEvents: ScheduleEvent[] = schedules.map((schedule) => {
     return convertToScheduleEvent(schedule);
   })

   return scheduleEvents;
}


export const useScheduleStore = create<ScheduleStoreProps>((set) => ({
  schedule: initialSchedule,
  schedules: [],
  setSchedule: (schedule) => set((state) => ({ ...state, schedule })),
  createSchedule: async (schedule) => {
    const { data, error } = await createSchedule(schedule);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const scheduleResponse: Schedule = data;
      const schedule: ScheduleEvent = convertToScheduleEvent(scheduleResponse);
      set((state) => ({
        ...state, schedule: scheduleResponse, schedules: [...state.schedules, schedule]
      }))
      toast.success("Agendamento criado", { className: 'toast-message-success' });
    }
  },
  updateSchedule: async (schedule) => {
    const { data, error } = await updateSchedule(schedule);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const scheduleResponse: Schedule = data;
      set((state) => ({ ...state, schedule: scheduleResponse, schedules: _updateList(state.schedules, scheduleResponse) }));
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
    set((state) => ({...state, schedules}));
  }
}))