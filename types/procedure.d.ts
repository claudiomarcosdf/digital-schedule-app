import { ProfessionalType } from './professional.d';

export interface Procedure {
  id?: number | null;
  name: string;
  price: number;
  active: boolean;
  professionalType: ProfessionalType;
}