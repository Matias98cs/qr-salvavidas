import { AuthProfileResponse } from "@/interfaces/auth.interface";
import { authProfile } from "@/services/auth/auth.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

const useAuthProfile = () => {
    const { status, user } = useAuthStore();
    const queryClient = useQueryClient();

    const userProfileQuery = useQuery<AuthProfileResponse | null>({
        queryKey: ["userProfile", user?.id],
        queryFn: authProfile,
        staleTime: 1000 * 60 * 60, // 1 hora antes de volver a hacer la petición
        enabled: status === "authenticated", // ❌ No llama si no está autenticado
    });


    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        }
    }, [user, queryClient]);

    return userProfileQuery;
};

export default useAuthProfile;