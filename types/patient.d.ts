import { Person } from "./person";

//export type PersonType = 'Paciente' | 'Profissional';

export interface Patient {
      id?: number | null;
      nickName: string;
      person: Person;
}