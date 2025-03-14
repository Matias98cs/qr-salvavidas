import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <span className="ml-2 text-gray-700 text-lg">Cargando...</span>
    </div>
  );
}
