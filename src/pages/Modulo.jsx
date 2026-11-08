import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Barra } from "../components/Barra.jsx";
import { RejillaTemas } from "../components/RejillaTemas.jsx";
import { useProgreso } from "../context/Progreso.jsx";
import { temasDe } from "../data/temas.js";

const fichas = {
  1: {
    kicker: "Parte 1 · Vídeos 1 a 6",
    titulo: "Cómo funcionan los ordenadores",
    texto:
      "Seis lecciones para seguir el camino de un dato: entra, se guarda, se transforma y sale. Del bit al sistema operativo.",
    bloques: [
      ["01", "Entrada", "Teclado, cámara, micrófono o un sensor. Recogen información del mundo."],
      ["02", "Almacenamiento", "La memoria guarda esos datos y también las instrucciones."],
      ["03", "Procesamiento", "La CPU aplica un algoritmo y devuelve el resultado a la memoria."],
      ["04", "Salida", "Pantalla, altavoz, un motor, o la entrada de otra computadora."],
    ],
    tituloBloques: "Las cuatro funciones",
    textoBloques: "Cualquier computadora, mecánica o actual, hace estas cuatro tareas.",
  },
  2: {
    kicker: "Parte 2 · Vídeos 7 a 14",
    titulo: "Redes e Internet",
    texto:
      "Ocho lecciones para seguir un mensaje desde el cable hasta el buscador: direcciones, paquetes, la web, el cifrado y la búsqueda.",
    bloques: [
      ["01", "Cables", "Cobre, fibra y Wi-Fi. Los bits viajan como electricidad, luz o radio."],
      ["02", "Direcciones", "La IP localiza una máquina. El DNS traduce el nombre."],
      ["03", "Paquetes", "El mensaje se parte. TCP pide de nuevo lo que no llega."],
      ["04", "La web", "HTTP pide la página. HTTPS y las llaves la protegen."],
    ],
    tituloBloques: "El camino de un mensaje",
    textoBloques: "De la señal física a la página que acaba en el navegador.",
  },
};

export function Modulo() {
  const { pathname } = useLocation();
  const parte = pathname.startsWith("/tema2") ? 2 : 1;
  const ficha = fichas[parte];
  const lista = temasDe(parte);
  const desplazamiento = parte === 2 ? 4 : 0;
  const reduce = useReducedMotion();
  const { usuario, leidos, mejores, desbloqueado } = useProgreso();
  const lecciones = lista.filter((tema) => leidos.includes(tema.id)).length;
  const nivelesHechos = [1, 2, 3, 4].filter(
    (nivel) => Number(mejores[nivel + desplazamiento] ?? 0) >= 7,
  ).length;
  const hechos = lecciones + nivelesHechos;
  const pendiente = [1, 2, 3, 4].find(
    (nivel) => desbloqueado(nivel + desplazamiento) && Number(mejores[nivel + desplazamiento] ?? 0) < 7,
  );

  useEffect(() => {
    document.title = `${ficha.titulo} · Digitalización`;
  }, [ficha.titulo]);

  return (
    <div className="wrap py-10 sm:py-14">
      <Link
        to="/"
        className="text-[0.95rem] underline decoration-mark decoration-2 underline-offset-[0.22em]"
      >
        Las dos partes
      </Link>
      <p className="mt-8 text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">{ficha.kicker}</p>
      <h1 className="mt-4 max-w-[16ch] text-[clamp(2.4rem,5.5vw,4.2rem)]">{ficha.titulo}</h1>
      <p className="mt-5 max-w-[62ch] text-[1.08rem] leading-relaxed">{ficha.texto}</p>
      <p className="mt-4 text-[0.95rem] tabular-nums">
        {lista.length} lecciones · 40 preguntas · nota de corte 7/10
      </p>
      <div className="mt-6 max-w-md">
        <Barra
          valor={hechos}
          total={lista.length + 4}
          etiqueta={`Progreso de la parte ${parte}`}
        />
        <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/60">
          {usuario
            ? `Cada lección leída y cada nivel aprobado suma un hito. Estás en la cuenta de ${usuario.alias}.`
            : "Las lecciones se pueden leer sin cuenta. El cuestionario pide una cuenta."}
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a className="btn w-full sm:w-auto" href="#lecciones">
          Ver las lecciones
        </a>
        <Link className="btn btn-ghost w-full sm:w-auto" to={`/cuestionario/tema${parte}`}>
          Abrir el cuestionario
        </Link>
      </div>

      <section className="mt-16" aria-labelledby="bloques">
        <h2 id="bloques" className="text-[1.45rem]">
          {ficha.tituloBloques}
        </h2>
        <p className="mt-3 max-w-[62ch] leading-relaxed">{ficha.textoBloques}</p>
        <ol className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ficha.bloques.map(([numero, titulo, texto]) => (
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
          <h2 className="text-[1.45rem]">
            {parte === 1 ? "Las seis lecciones" : "Las ocho lecciones"}
          </h2>
          <p className="text-[0.92rem] tabular-nums text-ink/60">
            {lecciones}/{lista.length} leídas
          </p>
        </div>
        <div className="mt-6">
          <RejillaTemas temas={lista} leidos={leidos} base={`/tema${parte}/video`} />
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
              ? `Ahora mismo puedes hacer el nivel ${pendiente}. Cada respuesta trae una explicación.`
              : "Los cuatro niveles están superados. Puedes repetir cualquiera para afianzar."}
          </p>
          <Link className="btn btn-claro mt-6 w-full sm:w-auto" to={`/cuestionario/tema${parte}`}>
            {pendiente ? `Entrar al nivel ${pendiente}` : "Revisar el cuestionario"}
          </Link>
        </motion.aside>
      </section>
    </div>
  );
}
