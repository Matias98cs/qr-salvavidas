import { AmbulanceService } from "@/interfaces/persons/person.interface";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { getAmbulanceServices } from "@/services/persons/ambulance_medical.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


const useAmbulanceServices = () => {
    const { status, user } = useAuthStore();
    const queryClient = useQueryClient();

    const ambulanceServicesQuery = useQuery<AmbulanceService[], Error>({
        queryKey: ["ambulanceServices"],
        queryFn: getAmbulanceServices,
        staleTime: 1000 * 60 * 60,
        enabled: status === "authenticated",

    });


    useEffect(() => {
        if (user) {
            queryClient.invalidateQueries({ queryKey: ["ambulanceServices"] });
        }
    }, [user, queryClient]);

    return {
        ambulanceServices: ambulanceServicesQuery.data,
        isLoadingAS: ambulanceServicesQuery.isLoading,
        isErrorAS: ambulanceServicesQuery.isError,
        error: ambulanceServicesQuery.error,
        refetch: ambulanceServicesQuery.refetch,
    };
}

export default useAmbulanceServices;