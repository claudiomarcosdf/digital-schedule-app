
type Gender = 'MASCULINO' | 'FEMININO';

export interface PersonType {
  id?: number | null;
  name: string;
}

export interface Person {
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