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

interface QRPersonModalProps {
  isOpen: boolean;
  person: PersonsList | null;
  qrImageBase64: string | null;
  onClose: () => void;
}

export default function QRPersonModal({
  isOpen,
  person,
  qrImageBase64,
  onClose,
}: QRPersonModalProps) {
  if (!person || !qrImageBase64) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Código QR generado</DialogTitle>
          <DialogDescription>
            Este código QR contiene los datos de la persona. Podés descargarlo o
            escanearlo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 mt-4">
          <p>
            Persona:{" "}
            <strong>
              {person.name} {person.last_name}
            </strong>
          </p>

          <img
            src={qrImageBase64}
            alt="Código QR"
            className="w-48 h-48 border rounded-md"
          />
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <a
            href={qrImageBase64}
            download={`qr_persona_${person.id}.png`}
            className="cursor-pointer"
          >
            <Button className="cursor-pointer">Descargar QR</Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
