import { columns } from "@/components/ColumnsPerson";
import DeletePersonModal from "@/components/DeletePersonModal";
import FullscreenLoading from "@/components/FullscreenLoading";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/PersonsTable";
import QRPersonModal from "@/components/QRPersonModal";
import { Button } from "@/components/ui/button";
import { PersonsList } from "@/interfaces/persons/person.interface";
import useDeletePerson from "@/presentations/persons/hooks/useDeletePerson";
import usePersonsList from "@/presentations/persons/hooks/usePersonsList";
import { generateQRPerson } from "@/services/persons/person.service";
import { Label } from "@radix-ui/react-dropdown-menu";
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
  const [isQRModalOpen, setQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [qrImageBase64, setQRImageBase64] = useState<string | null>(null);

  if (isLoadingPL) {
    return <Loading />;
  }

  if (errorPL) {
    return <p>Error al cargar la lista de personas: {errorPL.message}</p>;
  }

  const handleOpenQRModal = async (person: PersonsList) => {
    setIsLoadingQR(true);
    try {
      const qrCode = await generateQRPerson(person.id);
      setQRImageBase64(qrCode.qr_image_base64);
      setQRModalOpen(true);
      setSelectedPerson(person);
    } catch (error) {
      toast.error("No se pudo generar el código QR.");
      console.error("Error al abrir el modal de código QR:", error);
    } finally {
      setIsLoadingQR(false);
    }
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
    navigate(`/editar/${id}`);
  };

  return (
    <div className="container mx-auto py-10">
      {isLoadingQR && <FullscreenLoading />}
      <h1 className="text-2xl font-bold mb-6">Personas Registradas</h1>
      {personsList?.length === 0 ? (
        <div className="flex justify-center items-center flex-col pt-10 gap-4">
          <Label>
            No hay personas registradas. Agregue una persona utilizando el botón
            de abajo.
          </Label>
          <Button
            className="w-1/2 hover:text-gray-300 cursor-pointer"
            onClick={() => navigate("/carga")}
          >
            Agregar Persona
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns({
            onGenerateQR: handleOpenQRModal,
            onDelete: handleOpenDeleteModal,
            onEdit: handleToEdit,
          })}
          data={personsList ?? []}
        />
      )}

      <DeletePersonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={(person) => {
          handleConfirmDelete(person.id);
          setDeleteModalOpen(false);
        }}
        person={selectedPerson}
      />

      <QRPersonModal
        isOpen={isQRModalOpen}
        onClose={() => setQRModalOpen(false)}
        person={selectedPerson}
        qrImageBase64={qrImageBase64}
      />
    </div>
  );
}

export default ListPersons;
