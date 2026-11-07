import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Barra } from "../components/Barra.jsx";
import { RejillaTemas } from "../components/RejillaTemas.jsx";
import { useProgreso } from "../context/Progreso.jsx";
import { temas } from "../data/temas.js";

const funciones = [
  ["01", "Entrada", "Teclado, cámara, micrófono o un sensor. Recogen información del mundo."],
  ["02", "Almacenamiento", "La memoria guarda esos datos y también las instrucciones."],
  ["03", "Procesamiento", "La CPU aplica un algoritmo y devuelve el resultado a la memoria."],
  ["04", "Salida", "Pantalla, altavoz, un motor, o la entrada de otra computadora."],
];

export function Inicio() {
  const reduce = useReducedMotion();
  const { usuario, leidos, hechos, mejores, desbloqueado } = useProgreso();
  const pendiente = [1, 2, 3, 4].find(
    (nivel) => desbloqueado(nivel) && Number(mejores[nivel] ?? 0) < 7,
  );

  useEffect(() => {
    document.title = "Digitalización · Tema 1 · 1.º DAW";
  }, []);

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">
        1.º DAW · Digitalización · Tema 1
      </p>
      <h1 className="mt-4 max-w-[14ch] text-[clamp(2.55rem,6vw,4.6rem)]">
        Cómo funcionan los ordenadores
      </h1>
      <p className="mt-5 max-w-[62ch] text-[1.08rem] leading-relaxed">
        Seis lecciones para seguir el camino de un dato: entra, se guarda, se transforma y sale.
        Del bit al sistema operativo, con el mismo esquema en un móvil que en una máquina del
        tamaño de una habitación.
      </p>
      <p className="mt-4 text-[0.95rem] tabular-nums">
        6 lecciones · 40 preguntas · nota de corte 7/10
      </p>
      <div className="mt-6 max-w-md">
        <Barra valor={hechos} total={10} etiqueta="Progreso del tema" />
        <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/60">
          {usuario
            ? `Cada lección leída y cada nivel aprobado suma un hito. Estás en la cuenta de ${usuario.alias}.`
            : "Las lecciones se pueden leer sin cuenta. Para guardar el progreso y entrar en el ranking, crea una cuenta o inicia sesión."}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a className="btn w-full sm:w-auto" href="#lecciones">
          Ver las lecciones
        </a>
        <Link className="btn btn-ghost w-full sm:w-auto" to="/cuestionario">
          Abrir el cuestionario
        </Link>
      </div>

      <section className="mt-16" aria-labelledby="funciones">
        <h2 id="funciones" className="text-[1.45rem]">
          Las cuatro funciones
        </h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Cualquier computadora, mecánica o actual, hace estas cuatro tareas. El resto del tema
          explica cómo.
        </p>
        <ol className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {funciones.map(([numero, titulo, texto]) => (
            <li key={numero} className="bg-paper p-4 sm:p-5">
              <span className="bg-mark px-1.5 py-0.5 text-[0.85rem] tabular-nums">{numero}</span>
              <h3 className="mt-3 text-[1.12rem]">{titulo}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">{texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="lecciones" className="mt-16 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-[1.45rem]">Las seis lecciones</h2>
          <p className="text-[0.92rem] tabular-nums text-ink/60">
            {leidos.length}
            <span className="text-ink/60">/6 leídas</span>
          </p>
        </div>
        <div className="mt-6">
          <RejillaTemas temas={temas} leidos={leidos} />
        </div>
        <motion.aside
          className="mt-4 border border-ink bg-ink px-5 py-6 text-paper sm:px-8 sm:py-8"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.28, delay: reduce ? 0 : 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-[0.72rem] tracking-[0.16em] text-paper/70 uppercase">Cuestionario</p>
          <h2 className="mt-3 max-w-[18ch] text-[clamp(1.7rem,3vw,2.4rem)] text-paper">
            Cuatro niveles. El siguiente se abre con 7 de 10.
          </h2>
          <p className="mt-3 max-w-[58ch] leading-relaxed text-paper/80">
            {pendiente
              ? `Ahora mismo puedes hacer el nivel ${pendiente}. Cada respuesta trae la explicación del vídeo.`
              : "Los cuatro niveles están superados. Puedes repetir cualquiera para afianzar."}
          </p>
          <Link className="btn btn-claro mt-6 w-full sm:w-auto" to="/cuestionario">
            {pendiente ? `Entrar al nivel ${pendiente}` : "Revisar el cuestionario"}
          </Link>
        </motion.aside>
      </section>
    </div>
  );
}
