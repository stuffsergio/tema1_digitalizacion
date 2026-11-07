import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProgreso } from "../context/Progreso.jsx";

const fecha = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

export function Perfil() {
  const { usuario, cargando, intentos, leidos, mejores, hechos, actualizarPerfil, salir } = useProgreso();
  const navigate = useNavigate();
  const [alias, setAlias] = useState("");
  const [enRanking, setEnRanking] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = "Perfil · Digitalización";
  }, []);

  useEffect(() => {
    if (!cargando && !usuario) navigate("/entrar?siguiente=/perfil", { replace: true });
  }, [cargando, usuario, navigate]);

  useEffect(() => {
    if (!usuario) return;
    setAlias(usuario.alias);
    setEnRanking(usuario.enRanking);
  }, [usuario]);

  if (cargando || !usuario) return <p className="wrap py-16">Cargando.</p>;

  const recientes = [...intentos].reverse();

  async function guardar(event) {
    event.preventDefault();
    setError("");
    setAviso("");
    setEnviando(true);
    try {
      await actualizarPerfil({ alias, enRanking });
      setAviso("Perfil guardado.");
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  async function cerrar() {
    await salir();
    navigate("/", { replace: true });
  }

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">Cuenta</p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5vw,3.6rem)]">{usuario.nombre}</h1>
      <p className="mt-4 text-[1.05rem] tabular-nums">
        {hechos}
        <span className="text-ink/60">/10 hitos</span>
        <span className="text-ink/60"> · {leidos.length}/6 lecciones</span>
      </p>
      <ol className="mt-6 grid max-w-xl gap-px border border-line bg-line sm:grid-cols-4">
        {[1, 2, 3, 4].map((nivel) => {
          const nota = mejores[nivel];
          const superado = Number(nota ?? 0) >= 7;
          return (
            <li key={nivel} className="bg-paper p-3">
              <span className="bg-mark px-1.5 py-0.5 text-[0.85rem] tabular-nums">
                {String(nivel).padStart(2, "0")}
              </span>
              <p className="mt-2 text-[0.95rem] tabular-nums">
                {nota == null ? "Sin nota" : `${nota}/10`}
              </p>
              <p className="text-[0.85rem] text-ink/60">{superado ? "Superado" : "Pendiente"}</p>
            </li>
          );
        })}
      </ol>

      <form className="mt-10 grid max-w-md gap-4" onSubmit={guardar}>
        <h2 className="text-[1.35rem]">Datos visibles</h2>
        <p className="text-[0.95rem] leading-relaxed text-ink/70">
          El email no se publica. {usuario.email}
        </p>
        <label className="grid gap-1 text-[0.95rem]">
          Alias
          <input className="campo" required minLength={2} maxLength={24} value={alias} onChange={(event) => setAlias(event.target.value)} />
        </label>
        <label className="flex items-start gap-3 text-[0.95rem] leading-snug">
          <input
            className="mt-1 size-4 accent-ink"
            type="checkbox"
            checked={enRanking}
            onChange={(event) => setEnRanking(event.target.checked)}
          />
          Aparecer en el ranking de la clase.
        </label>
        {error ? <p className="text-[0.95rem] text-mal">{error}</p> : null}
        {aviso ? <p className="text-[0.95rem]">{aviso}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="btn w-full sm:w-auto" type="submit" disabled={enviando}>
            Guardar el perfil
          </button>
          <button className="btn btn-ghost w-full sm:w-auto" type="button" onClick={cerrar}>
            Cerrar la sesión
          </button>
        </div>
      </form>

      <section className="mt-12" aria-labelledby="intentos">
        <h2 id="intentos" className="text-[1.35rem]">
          Intentos del cuestionario
        </h2>
        <p className="mt-2 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink/70">
          El primer intento de cada nivel es el que entra en el ranking. Los siguientes sirven para
          mejorar tu nota y desbloquear, y no cambian ese puesto.
        </p>
        {recientes.length === 0 ? (
          <p className="mt-4">
            Todavía no hay intentos.{" "}
            <Link className="underline decoration-mark decoration-2 underline-offset-[0.22em]" to="/cuestionario">
              Abrir el cuestionario
            </Link>
          </p>
        ) : (
          <ul className="mt-4 grid max-w-2xl gap-2">
            {recientes.map((intento) => (
              <li key={intento.id} className="grid gap-1 border border-line px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <span className="tabular-nums">Nivel {intento.nivel}</span>
                <span className="tabular-nums">
                  {intento.aciertos}/10
                  {intento.esPrimero ? <span className="ml-2 bg-mark px-1.5 py-0.5">Primer intento</span> : null}
                </span>
                <span className="text-[0.85rem] text-ink/60">{fecha.format(new Date(intento.creado))}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
