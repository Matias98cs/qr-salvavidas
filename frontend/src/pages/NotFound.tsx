import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold text-black">404</h1>
      <p className="text-lg text-gray-600 mt-2">Oops! Página no encontrada.</p>
      <Link
        to="/login"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
