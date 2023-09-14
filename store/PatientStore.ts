import { create } from "zustand";

import type { PatientType } from "../types/patient";
import { createPatient, getPatients } from "../libs/PatientService";

type PatientStoreProps = {
  patient: PatientType.Patient | null;
  patients: PatientType.Patient[];
  setPatient: (patient: PatientType.Patient | null) => void;
  createPatient: (patient: PatientType.Patient) => void;
  updatePatient: (patient: PatientType.Patient) => void;
  getAllPatient: () => void;
  //removePatient: (patient: PatientType.Patient) => void;
}

const initialPersonType: PatientType.PersonType = {
    id: null,
    name: ""   
}

const initialPerson: PatientType.Person = {
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

export const initialPatient: PatientType.Patient = {
  id: null,
  nickName: "",
  person: initialPerson
}

export const usePatientStore = create<PatientStoreProps>((set) => ({
  patient: initialPatient,
  patients: [],
  setPatient: (patient) => set((state) => ({...state, patient})),
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


