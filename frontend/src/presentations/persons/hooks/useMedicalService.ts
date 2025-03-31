import { MedicalCoverage } from "@/interfaces/persons/person.interface";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { getMedicalServices } from "@/services/persons/ambulance_medical.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


const useMedicalServices = () => {
    const { status, user } = useAuthStore();
    const queryClient = useQueryClient();

    const medicalServicesQuery = useQuery<MedicalCoverage[], Error>({
        queryKey: ["medicalServices"],
        queryFn: getMedicalServices,
        staleTime: 1000 * 60 * 60,
        enabled: status === "authenticated",

    });

    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ["medicalServices"] });
        }
    }, [user, queryClient]);

    return {
        medicalServices: medicalServicesQuery.data,
        isLoadingMS: medicalServicesQuery.isLoading,
        errorMS: medicalServicesQuery.error,
    }
}

export default useMedicalServices;