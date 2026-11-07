import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";
import { useProgreso } from "../context/Progreso.jsx";

export function Ranking() {
  const { usuario } = useProgreso();
  const [filas, setFilas] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Ranking · Digitalización";
  }, []);

  useEffect(() => {
    let vivo = true;
    api
      .ranking()
      .then((datos) => {
        if (vivo) setFilas(datos.filas);
      })
      .catch((fallo) => {
        if (vivo) setError(fallo.message);
      });
    return () => {
      vivo = false;
    };
  }, [usuario]);

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">Clase</p>
      <h1 className="mt-3 max-w-[14ch] text-[clamp(2.2rem,5vw,3.6rem)]">Ranking</h1>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">
        Se ordena por la suma de los primeros intentos de los cuatro niveles, sobre 40. Quien
        empata y ha necesitado menos intentos queda por encima. Las repeticiones mejoran la nota
        del perfil y no mueven esta lista.
      </p>
      {error ? <p className="mt-6 text-mal">{error}</p> : null}
      {filas === null && !error ? <p className="mt-8">Cargando.</p> : null}
      {filas && filas.length === 0 ? (
        <p className="mt-8 max-w-[52ch]">
          Todavía no hay nadie en la lista.{" "}
          <Link className="underline decoration-mark decoration-2 underline-offset-[0.22em]" to="/registro">
            Crear una cuenta
          </Link>
        </p>
      ) : null}
      {filas && filas.length > 0 ? (
        <ol className="mt-8 border-t border-line">
          {filas.map((fila) => (
            <li
              key={fila.puesto}
              className="grid items-center gap-4 border-b border-line py-5 sm:grid-cols-[auto_minmax(0,1fr)]"
            >
              <span className="bg-mark px-1.5 py-0.5 text-[0.95rem] tabular-nums">
                {String(fila.puesto).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-[1.15rem]">
                  {fila.alias}
                  {fila.mio ? <span className="ml-2 text-[0.85rem] text-ink/60">Tú</span> : null}
                </h2>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/70 tabular-nums">
                  {fila.primerIntento}/40 en el primer intento · {fila.nivelesSuperados}/4 niveles ·{" "}
                  {fila.lecciones}/6 lecciones
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
