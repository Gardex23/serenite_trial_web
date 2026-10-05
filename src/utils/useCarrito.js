import { useContext } from "react";
import { CarritoCtx } from "./carritoStore";

export function useCarrito() {
  const ctx = useContext(CarritoCtx);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}
