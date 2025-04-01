import { PersonsList } from "@/interfaces/persons/person.interface";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { getPersonList } from "@/services/persons/person.service";
import { useQuery } from "@tanstack/react-query";


const usePersonsList = () => {
    const { status } = useAuthStore();

    const personsListQuery = useQuery<PersonsList[], Error>({
        queryKey: ["personsList"],
        queryFn: getPersonList,
        staleTime: 1000 * 60 * 60,
        enabled: status === "authenticated",
    });


    return {
        personsList: personsListQuery.data,
        isLoadingPL: personsListQuery.isLoading,
        errorPL: personsListQuery.error,
    }
}

export default usePersonsList;