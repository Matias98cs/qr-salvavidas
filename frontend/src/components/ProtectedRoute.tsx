import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return (
      <div className="flex justify-center items-center h-screen">
        Verificando sesión...
      </div>
    );
  }

  return status === "authenticated" ? (
    <div>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}
