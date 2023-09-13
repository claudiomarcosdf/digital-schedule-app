import { create } from "zustand";

import type { PatientType } from "../types/patient";
import { createPatient, getPatients } from "../libs/PatientService";

type PatientStoreProps = {
  patient: PatientType.Patient | null;
  patients: PatientType.Patient[];
  createPatient: (patient: PatientType.Patient) => void;
  updatePatient: (patient: PatientType.Patient) => void;
  getAllPatient: () => void;
  //removePatient: (patient: PatientType.Patient) => void;
}

const initialPatient: PatientType.Patient = {
  id: undefined,
  nickName: "",
  person: {
    id: undefined,
    fullName: "",
    email: "",
    birthDay: "",
    cpf: "",
    rg: undefined,
    gender: undefined,
    address: "",
    zipCode: undefined,
    phone: "",
    phone2: "",
    active: true,
    createdDate: "",
    personType: {
      id: undefined,
      name: ""
    }
  }
}

export const usePatientStore = create<PatientStoreProps>((set) => ({
  patient: null,
  patients: [],
  createPatient: async (patient) => {
      const patientResponse: PatientType.Patient  = await createPatient(patient);
      set((state) => ({ ...state, 
        patient: patientResponse, 
        patients: [...state.patients, patientResponse] }))
  },  
  updatePatient: (patient) => set((state) => ({ ...state, patient })),
  getAllPatient: async () => {
      const patients: PatientType.Patient[] = await getPatients();
      set((state) => ({...state, patients}))
  }
}));


