import { https } from "@/config/axios.api";
import { GenerateQR, Person, PersonsList } from "@/interfaces/persons/person.interface";
import { AxiosError } from "axios";

type ServerError = Record<string, string[]>;



export const createPerson = async (data: Person): Promise<Person> => {
    try {
        const response = await https.post<Person>("/persons/persons/", data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ServerError>;
        if (axiosError.response?.status === 400 && axiosError.response.data) {
            const rawErrors = axiosError.response.data;
            const parsedErrors: Record<string, string> = {};

            Object.entries(rawErrors).forEach(([key, value]) => {
                parsedErrors[key] = Array.isArray(value) ? value.join(" ") : value;
            });

            throw parsedErrors;
        }

        if (axiosError.response?.status === 403 && axiosError.response.data) {
            const rawErrors = axiosError.response.data;
            throw rawErrors;
        }

        throw new Error("Error de conexión con el servidor.");
    }
};

export const getPersonList = async (): Promise<PersonsList[]> => {
    try {
        const response = await https.get<PersonsList[]>("/persons/persons/");
        return response.data;
    } catch (error) {
        console.error("Error al obtener la lista de personas:", error);
        throw error;
    }
}

export const deletePerson = async (id: number): Promise<void> => {
    try {
        await https.delete(`/persons/persons/${id}/delete-all/`);
    } catch (error) {
        console.error("Error al eliminar la persona:", error);
        throw error;
    }
}


type DetailError = { detail: string };

export const getPersonById = async (id: number): Promise<Person> => {
    try {
        const response = await https.get<Person>(`/persons/persons/${id}/`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<DetailError>;
        console.log(axiosError)
        if (axiosError.response?.status === 404 && axiosError.response.data) {
            const detail = axiosError.response.data.detail || "Persona no encontrada";
            throw new Error(detail);
          }

        throw new Error("Ocurrió un error al obtener los datos de la persona.");
    }
};


export const updatePerson = async (id: number, data: Partial<Person>): Promise<Person> => {
    try {
        const response = await https.patch<Person>(`/persons/persons/${id}/`, data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ServerError>;

        if (axiosError.response?.status === 400 && axiosError.response.data) {
            const rawErrors = axiosError.response.data;
            const parsedErrors: Record<string, string> = {};

            Object.entries(rawErrors).forEach(([key, value]) => {
                parsedErrors[key] = Array.isArray(value) ? value.join(" ") : value;
            });

            throw parsedErrors;
        }

        throw new Error("Error de conexión con el servidor.");
    }
}

export const generateQRPerson = async (id: number): Promise<GenerateQR> => {
    try {
        const response = await https.get<GenerateQR>(`/persons/persons/${id}/generate-qr/`);
        return response.data;
    } catch (error) {
        console.error("Error al generar el código QR:", error);
        throw error;
    }
}