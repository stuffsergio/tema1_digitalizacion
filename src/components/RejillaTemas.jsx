import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { tituloCorto } from "../data/temas.js";

const contenedor = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const tarjeta = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
  },
};

export function RejillaTemas({ temas, leidos }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={contenedor}
      initial={reduce ? false : "hidden"}
      animate="visible"
    >
      {temas.map((tema) => {
        const Icono = tema.Icono;
        const leida = leidos.includes(tema.id);
        return (
          <motion.div key={tema.id} variants={reduce ? undefined : tarjeta} className="h-full">
            <Link
              to={`/tema/${tema.id}`}
              className={`tema-card${leida ? " tema-card-leida" : ""}`}
            >
              <span className="flex items-start justify-between gap-4">
                <span className="bg-mark px-1.5 py-0.5 text-[0.95rem] tabular-nums">
                  {String(tema.id).padStart(2, "0")}
                </span>
                <Icono aria-hidden="true" size={18} strokeWidth={1.5} />
              </span>
              <span className="text-[1.2rem] leading-snug tracking-[-0.02em]">
                {tituloCorto(tema.titulo)}
              </span>
              <span className="max-w-[36ch] text-[0.95rem] leading-relaxed text-ink/75">
                {tema.resumen}
              </span>
              <span className="mt-auto flex items-center justify-between pt-3 text-[0.92rem]">
                <span className="underline decoration-mark decoration-2 underline-offset-[0.22em]">
                  Explorar tema
                </span>
                {leida ? <span className="text-ink/60">Leída</span> : <span className="marca" />}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
