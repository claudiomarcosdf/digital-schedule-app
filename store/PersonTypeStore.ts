import { create } from "zustand";
import { createPersonType, getPersonTypes } from "../libs/PersonTypeService";
import { PersonType } from "../types/person";

type PersonTypeStoreProps = {
  personType: PersonType | null,
  personTypes: PersonType[],
  createPersonType: (personType: PersonType) => void;
}

export const usePersonTypeStore = create<PersonTypeStoreProps>((set) => ({
   personType: null,
   personTypes: [],
   createPersonType: async (personType) => {
      const personTypeResponse: PersonType  = await createPersonType(personType);
      set((state) => ({ ...state, 
        personType: personTypeResponse,
        personTypes: [ ...state.personTypes, personTypeResponse]
      }));
   },
   getAllPersonTypes: async () => {
      const personTypes: PersonType[] = await getPersonTypes();
      set((state) => ({...state, personTypes}))
   }
}));