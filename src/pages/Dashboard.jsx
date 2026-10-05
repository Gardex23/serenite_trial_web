import { useMemo } from "react";
import { Header } from "../components/Header";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

const COLORES = ["#c9a227", "#e6cf7a", "#1b2a5a", "#2a3a78", "#5b2a9e", "#3c4f9a", "#8b7d5c", "#a89460"];

const fmtCOP = (n) => `COP ${n.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PRECIO_ML = 500;

const PERFUMES_MOCK = [
  { id: "1", nombre: "Esencia Aurora", genero: "Dama", precioMl: PRECIO_ML },
  { id: "2", nombre: "Esencia Nocturno", genero: "Caballero", precioMl: PRECIO_ML },
  { id: "3", nombre: "Esencia Ámbar", genero: "Unisex", precioMl: PRECIO_ML },
  { id: "4", nombre: "Esencia Lavanda Real", genero: "Dama", precioMl: PRECIO_ML },
  { id: "5", nombre: "Esencia Brisa", genero: "Unisex", precioMl: PRECIO_ML },
  { id: "6", nombre: "Esencia Medianoche", genero: "Caballero", precioMl: PRECIO_ML },
  { id: "7", nombre: "Esencia Pétalo", genero: "Dama", precioMl: PRECIO_ML },
  { id: "8", nombre: "Esencia Sol", genero: "Unisex", precioMl: PRECIO_ML },
];

const VENTAS_DIARIAS_MOCK = [
  { dia: "Lun", ventas: 12, ingresos: 12 * 100 * PRECIO_ML },
  { dia: "Mar", ventas: 19, ingresos: 19 * 100 * PRECIO_ML },
  { dia: "Mié", ventas: 8, ingresos: 8 * 100 * PRECIO_ML },
  { dia: "Jue", ventas: 24, ingresos: 24 * 100 * PRECIO_ML },
  { dia: "Vie", ventas: 31, ingresos: 31 * 100 * PRECIO_ML },
  { dia: "Sáb", ventas: 27, ingresos: 27 * 100 * PRECIO_ML },
  { dia: "Dom", ventas: 15, ingresos: 15 * 100 * PRECIO_ML },
];

const VENTAS_SEMANALES_MOCK = [
  { semana: "Sem 1", ventas: 89, ingresos: 89 * 100 * PRECIO_ML },
  { semana: "Sem 2", ventas: 112, ingresos: 112 * 100 * PRECIO_ML },
  { semana: "Sem 3", ventas: 95, ingresos: 95 * 100 * PRECIO_ML },
  { semana: "Sem 4", ventas: 128, ingresos: 128 * 100 * PRECIO_ML },
];

const PERFUMES_VENDIDOS_MOCK = [
  { nombre: "Esencia Aurora", cantidad: 142, ingresos: 142 * 100 * PRECIO_ML },
  { nombre: "Esencia Nocturno", cantidad: 98, ingresos: 98 * 100 * PRECIO_ML },
  { nombre: "Esencia Ámbar", cantidad: 87, ingresos: 87 * 100 * PRECIO_ML },
  { nombre: "Esencia Lavanda Real", cantidad: 76, ingresos: 76 * 100 * PRECIO_ML },
  { nombre: "Esencia Brisa", cantidad: 65, ingresos: 65 * 100 * PRECIO_ML },
  { nombre: "Esencia Medianoche", cantidad: 54, ingresos: 54 * 100 * PRECIO_ML },
  { nombre: "Esencia Pétalo", cantidad: 43, ingresos: 43 * 100 * PRECIO_ML },
  { nombre: "Esencia Sol", cantidad: 38, ingresos: 38 * 100 * PRECIO_ML },
];

const FRASCOS_STOCK_MOCK = [
  { codigo: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", color: "Dorado", stock_minimo: 10, cantidad: 45, ml: 100 },
  { codigo: "b2c3d4e5-f6a7-8901-bcde-f12345678901", color: "Plateado", stock_minimo: 8, cantidad: 32, ml: 100 },
  { codigo: "c3d4e5f6-a7b8-9012-cdef-123456789012", color: "Negro Mate", stock_minimo: 12, cantidad: 18, ml: 100 },
  { codigo: "d4e5f6a7-b8c9-0123-defa-234567890123", color: "Rosa", stock_minimo: 15, cantidad: 8, ml: 50 },
  { codigo: "e5f6a7b8-c9d0-1234-efab-345678901234", color: "Azul Profundo", stock_minimo: 10, cantidad: 28, ml: 100 },
  { codigo: "f6a7b8c9-d0e1-2345-fabc-456789012345", color: "Verde Esmeralda", stock_minimo: 5, cantidad: 42, ml: 50 },
  { codigo: "a7b8c9d0-e1f2-3456-abcd-567890123456", color: "Rojo Rubí", stock_minimo: 8, cantidad: 15, ml: 100 },
  { codigo: "b8c9d0e1-f2a3-4567-bcde-678901234567", color: "Blanco Perlado", stock_minimo: 12, cantidad: 22, ml: 50 },
];

function KPICard({ titulo, valor, sub, icono }) {
  return (
    <div className="dashboard-card kpi-card">
      <div className="kpi-icon">{icono}</div>
      <div className="kpi-content">
        <p className="kpi-title">{titulo}</p>
        <p className="kpi-value">{valor}</p>
        <p className="kpi-sub">{sub}</p>
      </div>
    </div>
  );
}

function ChartCard({ titulo, children }) {
  return (
    <div className="dashboard-card chart-card">
      <h3 className="chart-title">{titulo}</h3>
      <div className="chart-container">{children}</div>
    </div>
  );
}

function StatTable({ titulo, headers, rows }) {
  return (
    <div className="dashboard-card table-card">
      <h3 className="chart-title">{titulo}</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>{row.map((cell, cellIdx) => <td key={cellIdx}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StockTable() {
  const rows = useMemo(() => FRASCOS_STOCK_MOCK.map(f => [
    f.codigo.slice(0, 8) + "...",
    f.color,
    f.stock_minimo,
    f.cantidad,
    `${f.ml}ml`,
    f.cantidad <= f.stock_minimo ? "⚠️ Bajo" : "✓ OK"
  ]), []);

  const headers = ["Código", "Color", "Stock Mín.", "Cantidad", "ML", "Estado"];

  return (
    <div className="dashboard-card table-card stock-table-card">
      <h3 className="chart-title">Stock de Frascos</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={row[5].includes("Bajo") ? "stock-bajo" : ""}>
                {row.map((cell, cellIdx) => <td key={cellIdx}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const totalVentasSemana = VENTAS_SEMANALES_MOCK.reduce((a, b) => a + b.ventas, 0);
  const totalIngresosSemana = VENTAS_SEMANALES_MOCK.reduce((a, b) => a + b.ingresos, 0);
  const promedioSemanal = Math.round(totalIngresosSemana / VENTAS_SEMANALES_MOCK.length);
  const promedioMensual = promedioSemanal * 4.33;
  const totalPerfumesVendidos = PERFUMES_VENDIDOS_MOCK.reduce((a, b) => a + b.cantidad, 0);
  const totalIngresos = PERFUMES_VENDIDOS_MOCK.reduce((a, b) => a + b.ingresos, 0);
  const stockBajo = FRASCOS_STOCK_MOCK.filter(f => f.cantidad <= f.stock_minimo).length;

  const topPerfume = PERFUMES_VENDIDOS_MOCK[0];

  const datosPastel = PERFUMES_VENDIDOS_MOCK.slice(0, 6).map((p, idx) => ({
    name: p.nombre,
    value: p.cantidad,
    fill: COLORES[idx]
  }));

  const datosBarrasTop = PERFUMES_VENDIDOS_MOCK.slice(0, 5).map((p, idx) => ({
    nombre: p.nombre,
    cantidad: p.cantidad,
    fill: COLORES[idx]
  }));

  return (
    <>
      <Header scrolled />
      <main className="dashboard-main">

        <section className="dashboard-grid kpi-grid">
          <KPICard titulo="Ventas esta semana" valor={totalVentasSemana} sub="Unidades vendidas" icono="📦" />
          <KPICard titulo="Ingresos semanales" valor={fmtCOP(totalIngresosSemana)} sub="Total facturado" icono="💰" />
          <KPICard titulo="Promedio/semana" valor={fmtCOP(promedioSemanal)} sub="Ingresos promedio" icono="📊" />
          <KPICard titulo="Promedio/mes" valor={fmtCOP(Math.round(promedioMensual))} sub="Proyección mensual" icono="📈" />
          <KPICard titulo="Total perfumes" valor={totalPerfumesVendidos} sub="Unidades históricas" icono="🌸" />
          <KPICard titulo="Ingresos totales" valor={fmtCOP(totalIngresos)} sub="Acumulado histórico" icono="💎" />
          <KPICard titulo="Top perfume" valor={topPerfume.nombre} sub={`${topPerfume.cantidad} vendidas`} icono="🏆" />
          <KPICard titulo="Stock bajo" valor={stockBajo} sub={stockBajo > 0 ? "Requieren reposición" : "Todo en orden"} icono="📋" />
        </section>

        <section className="dashboard-grid charts-grid">
          <ChartCard titulo="Perfumes más vendidos (Top 5)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosBarrasTop} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d6" />
                <XAxis type="number" tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="nombre" tick={{ fill: "#141a33", fontSize: 13, fontFamily: "var(--sans)" }} axisLine={false} tickLine={false} width={140} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e6e2d6", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,.1)" }}
                  formatter={(v) => [v, "Unidades"]}
                />
                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                  {datosBarrasTop.map((_, idx) => <Cell key={idx} fill={COLORES[idx]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard titulo="Distribución de ventas (Top 6)">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosPastel}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {datosPastel.map((_, idx) => <Cell key={idx} fill={COLORES[idx]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e6e2d6", borderRadius: 10 }}
                  formatter={(v) => [v, "Unidades"]}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard titulo="Ventas por día (semana actual)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={VENTAS_DIARIAS_MOCK} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a227" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a227" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d6" />
                <XAxis dataKey="dia" tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e6e2d6", borderRadius: 10 }}
                  formatter={(v) => [v, "Unidades"]}
                />
                <Area type="monotone" dataKey="ventas" stroke="#c9a227" strokeWidth={2} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard titulo="Ingresos por día (semana actual)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={VENTAS_DIARIAS_MOCK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d6" />
                <XAxis dataKey="dia" tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => fmtCOP(v)} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e6e2d6", borderRadius: 10 }}
                  formatter={(v) => [fmtCOP(v), "Ingresos"]}
                />
                <Bar dataKey="ingresos" fill="#1b2a5a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard titulo="Ventas por semana (últimas 4)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={VENTAS_SEMANALES_MOCK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d6" />
                <XAxis dataKey="semana" tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e6e2d6", borderRadius: 10 }}
                  formatter={(v) => [v, "Unidades"]}
                  />
                <Line type="monotone" dataKey="ventas" stroke="#c9a227" strokeWidth={3} dot={{ r: 6, fill: "#c9a227", strokeWidth: 2 }} activeDot={{ r: 8, fill: "#fff", stroke: "#c9a227", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard titulo="Ingresos por semana (últimas 4)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={VENTAS_SEMANALES_MOCK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2d6" />
                <XAxis dataKey="semana" tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6a6f8c", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => fmtCOP(v)} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e6e2d6", borderRadius: 10 }}
                  formatter={(v) => [fmtCOP(v), "Ingresos"]}
                  />
                <Bar dataKey="ingresos" fill="#2a3a78" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="dashboard-grid stats-grid">
          <StatTable
            titulo="Estadísticas de perfumes más vendidos"
            headers={["Perfume", "Género", "Unidades", "Ingresos", "Precio unit. (100ml)", "% Total"]}
            rows={PERFUMES_VENDIDOS_MOCK.map(p => [
              p.nombre,
              PERFUMES_MOCK.find(x => x.nombre === p.nombre)?.genero || "-",
              p.cantidad.toLocaleString(),
              fmtCOP(p.ingresos),
              fmtCOP(PERFUMES_MOCK.find(x => x.nombre === p.nombre)?.precioMl * 100 || 0),
              `${((p.cantidad / totalPerfumesVendidos) * 100).toFixed(1)}%`
            ])}
          />

          <StockTable />
        </section>
      </main>
    </>
  );
}