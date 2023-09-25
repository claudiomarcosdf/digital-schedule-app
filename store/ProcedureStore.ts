import { create } from "zustand";
import { Procedure } from "../types/procedure";
import { createProcedure, getActiveProceduresByProfessionalType, getAllProceduresByProfessionalType, removeProcedure, updateProcedure } from "../libs/ProcedureService";

type ProcedureStoreProps = {
  procedure: Procedure | null;
  procedures: Procedure[];
  setProcedure: (procedure: Procedure | null) => void;
  createProcedure: (procedure: Procedure) => void;
  updateProcedure: (procedure: Procedure) => void;
  removeProcedure: (procedure: Procedure) => void;  
  getProceduresByProfessionalType: (professionalTypeId: number) => void;
  getActiveProceduresByProfessionalType: (professionalTypeId: number) => void;
}

const initialProfessionalType = {
  id: null,
  name: '',
  active: true
}

export const initialProcedure =  {
  id: null,
  name: '',
  price: 0.00,
  active: true,
  professionalType: initialProfessionalType
}

const _updateList = (value: any, objToFin: any) => {
  value.splice(value.findIndex((procedure: any) => procedure?.id == objToFin?.id),1,objToFin);
  return value;
}

export const useProcedureStore = create<ProcedureStoreProps>((set) => ({
  procedure: initialProcedure,
  procedures: [],
  setProcedure: (procedure) => set((state) => ({...state, procedure})),

  createProcedure: async (procedure) => {
    const procedureResponse: Procedure  = await createProcedure(procedure);
    set((state) => ({ ...state, procedure: procedureResponse }))
  }, 

  updateProcedure: async (procedure) => {
    const procedureResponse: Procedure = await updateProcedure(procedure);
    set((state) => ({ ...state, procedure: procedureResponse }));
  },  

  removeProcedure: async (procedure) => {
    await removeProcedure(procedure);
    set((state) => ({ ...state }));
  },  

  getProceduresByProfessionalType: async (profissionalTypeId: number) => {
    const proceduresReponse: Procedure[] = await getAllProceduresByProfessionalType(profissionalTypeId);
    set((state) => ({ ...state, procedures: proceduresReponse}));
  },

  getActiveProceduresByProfessionalType: async (profissionalTypeId: number) => {
    const proceduresReponse: Procedure[] = await getActiveProceduresByProfessionalType(profissionalTypeId);
    set((state) => ({ ...state, procedures: proceduresReponse}));
  },  
}));

