import { Link } from "react-router-dom";
import { QrCode, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";

export default function Navbar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link
        to="/"
        className="text-xl font-bold flex gap-2 justify-center items-center"
      >
        <QrCode />
        QR Salvavidas
      </Link>

      <div className="flex gap-6">
        <Link
          to="/"
          className={cn("text-gray-700 hover:text-black transition-colors")}
        >
          Inicio
        </Link>
        <Link
          to="/lista"
          className={cn("text-gray-700 hover:text-black transition-colors")}
        >
          Lista
        </Link>
        <Link
          to="/carga"
          className={cn("text-gray-700 hover:text-black transition-colors")}
        >
          Carga de datos
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full cursor-pointer"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Menú de usuario</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/configuracion" className="cursor-pointer">
              Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
