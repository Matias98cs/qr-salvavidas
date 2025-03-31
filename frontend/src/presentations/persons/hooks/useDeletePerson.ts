import { deletePerson } from "@/services/persons/person.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeletePerson = () => {
    const queryClient = useQueryClient();

    const deletePersonMutation = useMutation<void, Error, number>({
        mutationFn: (id: number) => deletePerson(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personsList"] });
        },
    });

    return {
        deletePerson: deletePersonMutation.mutate,
        isError: deletePersonMutation.isError,
        error: deletePersonMutation.error,
    };
};

export default useDeletePerson;