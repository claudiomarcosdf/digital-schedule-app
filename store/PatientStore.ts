import { create } from "zustand";

import type { PatientType } from "../types/patient";
import { createPatient, deletePatient, getPatients, updatePatient } from "../libs/PatientService";

type PatientStoreProps = {
  patient: PatientType.Patient | null;
  patients: PatientType.Patient[];
  setPatient: (patient: PatientType.Patient | null) => void;
  createPatient: (patient: PatientType.Patient) => void;
  updatePatient: (patient: PatientType.Patient) => void;
  removePatient: (patient: PatientType.Patient) => void;
  getAllPatient: () => void;
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

const updateList = (value: any, objToFin: any) => {
   value.splice(value.findIndex(patient => patient?.id == objToFin?.id),1,objToFin);
   return value;
  // state.patients.splice(state.patients.findIndex(patient => patient?.id == patientResponse?.id),1,patientResponse)
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
  updatePatient: async (patient) => {
    const patientResponse: PatientType.Patient = await updatePatient(patient);

    set((state) => ({ ...state, patient: patientResponse, patients: updateList(state.patients, patientResponse) }));
  },
  removePatient: async (patient) => {
    patient.person.active = false;
    await deletePatient(patient);
    set((state) => ({ ...state, patients: updateList(state.patients, patient) }));
  },
  getAllPatient: async () => {
      const patients: PatientType.Patient[] = await getPatients();
      set((state) => ({...state, patients}))
  }
}));


