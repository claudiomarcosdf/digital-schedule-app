import { Person } from "./person";

export interface ProfessionalType {
  id?: number | null;
  name: string;
  active: boolean;
}

export interface ProfessionalSchedule {
  id?: number | null;
  professionalId: number;
  monday?: string | null;
  tuesday?: string | null;
  wednesday?: string | null;
  thursday?: string | null;
  friday?: string | null;
  saturday?: string | null;
  sunday?: string | null;
}

export interface Professional {
  id?: number | null;
  nickName: string;
  document: number | null;
  durationService: number | null;
  intervalService: number | null;
  person: Person;
  professionalType: ProfessionalType;
  professionalSchedule?: ProfessionalSchedule | null;
}

export interface ProfessionalSchedulePropsForm {
  hrIniMorningMonday: string;
  hrFinMorningMonday: string;
  hrIniEveningMonday: string;
  hrFinEveningMonday: string;

  hrIniMorningTuesday: string;
  hrFinMorningTuesday: string;
  hrIniEveningTuesday: string;
  hrFinEveningTuesday: string;   
  
  hrIniMorningWednesday: string;
  hrFinMorningWednesday: string;
  hrIniEveningWednesday: string;
  hrFinEveningWednesday: string;   
  
  hrIniMorningThursday: string;
  hrFinMorningThursday: string;
  hrIniEveningThursday: string;
  hrFinEveningThursday: string;    

  hrIniMorningFriday: string;
  hrFinMorningFriday: string;
  hrIniEveningFriday: string;
  hrFinEveningFriday: string;    

  hrIniMorningSaturday: string;
  hrFinMorningSaturday: string;
  hrIniEveningSaturday: string;
  hrFinEveningSaturday: string;    

  hrIniMorningSunday: string;
  hrFinMorningSunday: string;
  hrIniEveningSunday: string;
  hrFinEveningSunday: string;    
}
