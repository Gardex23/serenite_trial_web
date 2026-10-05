import { Link } from "react-router-dom";
import CartMenu from "./CartMenu";
import { useAuth } from "../utils/AuthContext";

const IconUser = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" strokeLinecap="round" />
  </svg>
);

export function Header({ scrolled }) {
  const { usuario } = useAuth();

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <Link to="/" className="nav__logo"><img src="/img/logo-blanco.png" alt="Serenithé" /></Link>
      <nav className="nav__links">
        <Link to="/">Inicio</Link>
        <Link to="/esencias">Esencias</Link>
        {usuario?.role === "admin" && <Link to="/dashboard">Dashboard</Link>}
      </nav>
      <div className="nav__user">
        <CartMenu />
        <Link to={usuario ? "/perfil" : "/login"}
              aria-label={usuario ? "Mi perfil" : "Iniciar sesión"}><IconUser /></Link>
      </div>
    </header>
  );
}
