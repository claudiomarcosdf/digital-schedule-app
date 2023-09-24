import { create } from "zustand";
import { ProfessionalSchedule } from "../types/professional";
import { createProfessionalSchedule, updateProfessionalSchedule } from "../libs/ProfessionalScheduleService";

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
     const professionalScheduleResponse: ProfessionalSchedule  = await createProfessionalSchedule(professionalSchedule);
     set((state) => ({ ...state, 
      professionalSchedule: professionalScheduleResponse,
      professionalSchedules: [ ...state.professionalSchedules, professionalScheduleResponse]
     }));
  },
  updateProfessionalSchedule: async (professionalSchedule) => {
    const professionalScheduleResponse: ProfessionalSchedule = await updateProfessionalSchedule(professionalSchedule);
    set((state) => ({ ...state, professionalSchedule: professionalScheduleResponse, professionalSchedules: _updateList(state.professionalSchedules, professionalScheduleResponse) }));
  }
}));