import { Procedure } from "./procedure";
import { ProfessionalType } from "./professional";

type Gender = 'MASCULINO' | 'FEMININO';

export interface PatientSchedule {
  id: number;
  fullName: string;
  birthDay?: string;
  gender?: Gender | "";
  cpf?: string;
  phone?: string;
  phone2?: string;
}

export interface ProfessionalSchedule {
  id?: number | null;
  nickName: string;
  document: number | null;
  durationService: number | null;
  intervalService: number | null;
  phone?: string;
  phone2?: string;
}

export interface Schedule {
  id?: number | null;
  startDate: string;
  endDate: string;
  description: string;
  amountPaid?: number | 0.00;
  professionalType: ProfessionalType;
  professional: ProfessionalSchedule;
  patient?: PatientSchedule | null;
  procedure?: Procedure | null;
  status?: string | null;
  active?: boolean | null;
  createdDate?: string | null;
}

export interface ScheduleRequest {
  id?: number | null;
  startDate: string;
  endDate: string;
  description: string;
  amountPaid?: number | 0.00;
  professionalTypeId?: number | null;
  professionalId: number;
  patientId: number | null;
  procedureId: number | null;
  status?: string | null;
}