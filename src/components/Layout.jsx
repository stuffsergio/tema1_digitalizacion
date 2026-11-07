import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useProgreso } from "../context/Progreso.jsx";

export function Layout() {
  const { pathname } = useLocation();
  const { hechos, usuario } = useProgreso();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-paper pt-[env(safe-area-inset-top)]">
        <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <NavLink to="/" className="mr-auto leading-tight">
            <span className="block text-[0.98rem] tracking-[-0.02em]">Digitalización</span>
            <span className="block text-[0.68rem] tracking-[0.16em] text-ink/60 uppercase">
              1.º DAW
            </span>
          </NavLink>
          <nav className="flex items-center gap-5 text-[0.95rem]" aria-label="Secciones">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link${isActive ? " nav-link-activo" : ""}`}
            >
              Temario
            </NavLink>
            <NavLink
              to="/cuestionario"
              className={({ isActive }) => `nav-link${isActive ? " nav-link-activo" : ""}`}
            >
              Cuestionario
            </NavLink>
            <NavLink
              to="/ranking"
              className={({ isActive }) => `nav-link${isActive ? " nav-link-activo" : ""}`}
            >
              Ranking
            </NavLink>
            <NavLink
              to={usuario ? "/perfil" : "/entrar"}
              className={({ isActive }) => `nav-link${isActive ? " nav-link-activo" : ""}`}
            >
              {usuario ? usuario.alias : "Entrar"}
            </NavLink>
          </nav>
          <p className="text-[0.95rem] tabular-nums" title="6 lecciones leídas y 4 niveles aprobados">
            <span className="sr-only">Progreso del tema, {hechos} de 10 hitos. </span>
            {hechos}
            <span className="text-ink/60">/10</span>
          </p>
        </div>
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
