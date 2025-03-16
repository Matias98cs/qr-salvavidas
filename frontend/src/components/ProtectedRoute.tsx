import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const isAuthenticated = true;

export default function ProtectedRoute() {
  return isAuthenticated ? (
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
