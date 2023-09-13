import { create } from "zustand";
import { PatientType } from "../types/patient"
import { createPersonType, getPersonTypes } from "../libs/PersonTypeService";

type PersonTypeStoreProps = {
  personType: PatientType.PersonType | null,
  personTypes: PatientType.PersonType[],
  createPersonType: (personType: PatientType.PersonType) => void;
}

export const usePersonTypeStore = create<PersonTypeStoreProps>((set) => ({
   personType: null,
   personTypes: [],
   createPersonType: async (personType) => {
      const personTypeResponse: PatientType.PersonType  = await createPersonType(personType);
      set((state) => ({ ...state, 
        personType: personTypeResponse,
        personTypes: [ ...state.personTypes, personTypeResponse]
      }));
   },
   getAllPersonTypes: async () => {
      const personTypes: PatientType.PersonType[] = await getPersonTypes();
      set((state) => ({...state, personTypes}))
   }
}));