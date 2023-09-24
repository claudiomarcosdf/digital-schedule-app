import { create } from "zustand";
import { createProfessionalType, getProfessionalTypes } from "../libs/ProfessionalTypeService";
import { ProfessionalType } from "../types/professional";

type ProfessionalTypeStoreProps = {
  professionalType: ProfessionalType | null,
  professionalTypes: ProfessionalType[],
  createProfessionalType: (professionalType: ProfessionalType) => void,
  getAllProfessionalTypes: () => void
}

export const useProfessionalTypeStore = create<ProfessionalTypeStoreProps>((set) => ({
   professionalType: null,
   professionalTypes: [],
   createProfessionalType: async (professionalType) => {
      const professionalTypeResponse: ProfessionalType  = await createProfessionalType(professionalType);
      set((state) => ({ ...state, 
        professionalType: professionalTypeResponse,
        professionalTypes: [ ...state.professionalTypes, professionalTypeResponse]
      }));
   },
   getAllProfessionalTypes: async () => {
      const _professionalTypes: ProfessionalType[] = await getProfessionalTypes();
      set((state) => ({...state, professionalTypes: _professionalTypes}))
   }
}));