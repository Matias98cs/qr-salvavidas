import { columns } from "@/components/ColumnsPerson";
import { DataTable } from "@/components/PersonsTable";
import { PersonsList } from "@/interfaces/persons/person.interface";
import usePersonsList from "@/presentations/persons/hooks/usePersonsList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ListPersons() {
  const navigate = useNavigate();
  const { personsList, isLoadingPL, errorPL } = usePersonsList();
  const [selectedPerson, setSelectedPerson] = useState<PersonsList | null>(
    null
  );
  const [isQRModalOpen, setQRModalOpen] = useState(false);

  if (isLoadingPL) {
    return <p>Cargando...</p>;
  }

  if (errorPL) {
    return <p>Error al cargar la lista de personas: {errorPL.message}</p>;
  }

  const handleOpenQRModal = (person: PersonsList) => {
    console.log(person);
    setSelectedPerson(person);
    setQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setSelectedPerson(null);
    setQRModalOpen(false);
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
        columns={columns({ onGenerateQR: handleOpenQRModal })}
        data={personsList ?? []}
      />
    </div>
  );
}

export default ListPersons;
