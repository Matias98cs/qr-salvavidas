import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import usePersonById from "@/presentations/persons/hooks/usePersonById";
import Loading from "@/components/Loading";
import { Person } from "@/interfaces/persons/person.interface";
import PersonInfoCard from "@/components/PersonInfoCard";
import { getErrorMessage } from "@/helpers/loginError";
import FullscreenLoading from "@/components/FullscreenLoading";
function ReadQR() {
  const { status, login } = useAuthStore();
  const { persona_id } = useParams();
  const { personData, isLoadingPD, errorPD, isErrorPD } = usePersonById(
    Number(persona_id)
  );
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  useEffect(() => {
    if (personData) {
      setPerson({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.emailOrUsername || !formData.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      await login(formData.emailOrUsername, formData.password);
      toast.success("Sesión iniciada correctamente!");
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      {loading && <FullscreenLoading />}
      {status === "authenticated" ? (
        person && <PersonInfoCard person={person} />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para ver la información de la persona
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">
                  Email o nombre de usuario
                </Label>
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  placeholder="ejemplo@correo.com"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"}
                    </span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ReadQR;
