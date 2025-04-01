import { https } from "@/config/axios.api";
import { Person, PersonsList } from "@/interfaces/persons/person.interface";
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

export const getPersonById = async (id: number): Promise<Person> => {
    try {
        const response = await https.get<Person>(`/persons/persons/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la persona:", error);
        throw error;
    }
}


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