import { create } from "zustand";

import type { PersonType, Person } from "../types/person";
import { Professional, ProfessionalType } from "../types/professional";
import { createProfessional, deleteProfessional, getProfessionals, updateProfessional } from "../libs/ProfessionalService";

type ProfessionalStoreProps = {
  professional: Professional | null;
  professionals: Professional[];
  setProfessional: (professional: Professional | null) => void;
  createProfessional: (professional: Professional) => void;
  updateProfessional: (professional: Professional) => void;
  removeProfessional: (professional: Professional) => void;
  getAllProfessional: () => void;
}

const initialPersonType: PersonType = {
  id: 2,
  name: "Profissional"   
}

const initialPerson: Person = {
  id: null,
  fullName: "",
  email: "",
  birthDay: "",
  cpf: "",
  rg: null,
  gender: "",
  address: "",
  zipCode: null,
  phone: "",
  phone2: "",
  active: true,
  createdDate: "",
  personType: initialPersonType
};

const initialProfessionalType: ProfessionalType = {
  id: null,
  name: "",
  active: true
}

export const initialProfessionalScheduleForm = {
  hrIniMorningMonday: "",
  hrFinMorningMonday: "",
  hrIniEveningMonday: "",
  hrFinEveningMonday: "",

  hrIniMorningTuesday: "",
  hrFinMorningTuesday: "",
  hrIniEveningTuesday: "",
  hrFinEveningTuesday: "",   
  
  hrIniMorningWednesday: "",
  hrFinMorningWednesday: "",
  hrIniEveningWednesday: "",
  hrFinEveningWednesday: "",   
  
  hrIniMorningThursday: "",
  hrFinMorningThursday: "",
  hrIniEveningThursday: "",
  hrFinEveningThursday: "",    

  hrIniMorningFriday: "",
  hrFinMorningFriday: "",
  hrIniEveningFriday: "",
  hrFinEveningFriday: "",    

  hrIniMorningSaturday: "",
  hrFinMorningSaturday: "",
  hrIniEveningSaturday: "",
  hrFinEveningSaturday: "",    

  hrIniMorningSunday: "",
  hrFinMorningSunday: "",
  hrIniEveningSunday: "",
  hrFinEveningSunday: "",    
}

export const initialProfessional: Professional = {
  id: null,
  nickName: "",
  document: null,
  durationService: null,
  intervalService: null,
  person: initialPerson,
  professionalType: initialProfessionalType
}

const _updateList = (value: any, objToFin: any) => {
  value.splice(value.findIndex((professional: any) => professional?.id == objToFin?.id),1,objToFin);
  return value;
}

export const useProfessionalStore = create<ProfessionalStoreProps>((set) => ({
  professional: initialProfessional,
  professionals: [],
  setProfessional: (professional) => set((state) => ({ ...state, professional })),
  createProfessional: async (professional) => {
    const professionalResponse: Professional = await createProfessional(professional);
    set((state) => ({
      ...state, professional: professionalResponse, professionals: [...state.professionals, professionalResponse]
    }))
  },
  updateProfessional: async (professional) => {
    const professionalResponse: Professional = await updateProfessional(professional);

    set((state) => ({ ...state, professional: professionalResponse, professionals: _updateList(state.professionals, professionalResponse) }));
  },
  removeProfessional: async (professional) => {
    professional.person.active = false;
    await deleteProfessional(professional);
    set((state) => ({ ...state, professionals: _updateList(state.professionals, professional) }));
  },
  getAllProfessional: async () => {
    const professionals: Professional[] = await getProfessionals();
    set((state) => ({...state, professionals}))
  }
}));