import { BookOpen, ChartColumn, ListChecks, LogIn, Menu, UserPlus, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useProgreso } from "../context/Progreso.jsx";

const secciones = [
  { to: "/", nombre: "Temario", end: true, Icono: BookOpen },
  { to: "/cuestionario", nombre: "Cuestionario", end: false, Icono: ListChecks },
  { to: "/ranking", nombre: "Ranking", end: false, Icono: ChartColumn },
];

const trazo = { size: 18, strokeWidth: 1.75, "aria-hidden": true };

function Enlace({ to, end, nombre, Icono }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `menu-link${isActive ? " menu-link-activo" : ""}`}
    >
      <Icono {...trazo} />
      {nombre}
    </NavLink>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const { hechos, usuario } = useProgreso();
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return undefined;
    function cerrar(event) {
      if (event.key === "Escape") setAbierto(false);
    }
    document.addEventListener("keydown", cerrar);
    return () => document.removeEventListener("keydown", cerrar);
  }, [abierto]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-paper pt-[env(safe-area-inset-top)]">
        <div className="wrap flex items-center gap-3 py-2">
          <NavLink to="/" className="mr-auto min-w-0 leading-tight">
            <span className="block truncate text-[0.98rem] tracking-[-0.02em]">Digitalización</span>
            <span className="block text-[0.68rem] tracking-[0.14em] text-ink/60 uppercase">
              1.º DAW
              <span className="sr-only">. Progreso del tema, {hechos} de 10 hitos.</span>
              <span aria-hidden="true"> · {hechos}/10</span>
            </span>
          </NavLink>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Secciones">
            {secciones.map((seccion) => (
              <Enlace key={seccion.to} {...seccion} />
            ))}
          </nav>
          <div className="ml-4 hidden items-center gap-2 lg:flex">
            {usuario ? (
              <NavLink className="menu-link max-w-[11rem]" to="/perfil">
                <UserRound {...trazo} />
                <span className="truncate">{usuario.alias}</span>
              </NavLink>
            ) : (
              <>
                <NavLink className="menu-link" to="/entrar">
                  <LogIn {...trazo} />
                  Entrar
                </NavLink>
                <NavLink className="btn px-3" to="/registro">
                  <UserPlus {...trazo} />
                  Crear cuenta
                </NavLink>
              </>
            )}
          </div>
          <button
            className="icono-btn lg:hidden"
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            onClick={() => setAbierto((valor) => !valor)}
          >
            {abierto ? <X {...trazo} /> : <Menu {...trazo} />}
            <span className="sr-only">{abierto ? "Cerrar el menú" : "Abrir el menú"}</span>
          </button>
        </div>
        {abierto ? (
          <nav className="menu-panel wrap lg:hidden" id="menu-movil" aria-label="Menú">
            {usuario ? (
              <NavLink className="menu-link" to="/perfil">
                <UserRound {...trazo} />
                <span className="truncate">{usuario.alias}</span>
              </NavLink>
            ) : (
              <div className="grid gap-2 pb-2">
                <NavLink className="btn" to="/registro">
                  <UserPlus {...trazo} />
                  Crear cuenta
                </NavLink>
                <NavLink className="btn btn-ghost" to="/entrar">
                  <LogIn {...trazo} />
                  Entrar
                </NavLink>
                <p className="pista">La cuenta guarda el progreso y el puesto en el ranking.</p>
              </div>
            )}
            {secciones.map((seccion) => (
              <Enlace key={seccion.to} {...seccion} />
            ))}
          </nav>
        ) : null}
      </header>
      <main id="contenido" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="wrap flex flex-col gap-2 py-6 text-[0.9rem] leading-relaxed text-ink/70 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[62ch]">
            Digitalización, 1.º de DAW. Resúmenes del Tema 1 a partir de la serie How Computers
            Work, de Code.org.
          </p>
          <p>Material de estudio.</p>
        </div>
      </footer>
    </div>
  );
}
