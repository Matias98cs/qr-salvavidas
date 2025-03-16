import { useAuthStore } from "@/presentations/auth/store/useAuthStore";

export default function Home() {
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col items-center justify-center pt-6">
      <h1 className="text-3xl font-bold">🏠 Hola {user?.first_name}</h1>
      <p className="text-lg">Estás logueado como: {user?.email}</p>
      <p className="text-gray-600">Estás en la página principal.</p>
      <p className="text-gray-600">Bienvenido a la página de inicio.</p>
    </div>
  );
}
