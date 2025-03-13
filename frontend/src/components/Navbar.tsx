import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        🚀 MyApp
      </Link>

      <div className="flex gap-4">
        <Link to="/" className={cn("text-gray-700 hover:text-black")}>
          Home
        </Link>
        <Link to="/dashboard" className={cn("text-gray-700 hover:text-black")}>
          Dashboard
        </Link>
        <Link to="/settings" className={cn("text-gray-700 hover:text-black")}>
          Settings
        </Link>
      </div>

      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Logout
      </Button>
    </nav>
  );
}
