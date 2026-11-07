import { lazy, Suspense } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { ProgresoProvider } from "./context/Progreso.jsx";

const Inicio = lazy(() => import("./pages/Inicio.jsx").then((m) => ({ default: m.Inicio })));
const Tema = lazy(() => import("./pages/Tema.jsx").then((m) => ({ default: m.Tema })));
const Cuestionario = lazy(() =>
  import("./pages/Cuestionario.jsx").then((m) => ({ default: m.Cuestionario })),
);
const Entrar = lazy(() => import("./pages/Entrar.jsx").then((m) => ({ default: m.Entrar })));
const Registro = lazy(() => import("./pages/Registro.jsx").then((m) => ({ default: m.Registro })));
const Perfil = lazy(() => import("./pages/Perfil.jsx").then((m) => ({ default: m.Perfil })));
const Ranking = lazy(() => import("./pages/Ranking.jsx").then((m) => ({ default: m.Ranking })));

function Espera() {
  return <p className="wrap py-16">Cargando.</p>;
}

function NoEncontrada() {
  return (
    <div className="wrap py-16">
      <p className="text-[0.72rem] tracking-[0.16em] uppercase">404</p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2rem,4vw,3.2rem)]">
        Esa página no está en el temario.
      </h1>
      <Link className="btn mt-8" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <ProgresoProvider>
      <BrowserRouter>
        <Suspense fallback={<Espera />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/tema/:id" element={<Tema />} />
            <Route path="/cuestionario" element={<Cuestionario />} />
            <Route path="/entrar" element={<Entrar />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
    </ProgresoProvider>
  );
}
