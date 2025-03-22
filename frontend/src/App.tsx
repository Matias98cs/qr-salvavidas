import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import PublicRoute from "./routes/PublicRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Configurations = lazy(() => import("./pages/Configurations"));
const ListPersons = lazy(() => import("./pages/ListPersons"));
const LoadPersons = lazy(() => import("./pages/LoadPersons"));
const NotFound = lazy(() => import("./pages/NotFound")); // Nueva página 404

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/register" element={<Register />} /> */}
            </Route>

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
    </QueryClientProvider>
  );
}
