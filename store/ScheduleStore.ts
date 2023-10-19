import { create } from "zustand";
import { toast } from 'react-toastify';

import { Schedule } from "../types/schedule";
import { initialProfessional, initialProfessionalType } from "./ProfessionalStore";
import { initialPatient } from "./PatientStore";
import { initialProcedure } from "./ProcedureStore";
import { createSchedule, deleteSchedule, getSchedulesByProfessional, updateSchedule } from "../libs/ScheduleService";
import { capitalizeShortName, getColorStatus } from "../app/helpers/utils";

type ScheduleEvents = {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
}

type ScheduleStoreProps = {
  schedule: Schedule | null;
  schedules: ScheduleEvents[];
  setSchedule: (schedule: Schedule | null) => void;
  createSchedule: (schedule: Schedule) => void;
  updateSchedule: (schedule: Schedule) => void;
  removeSchedule: (schedule: Schedule) => void;
  getSchedulesByProfessional: (professionalTypeId: number, professionalId: number, startDate: string, endDate: string) => void;
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
  patient: initialPatient,
  procedure: initialProcedure
}

const _updateList = (value: any, objToFin: any) => {
  value.splice(value.findIndex((schedule: any) => schedule?.id == objToFin?.id),1,objToFin);
  return value;
}

const convertToScheduleEvents = (schedules: Schedule[]) => {
  // @ts-ignore comment
   const scheduleEvents: ScheduleEvents = schedules.map((schedule) => {
     return {
      id: schedule.id?.toString(),
      title: "\u2013" + capitalizeShortName(schedule.patient.fullName),
      start: schedule.startDate,
      end: schedule.endDate,
      backgroundColor: getColorStatus(schedule.status || '')
     }
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
      set((state) => ({
        ...state, schedule: scheduleResponse, schedules: [...state.schedules, scheduleResponse]
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
    const schedules: ScheduleEvents = convertToScheduleEvents(schedulesApi);

    // @ts-ignore comment
    set((state) => ({...state, schedules}));
  }
}))