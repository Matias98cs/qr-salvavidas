import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authChangeProfileData } from "@/services/auth/auth.service";
import { AuthProfileResponse } from "@/interfaces/auth.interface";


const useUpdateAuthProfile = () => {
    const queryClient = useQueryClient();

    // Mutación para actualizar el perfil
    const mutation = useMutation<void, Error, AuthProfileResponse>({
        mutationFn: authChangeProfileData,
        onSuccess: (_, newProfileData) => {
            // ✅ Actualizar la caché con los nuevos datos del perfil
            queryClient.setQueryData(["userProfile", newProfileData.id], newProfileData);
        },
        onError: (error) => {
            console.error("Error al actualizar el perfil:", error);
        }
    });

    return mutation;
};

export default useUpdateAuthProfile;
