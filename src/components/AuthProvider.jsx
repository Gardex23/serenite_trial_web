import { useCallback, useEffect, useMemo, useState } from "react";
import { ContextoAuth } from "../utils/AuthContext";
import { cerrarSesion, iniciarSesion, obtenerSesion, registrarUsuario } from "../utils/Verification";

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    obtenerSesion().then((sesion) => {
      if (!vigente) return;
      setUsuario(sesion);
      setCargando(false);
    });
    return () => {
      vigente = false;
    };
  }, []);

  const login = useCallback(async (credenciales) => {
    const sesion = await iniciarSesion(credenciales);
    setUsuario(sesion);
    return sesion;
  }, []);

  const register = useCallback((datos) => registrarUsuario(datos), []);

  const logout = useCallback(() => {
    cerrarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, login, register, logout }),
    [usuario, cargando, login, register, logout],
  );

  return <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>;
}