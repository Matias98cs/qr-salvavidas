import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import PublicRoute from "./routes/PublicRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Configurations = lazy(() => import("./pages/Configurations"));
const ListPersons = lazy(() => import("./pages/ListPersons"));
const LoadPersons = lazy(() => import("./pages/LoadPersons"));
const EditPerson = lazy(() => import("./pages/EditPerson"));
const ReadQR = lazy(() => import("./pages/ReadQR"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
              <Route path="/editar/:id" element={<EditPerson />} />
            </Route>

            <Route path="/leer-qr/:persona_id" element={<ReadQR />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </Router>
    </QueryClientProvider>
  );
}
