import { https } from "@/config/axios.api";
import { Person } from "@/interfaces/persons/person.interface";
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