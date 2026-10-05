import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useCarrito } from "../utils/useCarrito";
import { fmt, pluralPerfumes } from "../data/esencias";
import "../styles/tienda.css";

export default function Carrito() {
  const { grupos, totalPerfumes, totalMl, total, cambiarCantidad, quitar, vaciar, enviarOrden } = useCarrito();

  return (
    <>
      <Header scrolled />
      <main className="tienda">
        <h1>Carrito</h1>

        {grupos.length === 0 ? (
          <div className="ess__vacio">
            <p>Tu carrito está vacío. Elige una esencia para empezar tu pedido.</p>
            <Link to="/esencias" className="btn btn--sm">Ver esencias</Link>
          </div>
        ) : (
          <>
            <p className="tienda__sub">Tus esencias, agrupadas con la cantidad de perfumes y de ml.</p>
            <div className="car__body">
              <div className="car__grupos">
                {grupos.map((g) => (
                  <section key={g.esenciaId} className="car-grupo">
                    <header>
                      <h2>{g.nombre}</h2>
                      <span>
                        {pluralPerfumes(g.perfumes)} · {g.ml} ml · {fmt(g.subtotal)}
                      </span>
                    </header>
                    <ul>
                      {g.lineas.map((l) => (
                        <li key={l.id}>
                          <div>
                            <strong>{l.ml} ml</strong> · frasco {l.frascoNombre}
                            <small>{fmt(l.precioUnit)} c/u</small>
                          </div>
                          <div className="stepper">
                            <button type="button" onClick={() => cambiarCantidad(l.id, l.cantidad - 1)} disabled={l.cantidad <= 1} aria-label={`Quitar uno de ${g.nombre} ${l.ml} ml`}>−</button>
                            <output>{l.cantidad}</output>
                            <button type="button" onClick={() => cambiarCantidad(l.id, l.cantidad + 1)} aria-label={`Agregar uno de ${g.nombre} ${l.ml} ml`}>+</button>
                          </div>
                          <strong className="car-grupo__precio">{fmt(l.precioUnit * l.cantidad)}</strong>
                          <button type="button" className="car-grupo__quitar" onClick={() => quitar(l.id)}>
                            Quitar
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="car__resumen">
                <h2>Resumen</h2>
                <dl>
                  <div><dt>Perfumes</dt><dd>{totalPerfumes}</dd></div>
                  <div><dt>Mililitros</dt><dd>{totalMl} ml</dd></div>
                  <div className="car__total"><dt>Total</dt><dd>{fmt(total)}</dd></div>
                </dl>
                <button type="button" className="btn btn--sm" onClick={enviarOrden}>Enviar orden por WhatsApp</button>
                <Link to="/esencias" className="btn btn--sm btn--ghost">Seguir viendo esencias</Link>
                <button type="button" className="ess__limpiar" onClick={vaciar}>Vaciar carrito</button>
              </aside>
            </div>
          </>
        )}
      </main>
    </>
  );
}
