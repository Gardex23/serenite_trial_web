import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import { useAuth } from "./utils/AuthContext";
import { CarritoProvider } from "./utils/CarritoContext";
import Index from "./pages/Index";
import Esencias from "./pages/Esencias";
import Ordenar from "./pages/Ordenar";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Protegida({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (soloAdmin && usuario.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function SoloVisitantes({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return null;
  if (usuario) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      {/* El carrito va dentro de AuthProvider porque guarda un carrito por usuario */}
      <CarritoProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<SoloVisitantes><Login /></SoloVisitantes>} />
          <Route path="/register" element={<SoloVisitantes><Register /></SoloVisitantes>} />
          <Route path="/esencias" element={<Protegida><Esencias /></Protegida>} />
          <Route path="/esencias/:id/ordenar" element={<Protegida><Ordenar /></Protegida>} />
          <Route path="/carrito" element={<Protegida><Carrito /></Protegida>} />
          <Route path="/perfil" element={<Protegida><Perfil /></Protegida>} />
          <Route path="/dashboard" element={<Protegida soloAdmin><Dashboard /></Protegida>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CarritoProvider>
    </AuthProvider>
  );
}
