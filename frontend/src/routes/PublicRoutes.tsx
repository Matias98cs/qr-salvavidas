import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/presentations/auth/store/useAuthStore";
import { useEffect } from "react";

export default function PublicRoute() {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  return status === "authenticated" ? <Navigate to="/" replace /> : <Outlet />;
}
