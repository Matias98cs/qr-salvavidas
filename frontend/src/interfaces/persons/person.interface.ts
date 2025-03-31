import { Phone } from "../auth.interface";

export interface Person {
    name:                  string;
    last_name:             string;
    dni:                   string;
    age?:                   number;
    birth_date:            string;
    personal_phone:        string;
    email:                 string;
    phones?:                Phone[];
    company_phones?:        Phone[];
    medical_coverage_ids:  number[];
    ambulance_service_ids: number[];
    retired:               boolean;
    country:               string;
    nationality:           string;
    province:              string;
    blood_type:            string;
    medication_allergies:  string;
    takes_medication:      string;
    medical_history:       string;
    patient_status?:        string;
    organ_donor:           boolean;
    private:               boolean;
}


export interface AmbulanceService {
    id:   number;
    name: string;
}

export interface MedicalCoverage {
    id:   number;
    type: string;
    name: string;
}

export interface Errors {
    [key: string]: string | null;
}

export interface bloodTypes {
    id:   number;
    name: string;
    value: string;
}

export interface PersonsList {
    id:        number;
    name:      string;
    last_name: string;
    dni:       string;
    email:     string;
    retired:   boolean;
    private:   boolean;
}
