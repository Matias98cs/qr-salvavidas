import axios, { AxiosError } from "axios";
import { authRefresh } from "@/services/auth/auth.service";

const baseURL = `${import.meta.env.VITE_APP_API_URL}/api`;

export const https = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true, // 🔹 Para enviar cookies
    timeout: 0,
});

https.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem("access");
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

https.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (!error.response) {
            console.error("Error de red o servidor no disponible", error);
            return Promise.reject(new Error("Error de red o servidor no disponible"));
        }

        const { response, config: originalRequest } = error;

        if (originalRequest?.url?.includes("/auth/token/")) {
            return Promise.reject(error);
        }

        if (response.status === 401 && originalRequest) {
            if (originalRequest.headers?.Authorization) {
                console.error("El refresh token ya falló. Redirigiendo al login...");
                handleLogout();
                return Promise.reject(new Error("Sesión expirada. Por favor, inicia sesión nuevamente."));
            }

            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                console.error("No hay refresh token, redirigiendo al login...");
                handleLogout();
                return Promise.reject(new Error("No se encontró un refresh token válido."));
            }

            try {
                const { access } = await authRefresh(refreshToken);
                localStorage.setItem("access", access);
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return https(originalRequest);
            } catch (refreshError) {
                console.log(refreshError)
                handleLogout();
                return Promise.reject(new Error("Error al refrescar la sesión. Inicia sesión nuevamente."));
            }
        }

        return Promise.reject(error);
    }
);

const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
};
