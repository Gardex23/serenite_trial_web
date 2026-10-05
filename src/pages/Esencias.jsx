import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { ESENCIAS, GENEROS, ACORDES, ANIOS, FILTROS_INDEX, fmt, precioDesde } from "../data/esencias";
import "../styles/tienda.css";

const normalizar = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function Esencias() {
  const [params, setParams] = useSearchParams();

  // Parámetros que manda el index:
  //   ?filtro=mas-vendidas | clima   -> "Ver todas" de cada sección
  //   ?esencia=ID                    -> click en una tarjeta de la portada
  const claveFiltro = params.get("filtro");
  const preset = FILTROS_INDEX[claveFiltro] ?? null;
  const esenciaParam = Number(params.get("esencia")) || null;

  const [seleccion, setSeleccion] = useState(esenciaParam);
  const [q, setQ] = useState("");
  const [generos, setGeneros] = useState([]);
  const [acordes, setAcordes] = useState([]);
  const [anio, setAnio] = useState("");
  const [panelAbierto, setPanelAbierto] = useState(false);

  // Si llega ?esencia=ID, se marca la tarjeta y se lleva a la vista.
  useEffect(() => {
    if (!esenciaParam) return;
    setSeleccion(esenciaParam);
    document.getElementById(`esencia-${esenciaParam}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [esenciaParam]);

  const alternar = (lista, setLista, valor) =>
    setLista(lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor]);

  const quitarFiltroIndex = () => {
    const next = new URLSearchParams(params);
    next.delete("filtro");
    setParams(next, { replace: true });
  };

  const limpiar = () => {
    setQ("");
    setGeneros([]);
    setAcordes([]);
    setAnio("");
    if (preset) quitarFiltroIndex();
  };

  const resultados = useMemo(() => {
    const nq = normalizar(q.trim());
    const lista = ESENCIAS.filter((e) => {
      if (preset && !preset.test(e)) return false;
      if (nq && !normalizar(`${e.nombre} ${e.genero} ${e.acordes.join(" ")}`).includes(nq)) return false;
      if (generos.length && !generos.includes(e.genero)) return false;
      if (acordes.length && !e.acordes.some((a) => acordes.includes(a))) return false;
      if (anio && e.lanzamiento.slice(0, 4) !== anio) return false;
      return true;
    });
    const orden = preset?.orden ?? ((a, b) => b.lanzamiento.localeCompare(a.lanzamiento));
    return [...lista].sort(orden);
  }, [preset, q, generos, acordes, anio]);

  const activos = generos.length + acordes.length + (anio ? 1 : 0);
  const hayFiltros = activos > 0 || q.trim() !== "" || preset;

  return (
    <>
      <Header scrolled />
      <main className="tienda">
        <h1>Esencias</h1>
        <p className="tienda__sub">Elige una esencia y arma tu pedido con la medida y el frasco que prefieras.</p>

        <div className="ess__bar">
          <div className="ess__search">
            <label htmlFor="buscar" className="sr-only">Buscar esencia</label>
            <input
              id="buscar"
              type="search"
              placeholder="Buscar por nombre, género o acorde"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn--sm btn--ghost ess__filtros-btn"
            aria-expanded={panelAbierto}
            onClick={() => setPanelAbierto((v) => !v)}
          >
            Filtros{activos ? ` (${activos})` : ""}
          </button>
        </div>

        <div className="ess__body">
          <aside className={`ess__aside ${panelAbierto ? "is-open" : ""}`} aria-label="Filtros">
            <fieldset>
              <legend>Género</legend>
              {GENEROS.map((g) => (
                <label key={g} className="ess__check">
                  <input type="checkbox" checked={generos.includes(g)} onChange={() => alternar(generos, setGeneros, g)} />
                  {g}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Acordes</legend>
              {ACORDES.map((a) => (
                <label key={a} className="ess__check">
                  <input type="checkbox" checked={acordes.includes(a)} onChange={() => alternar(acordes, setAcordes, a)} />
                  {a}
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend>Año de salida</legend>
              <label className="ess__check">
                <input type="radio" name="anio" checked={anio === ""} onChange={() => setAnio("")} />
                Todos
              </label>
              {ANIOS.map((a) => (
                <label key={a} className="ess__check">
                  <input type="radio" name="anio" checked={anio === a} onChange={() => setAnio(a)} />
                  {a}
                </label>
              ))}
            </fieldset>

            {hayFiltros && (
              <button type="button" className="ess__limpiar" onClick={limpiar}>
                Limpiar filtros
              </button>
            )}
          </aside>

          <section aria-live="polite">
            {preset && (
              <div className="ess__chips">
                <span className="ess__chip">
                  {preset.titulo}
                  <button type="button" onClick={quitarFiltroIndex} aria-label={`Quitar filtro ${preset.titulo}`}>
                    ×
                  </button>
                </span>
              </div>
            )}
            <p className="ess__count">
              {resultados.length} {resultados.length === 1 ? "esencia" : "esencias"}
            </p>

            {resultados.length === 0 ? (
              <div className="ess__vacio">
                <p>Ninguna esencia coincide con esos filtros.</p>
                <button type="button" className="btn btn--sm" onClick={limpiar}>
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="ess__grid">
                {resultados.map((e) => {
                  const sel = seleccion === e.id;
                  return (
                    <article key={e.id} id={`esencia-${e.id}`} className={`ess-card ${sel ? "ess-card--sel" : ""}`}>
                      <button
                        type="button"
                        className="ess-card__main"
                        aria-pressed={sel}
                        onClick={() => setSeleccion(sel ? null : e.id)}
                      >
                        <span className="ess-card__img">
                          <img src={e.img} alt="" />
                        </span>
                        <h3>{e.nombre}</h3>
                        <span className="ess-card__meta">
                          {e.genero} · {e.acordes.join(" · ")}
                        </span>
                        <span className="ess-card__precio">Desde {fmt(precioDesde(e))}</span>
                      </button>
                      {sel && (
                        <div className="ess-card__act">
                          <Link to={`/esencias/${e.id}/ordenar`} className="btn btn--sm">
                            Ordenar
                          </Link>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
