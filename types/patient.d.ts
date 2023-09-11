import { PersonType } from './patient.d';
type Gender = 'MASCULINO' | 'FEMININO';

//export type PersonType = 'Paciente' | 'Profissional';

declare namespace Patient {
  interface Patient {
      id?: number;
      person: Person;
      createdDate: string;
  }

  interface Person {
    id?: number;
    fullName?: string;
    email?: string;
    birthDay?: string;
    cpf?: string;
    rg?: number;
    gender?: Gender;
    address?: string;
    zipCode?: number;
    phone?: string;
    phone2?: string;
    active: boolean;
    personType: PersonType;
  } 
  
  interface PersonType {
    id?: number;
    name: string;
  }

}