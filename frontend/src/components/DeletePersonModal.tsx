import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PersonsList } from "@/interfaces/persons/person.interface";

interface DeletePersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (person: PersonsList) => void;
  person: PersonsList | null;
}

export default function DeletePersonModal({
  isOpen,
  onClose,
  onConfirm,
  person,
}: DeletePersonModalProps) {
  if (!person) return null;
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">¿Eliminar persona?</DialogTitle>
          <DialogDescription>
            Esta acción no borra definitivamente a la persona. Podrás
            recuperarla luego si lo necesitás.
          </DialogDescription>
        </DialogHeader>
        <p className="mt-2">
          Estás por marcar como eliminada a{" "}
          <strong>
            {person.name} {person.last_name}
          </strong>
          .
        </p>
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => onConfirm(person)}
          >
            Confirmar eliminación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
