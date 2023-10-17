import { create } from "zustand";
import { Procedure } from "../types/procedure";
import { createProcedure, getActiveProceduresByProfessionalType, getAllProceduresByProfessionalType, removeProcedure, updateProcedure } from "../libs/ProcedureService";
import { toast } from 'react-toastify';

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

export const initialProcedure: Procedure =  {
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
    // const procedureResponse: Procedure  = await createProcedure(procedure);
    // set((state) => ({ ...state, procedure: procedureResponse }))
    const { data, error } = await createProcedure(procedure);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const procedureResponse: Procedure = data;
      set((state) => ({ ...state, procedure: procedureResponse }));
      toast.success("Procedimento criado", { className: 'toast-message-success' });
    }
    
  }, 

  updateProcedure: async (procedure) => {
      const { data, error } = await updateProcedure(procedure);
      error && toast.error(error as string, { className: 'toast-message-error' });

      if (data) {
        const procedureResponse: Procedure = data;
        set((state) => ({ ...state, procedure: procedureResponse, procedures: _updateList(state.procedures, procedureResponse) }));
        toast.success("Procedimento atualizado", { className: 'toast-message-success' });
      }
  },  

  removeProcedure: async (procedure) => {
    procedure.active = false;
    const { error } = await removeProcedure(procedure);
    error && toast.error(error as string, { className: 'toast-message-error' });
    
    set((state) => ({ ...state, procedures: _updateList(state.procedures, procedure) }));
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

