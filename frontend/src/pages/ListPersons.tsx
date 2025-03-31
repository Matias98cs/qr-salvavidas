import { columns } from "@/components/ColumnsPerson";
import DeletePersonModal from "@/components/DeletePersonModal";
import { DataTable } from "@/components/PersonsTable";
import { PersonsList } from "@/interfaces/persons/person.interface";
import useDeletePerson from "@/presentations/persons/hooks/useDeletePerson";
import usePersonsList from "@/presentations/persons/hooks/usePersonsList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ListPersons() {
  const navigate = useNavigate();
  const { personsList, isLoadingPL, errorPL } = usePersonsList();
  const { deletePerson } = useDeletePerson();
  const [selectedPerson, setSelectedPerson] = useState<PersonsList | null>(
    null
  );
  // const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  if (isLoadingPL) {
    return <p>Cargando...</p>;
  }

  if (errorPL) {
    return <p>Error al cargar la lista de personas: {errorPL.message}</p>;
  }

  const handleOpenQRModal = (person: PersonsList) => {
    setSelectedPerson(person);
    // setQRModalOpen(true);
  };

  const handleOpenDeleteModal = (person: PersonsList) => {
    setSelectedPerson(person);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (personId: number) => {
    deletePerson(personId);
    toast.success("Persona eliminada correctamente");
  };

  const handleToEdit = (id: number) => {
    console.log(`Ir a editar persona: ${id}`);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Personas Registradas</h1>
      {personsList && personsList.length < 0 && (
        <div className="flex justify-end mb-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate("/carga")}
          >
            Agregar Persona
          </button>
        </div>
      )}
      <DataTable
        columns={columns({
          onGenerateQR: handleOpenQRModal,
          onDelete: handleOpenDeleteModal,
          onEdit: handleToEdit,
        })}
        data={personsList ?? []}
      />

      <DeletePersonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={(person) => {
          handleConfirmDelete(person.id);
          setDeleteModalOpen(false);
        }}
        person={selectedPerson}
      />
    </div>
  );
}

export default ListPersons;
