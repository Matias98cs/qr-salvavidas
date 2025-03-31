import { ColumnDef } from "@tanstack/react-table";
import { PersonsList } from "@/interfaces/persons/person.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

interface ColumnsProps {
  onGenerateQR: (person: PersonsList) => void;
  onEdit?: (person: PersonsList) => void;
  onDelete?: (person: PersonsList) => void;
}

export const columns = ({
  onGenerateQR,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<PersonsList>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => `${row.original.name} ${row.original.last_name}`,
  },
  {
    accessorKey: "dni",
    header: "DNI",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "retired",
    header: "Jubilado",
    cell: ({ row }) => (row.original.retired ? "Sí" : "No"),
  },
  {
    accessorKey: "private",
    header: "Privado",
    cell: ({ row }) => (row.original.private ? "Sí" : "No"),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onEdit?.(person)}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onGenerateQR(person)}
            >
              Generar QR
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => onDelete?.(person)}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
