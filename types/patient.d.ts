import { PersonType } from './patient.d';
type Gender = 'MASCULINO' | 'FEMININO';

//export type PersonType = 'Paciente' | 'Profissional';

declare namespace PatientType {
  interface Patient {
      id?: number | null;
      nickName: string;
      person: Person;
  }

  interface Person {
    id?: number | null;
    fullName?: string;
    email?: string;
    birthDay?: string;
    cpf?: string;
    rg?: number | null;
    gender?: Gender | "";
    address?: string;
    zipCode?: number | null;
    phone?: string;
    phone2?: string;
    active?: boolean | null;
    createdDate?: string | null;
    personType: PersonType;
  } 
  
  interface PersonType {
    id?: number | null;
    name: string;
  }

}