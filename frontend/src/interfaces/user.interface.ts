export type PhoneType = "personal" | "work" | "emergency";

export interface Phone {
  id?: number;
  country_code: string;
  area_code: string;
  phone_number: string;
  type: PhoneType;
}

export interface UserData {
  email: string;
  dni: string;
  birth_date: string;
  first_name: string;
  last_name: string;
  country: string;
  nationality: string;
  province: string;
  read_qr: number | boolean;
}

export interface Errors {
  [key: string]: string | null;
}
