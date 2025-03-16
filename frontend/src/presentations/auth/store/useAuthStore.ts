import { create } from "zustand";
import { authLogin, authLogout, authRefresh } from "@/services/auth/auth.service";
import { AuthResponse, User } from "@/interfaces/auth.interface";

export type AuthStatus = "authenticated" | "unauthenticated" | "checking";

interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;
    password?: string;

    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkStatus: () => Promise<void>;
    changeStatus: (token?: string, user?: User) => void;
    resetState: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    status: "checking",
    token: undefined,
    user: undefined,
    password: undefined,

    changeStatus: (token, user) => {
        if (!token || !user) {
            set({ status: "unauthenticated", token: undefined, user: undefined });
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        } else {
            set({ status: "authenticated", token, user });
            localStorage.setItem("access", token);
        }
    },

    login: async (email, password) => {
        try {
            const response: AuthResponse = await authLogin(email, password);
            get().changeStatus(response.access, response.user);
            return true;
        } catch (error) {
            console.error("Error en login:", error);
            return false;
        }
    },

    logout: async () => {
        try {
            await authLogout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            get().resetState();
        }
    },

    checkStatus: async () => {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            console.warn("No hay refresh token, cambiando estado a 'unauthenticated'");
            set({ status: "unauthenticated", token: undefined, user: undefined });
            return;
        }

        try {
            const response = await authRefresh(refreshToken);
            set({ token: response.access, status: "authenticated" });
        } catch (error) {
            console.error("Error al refrescar el token:", error);
            set({ status: "unauthenticated", token: undefined, user: undefined });
        }
    },

    resetState: () => {
        set({ status: "unauthenticated", token: undefined, user: undefined });
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    },
}));
