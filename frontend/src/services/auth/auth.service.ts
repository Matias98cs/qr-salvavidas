import { https } from "@/config/axios.api";
import { AuthProfileResponse, AuthRefreshResponse, AuthResponse } from "@/interfaces/auth.interface";
import { AxiosError } from "axios";

/**
 * Inicia sesión y almacena los tokens en localStorage
 * @param username Nombre de usuario
 * @param password Contraseña
 * @returns AuthResponse
 */
export const authLogin = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const { data } = await https.post<AuthResponse>("/auth/token/", { username, password });

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;

        const errorMessage = axiosError.response?.data?.detail || "Error de conexión con el servidor.";

        throw new Error(errorMessage);
    }
};

/**
 * Refresca el token de acceso utilizando el refresh token
 * @param refreshToken Token de refresco
 * @returns AuthRefreshResponse
 */
export const authRefresh = async (refreshToken: string): Promise<AuthRefreshResponse> => {
    if (!refreshToken) {
        console.warn("No hay refresh token válido.");
        throw new Error("No se encontró un refresh token válido.");
    }

    try {
        const { data } = await https.post<AuthRefreshResponse>("/auth/token/refresh/", { refresh: refreshToken });

        if (!data.access) {
            throw new Error("El servidor no devolvió un nuevo token.");
        }

        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        return data;
    } catch (error) {
        console.error("Error al refrescar el token:", error);

        const axiosError = error as AxiosError<{ detail?: string }>;
        const errorMessage = axiosError.response?.data?.detail || "Error al refrescar la sesión.";

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        throw new Error(errorMessage);
    }
};

/**
 * Cierra la sesión del usuario y elimina los tokens de almacenamiento local
 */
export const authLogout = async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
        console.warn("⚠️ No hay refresh token, no es necesario cerrar sesión.");
        return;
    }

    try {
        await https.post("/auth/logout/", { refresh_token: refreshToken });
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;

        if (axiosError.response?.status === 401) {
            console.warn("⚠️ Sesión ya expirada, limpiando tokens...");
        } else {
            console.error("❌ Error en authLogout:", axiosError.response?.data?.detail || "Error de conexión con el servidor.");
        }
    } finally {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    }
};


export const authProfile = async (): Promise<AuthProfileResponse> => {
    try {
        const { data } = await https.get<AuthProfileResponse>("/auth/profile");
        return data;
    } catch (error) {
        console.error("Error al obtener el perfil:", error);

        const axiosError = error as AxiosError<{ detail?: string }>;
        const errorMessage = axiosError.response?.data?.detail || "Error de conexión con el servidor.";

        throw new Error(errorMessage);
    }
}


export const authChangeProfileData = async (profileData: AuthProfileResponse): Promise<void> => {
    try {
        await https.put("/auth/profile/update/", profileData);
    } catch (error) {
        console.error("Error al actualizar los datos del perfil:", error);

        const axiosError = error as AxiosError<{ detail?: string }>;
        const errorMessage = axiosError.response?.data?.detail || "Error de conexión con el servidor.";

        throw new Error(errorMessage);
    }
}