import { create } from "zustand";
import { ProfessionalSchedule } from "../types/professional";
import { createProfessionalSchedule, updateProfessionalSchedule } from "../libs/ProfessionalScheduleService";
import { toast } from 'react-toastify';

type ProfessionalScheduleStoreProps = {
   professionalSchedule: ProfessionalSchedule | null,
   professionalSchedules: ProfessionalSchedule[],
   createProfessionalSchedule: (professionalSchedule: ProfessionalSchedule) => void,
   updateProfessionalSchedule: (professionalSchedule: ProfessionalSchedule) => void,
}

const _updateList = (value: any, objToFin: any) => {
  value.splice(value.findIndex((professionalSchedule: any) => professionalSchedule?.id == objToFin?.id),1,objToFin);
  return value;
}

export const useProfessionalScheduleStore = create<ProfessionalScheduleStoreProps>((set) => ({
  professionalSchedule: null,
  professionalSchedules: [],
  createProfessionalSchedule: async (professionalSchedule) => {
    const { data, error } = await createProfessionalSchedule(professionalSchedule);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const professionalScheduleResponse: ProfessionalSchedule  = data;
      set((state) => ({ ...state, 
       professionalSchedule: professionalScheduleResponse,
       professionalSchedules: [ ...state.professionalSchedules, professionalScheduleResponse]
      }));
      toast.success("Jornada e horários incluídos", { className: 'toast-message-success' });
    }
  },
  updateProfessionalSchedule: async (professionalSchedule) => {
    const { data, error } = await updateProfessionalSchedule(professionalSchedule);
    error && toast.error(error as string, { className: 'toast-message-error' });
    
    if (data) {
      const professionalScheduleResponse: ProfessionalSchedule = data;
      set((state) => ({ ...state, professionalSchedule: professionalScheduleResponse, professionalSchedules: _updateList(state.professionalSchedules, professionalScheduleResponse) }));
      toast.success("Jornada e horários atualizados", { className: 'toast-message-success' });
    }

  }
}));