import { Person } from "@/interfaces/persons/person.interface";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { getPersonById } from "@/services/persons/person.service";
import { useQuery } from "@tanstack/react-query";

const usePersonById = (id: number) => {
    const { status } = useAuthStore();

    const { data, isLoading, isError, error } = useQuery<Person, Error>({
        queryKey: ["personById", id],
        queryFn: () => getPersonById(id),
        enabled: !!id && status === "authenticated"
    });

    return {
        personData: data,
        isLoadingPD: isLoading,
        isErrorPD: isError,
        errorPD: error,
    };

}

export default usePersonById;