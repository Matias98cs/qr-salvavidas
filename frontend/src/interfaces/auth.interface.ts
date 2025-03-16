import { PhoneType } from "./user.interface";

export interface AuthResponse {
    refresh: string;
    access: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    dni: string;
    role: string;
    first_name: string;
    last_name: string;
}

export interface AuthRefreshResponse {
    access: string;
    refresh: string;
    user: User;
}


export interface AuthProfileResponse {
    email: string;
    dni: string;
    birth_date: string;
    read_qr: boolean;
    role: string;
    first_name: string;
    last_name: string;
    phones: Phone[];
    country: string;
    province: string;
    nationality: string;
}

export interface Phone {
    id: number;
    country_code: string;
    area_code: string;
    phone_number: string;
    type: PhoneType;
}
