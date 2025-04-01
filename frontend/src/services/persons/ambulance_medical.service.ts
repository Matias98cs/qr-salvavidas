import { https } from "@/config/axios.api";
import { AmbulanceService, MedicalCoverage } from "@/interfaces/persons/person.interface";



export const getAmbulanceServices = async (): Promise<AmbulanceService[]> => {
    try {
        const response = await https.get("/persons/ambulance-services/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los servicios de ambulancia:", error);
        throw error;
    }
}

export const getMedicalServices = async (): Promise<MedicalCoverage[]> => {
    try {
        const response = await https.get("/persons/medical-coverages/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los servicios médicos:", error);
        throw error;
    }
}