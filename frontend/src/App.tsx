import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Configurations from "./pages/Configurations";
import ListPersons from "./pages/ListPersons";
import LoadPersons from "./pages/LoadPersons";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/configuracion" element={<Configurations />} />
          <Route path="/lista" element={<ListPersons />} />
          <Route path="/carga" element={<LoadPersons />} />
        </Route>
      </Routes>
    </Router>
  );
}
