import { create } from "zustand";

import type { Patient } from "../types/patient";
import type { PersonType, Person } from "../types/person";
import { createPatient, deletePatient, findPatientsByName, getPatients, updatePatient } from "../libs/PatientService";
import { toast } from 'react-toastify';

type PatientStoreProps = {
  patient: Patient | null;
  patients: Patient[];
  setPatient: (patient: Patient | null) => void;
  createPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  removePatient: (patient: Patient) => void;
  findPatientsByName: (name: string) => void;
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
    const { data, error } = await createPatient(patient);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const patientResponse: Patient  = data;
      set((state) => ({ ...state, 
        patient: patientResponse, 
        patients: [...state.patients, patientResponse] }));
        toast.success("Paciente incluído", { className: 'toast-message-success' });
    }
  },  
  updatePatient: async (patient) => {
    const { data, error } = await updatePatient(patient);
    error && toast.error(error as string, { className: 'toast-message-error' });

    if (data) {
      const patientResponse: Patient = data;
      set((state) => ({ ...state, patient: patientResponse, patients: _updateList(state.patients, patientResponse) }));
      toast.success("Paciente atualizado", { className: 'toast-message-success' });
    }

  },
  removePatient: async (patient) => {
    patient.person.active = false;
    const { error } = await deletePatient(patient);
    error && toast.error(error as string, { className: 'toast-message-error' });
    
    set((state) => ({ ...state, patients: _updateList(state.patients, patient) }));
  },
  findPatientsByName: async (name: string) => {
    const { data, error } = await findPatientsByName(name);
    error && toast.error(error as string, { className: 'toast-message-error' });

    const patientsResponse: Patient[] = data;
    console.log(patientsResponse)
    set((state) => ({...state, patients: patientsResponse}));
  },
  getAllPatient: async () => {
      const patients: Patient[] = await getPatients();
      set((state) => ({...state, patients}))
  }
}));


