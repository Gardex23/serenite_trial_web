import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useCarrito } from "../utils/useCarrito";
import { ESENCIAS, MLS, frascosPara, precioItem, fmt, pluralPerfumes } from "../data/esencias";
import "../styles/tienda.css";

export default function Ordenar() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const esencia = ESENCIAS.find((e) => e.id === Number(id));

  const [ml, setMl] = useState(50);
  const [frascoId, setFrascoId] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(null);

  if (!esencia) return <Navigate to="/esencias" replace />;

  const opciones = frascosPara(ml);
  const frasco = opciones.find((f) => f.id === frascoId) ?? opciones[0];
  const precioUnit = precioItem(esencia, ml, frasco);

  const enviar = (ev) => {
    ev.preventDefault();
    agregar({ esencia, ml, frasco, cantidad, precioUnit });
    setAgregado({ cantidad, ml, frasco: frasco.nombre });
  };

  return (
    <>
      <Header scrolled />
      <main className="tienda ord">
        <Link to="/esencias" className="ord__volver">← Volver a esencias</Link>

        <div className="ord__grid">
          <div className="ord__vista">
            <img src={esencia.img} alt={`Frasco de ${esencia.nombre}`} />
          </div>

          <form className="ord__form" onSubmit={enviar}>
            <h1>{esencia.nombre}</h1>
            <p className="tienda__sub">
              {esencia.genero} · {esencia.acordes.join(" · ")}
            </p>

            <fieldset>
              <legend>Cantidad de ml por perfume</legend>
              <div className="ord__pills">
                {MLS.map((m) => (
                  <label key={m} className={`ord__pill ${m === ml ? "is-on" : ""}`}>
                    <input type="radio" name="ml" value={m} checked={m === ml} onChange={() => setMl(m)} />
                    {m} ml
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Frasco</legend>
              <div className="ord__frascos">
                {opciones.map((f) => (
                  <label key={f.id} className={`ord__frasco ${f.id === frasco.id ? "is-on" : ""}`}>
                    <input type="radio" name="frasco" value={f.id} checked={f.id === frasco.id} onChange={() => setFrascoId(f.id)} />
                    <span>
                      <strong>{f.nombre}</strong>
                      <small>{f.detalle}</small>
                    </span>
                    <span>+{fmt(f.precio)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Cuántos perfumes llevas</legend>
              <div className="stepper">
                <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} aria-label="Quitar uno" disabled={cantidad <= 1}>−</button>
                <output aria-live="polite">{cantidad}</output>
                <button type="button" onClick={() => setCantidad((c) => Math.min(99, c + 1))} aria-label="Agregar uno">+</button>
              </div>
            </fieldset>

            <div className="ord__total">
              <span>
                {fmt(precioUnit)} c/u · {cantidad * ml} ml en total
              </span>
              <strong>{fmt(precioUnit * cantidad)}</strong>
            </div>

            <button type="submit" className="btn btn--sm">Agregar al carrito</button>

            {agregado && (
              <div className="ord__ok" role="status">
                <p>
                  Agregaste {pluralPerfumes(agregado.cantidad)} de {esencia.nombre} ({agregado.ml} ml, frasco {agregado.frasco}).
                </p>
                <div>
                  <Link to="/carrito" className="btn btn--sm">Ver carrito</Link>
                  <Link to="/esencias" className="btn btn--sm btn--ghost">Seguir viendo esencias</Link>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
