import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Header } from '../components/Header';

const FRASCOS = [
  { id: "unisex", img: "/img/frasco-unisex.png", sf: "/img/frasco-unisex-sf.png", label: "Unisex", tint: "#c9a227" },
  { id: "mujer", img: "/img/frasco-mujer.png", sf: "/img/frasco-mujer-sf.png", label: "Dama", tint: "#5b2a9e" },
  { id: "hombre", img: "/img/frasco-hombre.png", sf: "/img/frasco-hombre-sf.png", label: "Caballero", tint: "#1b2a5a" },
];

const MAS_VENDIDAS = [
  { id: 1, nombre: "Esencia Aurora", genero: "Dama", acordes: "Floral · Vainilla", img: FRASCOS[1].img },
  { id: 2, nombre: "Esencia Nocturno", genero: "Caballero", acordes: "Amaderado · Cuero", img: FRASCOS[2].img },
  { id: 3, nombre: "Esencia Ámbar", genero: "Unisex", acordes: "Ámbar · Cítrico", img: FRASCOS[0].img },
  { id: 4, nombre: "Esencia Lavanda Real", genero: "Dama", acordes: "Lavanda · Almizcle", img: FRASCOS[1].img },
];
const PARA_EL_CLIMA = [
  { id: 5, nombre: "Esencia Brisa", genero: "Unisex", acordes: "Cítrico · Marino", img: FRASCOS[0].img },
  { id: 6, nombre: "Esencia Medianoche", genero: "Caballero", acordes: "Especiado · Oud", img: FRASCOS[2].img },
  { id: 7, nombre: "Esencia Pétalo", genero: "Dama", acordes: "Floral · Frutal", img: FRASCOS[1].img },
  { id: 8, nombre: "Esencia Sol", genero: "Unisex", acordes: "Tropical · Coco", img: FRASCOS[0].img },
];

// Fade + deslizamiento rápido al entrar en pantalla
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setVis(true), io.disconnect()), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${vis ? "reveal--in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % FRASCOS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const f = FRASCOS[i];

  return (
    <section className="hero" style={{ "--tint": f.tint }}>
      <div className="hero__glow" />
      <div className="hero__text">
        <p className="eyebrow">Perfumería de autor</p>
        <h1>La esencia<br />de la <em>serenidad</em></h1>
        <p className="hero__sub">Elige tu esencia, tu frasco y tu medida. Nosotros la hacemos tuya.</p>
        <Link className="btn" to="/esencias">Descubrir esencias</Link>
      </div>

      <div className="hero__stage">
        {FRASCOS.map((x, k) => (
          <img key={x.id} src={x.sf} alt={`Frasco ${x.label}`}
               className={`hero__bottle ${k === i ? "is-active" : ""}`} />
        ))}
        
      </div>
    </section>
  );
}

function Section({ titulo, sub, items, filtro }) {
  return (
    <section className="section">
      <Reveal className="section__head">
        <h2>{titulo}</h2>
        <p>{sub}</p>
      </Reveal>
      <div className="grid">
        {items.map((e, k) => (
          <Reveal key={e.id} delay={k * 120}>
          <Link to={`/esencias?esencia=${e.id}`} className="card">
            <div className="card__img"><img src={e.img} alt={e.nombre} /></div>
            <h3>{e.nombre}</h3>
            <span>{e.genero} · {e.acordes}</span>
          </Link>
          </Reveal>
        ))}
      </div>
      <Link className="link" to={`/esencias?filtro=${filtro}`}>Ver todas →</Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <img src="/img/logo-blanco.png" alt="Serenithé" />
      <div>
        <h4>Contacto</h4>
        <p>contacto@serenithe.com</p>
        <p>+58 000 000 0000</p>
      </div>
      <div>
        <h4>Síguenos</h4>
        <p><Link to="#">Instagram</Link> · <Link to="#">TikTok</Link> · <Link to="#">WhatsApp</Link></p>
      </div>
      <small>© {new Date().getFullYear()} Serenithé. Todos los derechos reservados.</small>
    </footer>
  );
}

export default function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <Header scrolled={scrolled} />
      <main>
        <Hero />
        <Section titulo="Las más vendidas" sub="Las favoritas de nuestros clientes" items={MAS_VENDIDAS} filtro="mas-vendidas" />
        <Section titulo="Ideales para hoy" sub="Esencias que van con el clima de estos días" items={PARA_EL_CLIMA} filtro="clima" />
      </main>
      <Footer />
    </>
  );
}
