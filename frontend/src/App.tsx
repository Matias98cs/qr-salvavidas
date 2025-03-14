import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Configurations = lazy(() => import("./pages/Configurations"));
const ListPersons = lazy(() => import("./pages/ListPersons"));
const LoadPersons = lazy(() => import("./pages/LoadPersons"));
const NotFound = lazy(() => import("./pages/NotFound")); // Nueva página 404

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/configuracion" element={<Configurations />} />
            <Route path="/lista" element={<ListPersons />} />
            <Route path="/carga" element={<LoadPersons />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
