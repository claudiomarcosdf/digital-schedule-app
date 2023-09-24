import { create } from "zustand";

import type { Patient } from "../types/patient";
import type { PersonType, Person } from "../types/person";
import { createPatient, deletePatient, getPatients, updatePatient } from "../libs/PatientService";

type PatientStoreProps = {
  patient: Patient | null;
  patients: Patient[];
  setPatient: (patient: Patient | null) => void;
  createPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  removePatient: (patient: Patient) => void;
  getAllPatient: () => void;
}

const initialPersonType: PersonType = {
    id: 1,
    name: "Paciente"   
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

export const initialPatient: Patient = {
  id: null,
  nickName: "",
  person: initialPerson
}

const _updateList = (value: any, objToFin: any) => {
   value.splice(value.findIndex((patient: any) => patient?.id == objToFin?.id),1,objToFin);
   return value;
  // state.patients.splice(state.patients.findIndex(patient => patient?.id == patientResponse?.id),1,patientResponse)
}

export const usePatientStore = create<PatientStoreProps>((set) => ({
  patient: initialPatient,
  patients: [],
  setPatient: (patient) => set((state) => ({...state, patient})),
  createPatient: async (patient) => {
      const patientResponse: Patient  = await createPatient(patient);
      set((state) => ({ ...state, 
        patient: patientResponse, 
        patients: [...state.patients, patientResponse] }))
  },  
  updatePatient: async (patient) => {
    const patientResponse: Patient = await updatePatient(patient);

    set((state) => ({ ...state, patient: patientResponse, patients: _updateList(state.patients, patientResponse) }));
  },
  removePatient: async (patient) => {
    patient.person.active = false;
    await deletePatient(patient);
    set((state) => ({ ...state, patients: _updateList(state.patients, patient) }));
  },
  getAllPatient: async () => {
      const patients: Patient[] = await getPatients();
      set((state) => ({...state, patients}))
  }
}));


