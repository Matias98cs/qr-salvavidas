import { FormEditPerson } from "@/components/FormEditPerson";
import Loading from "@/components/Loading";
import { Errors, Person } from "@/interfaces/persons/person.interface";
import usePersonById from "@/presentations/persons/hooks/usePersonById";
import { updatePerson } from "@/services/persons/person.service";
import { validatePersonForm } from "@/validations/validatePersonForm";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditPerson() {
  const { id } = useParams<{ id: string }>();
  const { personData, isLoadingPD, errorPD, isErrorPD } = usePersonById(
    Number(id)
  );
  const [formData, setFormData] = useState<Person | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (personData) {
      setFormData({
        ...personData,
        medical_coverage_ids:
          personData.medical_coverage?.map((m) => m.id) ?? [],
        ambulance_service_ids:
          personData.ambulance_service?.map((a) => a.id) ?? [],
      });
    }
  }, [personData]);

  if (isLoadingPD) {
    return <Loading />;
  }
  if (isErrorPD) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <p>{(errorPD as Error).message}</p>
      </div>
    );
  }
  if (isErrorPD) {
    return (
      <p className="text-center text-red-500">
        Ocurrió un error al cargar los datos.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    const { isValid, errors: formErrors } = validatePersonForm(formData);
    setErrors(formErrors);

    if (!isValid) {
      return;
    }
    handleUpdatePerson();
  };

  const handleUpdatePerson = async () => {
    if (formData?.id) {
      try {
        await updatePerson(formData?.id, formData);
        queryClient.invalidateQueries({ queryKey: ["personsList"] });
        toast.success("Persona actualizada con éxito!");
      } catch (error) {
        if (typeof error === "object" && error !== null) {
          console.log(error);
          setErrors(error as Errors);
          toast.error("Error al actualizar la persona.");
        } else {
          toast.error("Ocurrió un error desconocido al crear la persona.");
        }
      }
    } else {
      toast.error("No se ha podido actualizar la persona.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto pb-10">
        <h1 className="text-2xl font-bold mb-6">
          Edición de datos de la Persona
        </h1>
        <Label>
          Nombre: {formData?.name} {formData?.last_name}
        </Label>
      </div>
      {formData && (
        <FormEditPerson
          personData={formData}
          errors={errors}
          setErrors={setErrors}
          setPersonData={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
