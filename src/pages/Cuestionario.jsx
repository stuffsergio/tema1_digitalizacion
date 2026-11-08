import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Barra } from "../components/Barra.jsx";
import { useProgreso } from "../context/Progreso.jsx";
import banco1 from "../data/preguntas.json";
import banco2 from "../data/preguntas-tema2.json";

const letras = ["A", "B", "C", "D"];

function medalla(puntos) {
  if (puntos === 10) return "Oro";
  if (puntos >= 8) return "Plata";
  if (puntos >= 7) return "Bronce";
  return "Sin medalla";
}

export function ElegirCuestionario() {
  useEffect(() => {
    document.title = "Cuestionario · Digitalización";
  }, []);

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">Evaluación</p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5vw,3.8rem)]">Elige la parte</h1>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">
        Cada parte tiene cuatro niveles de diez preguntas. El ranking de la clase usa solo la parte 1.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link className="tema-card" to="/cuestionario/tema1">
          <span className="bg-mark px-1.5 py-0.5 text-[0.85rem]">Parte 1</span>
          <span className="text-[1.35rem] leading-tight">Cómo funcionan los ordenadores</span>
        </Link>
        <Link className="tema-card" to="/cuestionario/tema2">
          <span className="bg-mark px-1.5 py-0.5 text-[0.85rem]">Parte 2</span>
          <span className="text-[1.35rem] leading-tight">Redes e Internet</span>
        </Link>
      </div>
    </div>
  );
}

export function Cuestionario() {
  const { parte: parteParam } = useParams();
  const parteValida = parteParam === "tema1" || parteParam === "tema2";
  const parte = parteParam === "tema2" ? 2 : 1;
  const banco = parte === 2 ? banco2 : banco1;
  const desplazamiento = parte === 2 ? 4 : 0;
  const ruta = `/cuestionario/tema${parte}`;
  const reduce = useReducedMotion();
  const ancla = useRef(null);
  const guardado = useRef(false);
  const { usuario, cargando, mejores, desbloqueado, registrarResultado, reiniciar } = useProgreso();
  const [fase, setFase] = useState("mapa");
  const [nivel, setNivel] = useState(1);
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [aciertos, setAciertos] = useState(0);
  const [errorGuardado, setErrorGuardado] = useState("");

  const bloque = banco.find((item) => item.nivel === nivel);
  const preguntas = bloque?.preguntas ?? [];
  const actual = preguntas[indice];

  useEffect(() => {
    document.title = `Cuestionario · Parte ${parte} · Digitalización`;
  }, [parte]);

  useEffect(() => {
    if (fase === "mapa") return;
    ancla.current?.scrollIntoView({ block: "start" });
  }, [fase, indice]);

  function empezar(numero) {
    if (!desbloqueado(numero + desplazamiento)) return;
    guardado.current = false;
    setNivel(numero);
    setIndice(0);
    setElegida(null);
    setHistorial([]);
    setAciertos(0);
    setFase("pregunta");
  }

  function elegir(opcion) {
    if (elegida !== null) return;
    setElegida(opcion);
  }

  async function siguiente() {
    if (elegida === null) return;
    const nuevo = [...historial, elegida];
    if (indice + 1 === preguntas.length) {
      const puntos = nuevo.reduce(
        (suma, opcion, i) => suma + (opcion === preguntas[i].respuestaCorrecta ? 1 : 0),
        0,
      );
      if (!guardado.current) {
        guardado.current = true;
        try {
          await registrarResultado(nivel + desplazamiento, puntos);
        } catch (fallo) {
          guardado.current = false;
          setErrorGuardado(fallo.message);
          return;
        }
      }
      setHistorial(nuevo);
      setAciertos(puntos);
      setFase("resultado");
      return;
    }
    setHistorial(nuevo);
    setIndice(indice + 1);
    setElegida(null);
  }

  function salir() {
    setFase("mapa");
    setElegida(null);
  }

  const transicion = { duration: reduce ? 0.01 : 0.24, ease: [0.23, 1, 0.32, 1] };
  const respondidas = historial.length + (elegida !== null ? 1 : 0);

  if (!parteValida) return <Navigate to="/cuestionario" replace />;

  if (cargando) return <p className="wrap py-16">Cargando.</p>;

  if (!usuario) {
    return (
      <div className="wrap py-10 sm:py-14">
        <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">Parte {parte} · Evaluación</p>
        <h1 className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5vw,3.8rem)]">El cuestionario va con tu cuenta</h1>
        <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">
          Cada intento se guarda en tu perfil. El ranking de la clase usa la nota del primer
          intento de cada nivel, así que conviene leer las lecciones antes de empezar.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="btn w-full sm:w-auto" to={`/entrar?siguiente=${ruta}`}>
            Entrar
          </Link>
          <Link className="btn btn-ghost w-full sm:w-auto" to={`/registro?siguiente=${ruta}`}>
            Crear una cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-10 sm:py-14" ref={ancla}>
      {fase === "mapa" ? (
        <Mapa
          banco={banco}
          parte={parte}
          desplazamiento={desplazamiento}
          mejores={mejores}
          desbloqueado={desbloqueado}
          onEmpezar={empezar}
          onReiniciar={reiniciar}
        />
      ) : null}

      {fase === "pregunta" && actual ? (
        <div>
          <button type="button" className="text-[0.95rem] underline decoration-mark decoration-2 underline-offset-[0.22em]" onClick={salir}>
            Volver a los niveles
          </button>
          <p className="mt-8 text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">
            Nivel {bloque.nivel} · {bloque.nombreNivel}
          </p>
          <div className="mt-4 max-w-2xl">
            <Barra valor={respondidas} total={10} etiqueta={`Pregunta ${indice + 1} de 10`} />
          </div>
          <p className="mt-2 text-[0.85rem] text-ink/55">Si sales ahora, este intento no se guarda.</p>
          <AnimatePresence mode="wait">
            <motion.article
              key={actual.id}
              className="mt-6 max-w-2xl"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -28 }}
              transition={transicion}
            >
              <h1 className="text-[clamp(1.45rem,2.5vw,2rem)] leading-tight">{actual.pregunta}</h1>
              <div className="mt-6 grid gap-2" role="group" aria-label="Opciones">
                {actual.opciones.map((opcion, i) => {
                  const cerrada = elegida !== null;
                  const esCorrecta = i === actual.respuestaCorrecta;
                  let clase = "opcion";
                  let estado = "";
                  if (cerrada && esCorrecta) {
                    clase += " opcion-bien";
                    estado = "Correcta";
                  } else if (cerrada && i === elegida) {
                    clase += " opcion-mal";
                    estado = "Tu respuesta";
                  }
                  return (
                    <button
                      key={opcion}
                      type="button"
                      className={`${clase} flex-wrap`}
                      aria-disabled={cerrada}
                      onClick={() => elegir(i)}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center border border-ink text-[0.85rem] ${cerrada && esCorrecta ? "bg-mark" : ""}`}
                        aria-hidden="true"
                      >
                        {letras[i]}
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">{opcion}</span>
                      {estado ? (
                        <span className="basis-full pl-10 text-[0.8rem] tracking-[0.08em] uppercase">
                          {estado}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {elegida !== null ? (
                <div className="mt-5 border-l-2 border-mark pl-4" role="status">
                  <p className="text-[0.72rem] tracking-[0.14em] uppercase">
                    {elegida === actual.respuestaCorrecta ? "Correcto" : "Incorrecto"}
                  </p>
                  <p className="mt-2 max-w-[65ch] leading-relaxed">{actual.explicacion}</p>
                </div>
              ) : null}
              {errorGuardado ? <p className="mt-4 text-[0.95rem] text-mal">{errorGuardado}</p> : null}
              <button type="button" className="btn mt-6 w-full sm:w-auto" onClick={siguiente} disabled={elegida === null}>
                {indice + 1 === preguntas.length ? "Ver el resultado" : "Siguiente pregunta"}
              </button>
            </motion.article>
          </AnimatePresence>
        </div>
      ) : null}

      {fase === "resultado" ? (
        <Resultado
          bloque={bloque}
          preguntas={preguntas}
          historial={historial}
          aciertos={aciertos}
          mejor={Number(mejores[nivel + desplazamiento] ?? aciertos)}
          onReintentar={() => empezar(nivel)}
          onSiguiente={
            nivel < 4 && Number(mejores[nivel + desplazamiento] ?? 0) >= 7
              ? () => empezar(nivel + 1)
              : null
          }
          onMapa={salir}
        />
      ) : null}
    </div>
  );
}

function Mapa({ banco, parte, desplazamiento, mejores, desbloqueado, onEmpezar, onReiniciar }) {
  return (
    <div>
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">Parte {parte} · Evaluación</p>
      <h1 className="mt-3 max-w-[16ch] text-[clamp(2.2rem,5vw,3.8rem)]">Cuestionario por niveles</h1>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">
        Diez preguntas por nivel. Con 7 aciertos se abre el siguiente. En este navegador se guarda
        el mejor resultado, no el último.
      </p>
      <ol className="mt-8 border-t border-line">
        {banco.map((item) => {
          const almacenado = item.nivel + desplazamiento;
          const abierto = desbloqueado(almacenado);
          const mejor = mejores[almacenado];
          const superado = Number(mejor ?? 0) >= 7;
          return (
            <li
              key={item.nivel}
              className="grid items-center gap-4 border-b border-line py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
            >
              <span className="bg-mark px-1.5 py-0.5 text-[0.95rem] tabular-nums">
                {String(item.nivel).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-[1.15rem]">{item.nombreNivel}</h2>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-ink/70">
                  {abierto
                    ? mejor == null
                      ? "10 preguntas. Aún no hay intento."
                      : superado
                        ? `Superado. Mejor resultado ${mejor}/10.`
                        : `Mejor resultado ${mejor}/10. La nota de corte es 7.`
                    : `Se abre con 7/10 en el nivel ${item.nivel - 1}.`}
                </p>
              </div>
              <button
                type="button"
                className="btn w-full sm:w-auto"
                disabled={!abierto}
                onClick={() => onEmpezar(item.nivel)}
              >
                {abierto ? (superado ? "Repetir nivel" : "Empezar nivel") : "Bloqueado"}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="underline decoration-mark decoration-2 underline-offset-[0.22em]" to={`/tema${parte}`}>
          Volver a la parte {parte}
        </Link>
        {parte === 1 ? (
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto"
            onClick={() => {
              if (window.confirm("Se borrarán las lecciones leídas y las notas de las dos partes. Los intentos que ya cuentan en el ranking se conservan.")) {
                onReiniciar();
              }
            }}
          >
            Borrar el progreso
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Resultado({ bloque, preguntas, historial, aciertos, mejor, onReintentar, onSiguiente, onMapa }) {
  const fallos = preguntas
    .map((pregunta, i) => ({ pregunta, elegida: historial[i] }))
    .filter((item) => item.elegida !== item.pregunta.respuestaCorrecta);
  const nombre = medalla(aciertos);
  const aprobado = aciertos >= 7;

  return (
    <div>
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">
        Nivel {bloque.nivel} · Resultado
      </p>
      <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.2rem)] tabular-nums">
        {aciertos}
        <span className="text-ink/35">/10</span>
      </h1>
      <p className="mt-3 text-[1.15rem]">
        <span className="bg-mark px-1.5 py-0.5">{nombre}</span>
      </p>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">
        {aprobado
          ? aciertos === 10
            ? "Las diez respuestas son correctas."
            : `Nivel superado. ${onSiguiente ? `El nivel ${bloque.nivel + 1} ya está abierto.` : "Has cerrado el último nivel."}`
          : "La nota de corte es 7 de 10. Puedes repetir el nivel: las explicaciones siguen en las lecciones."}
        {mejor !== aciertos ? ` Tu mejor resultado en este nivel sigue siendo ${mejor}/10.` : ""}
      </p>
      {fallos.length > 0 ? (
        <section className="mt-8" aria-labelledby="repaso">
          <h2 id="repaso" className="text-[1.25rem]">
            Para repasar
          </h2>
          <ul className="mt-4 grid gap-4">
            {fallos.map(({ pregunta, elegida }) => (
              <li key={pregunta.id} className="border border-line p-4">
                <p className="leading-snug">{pregunta.pregunta}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed">
                  Tu respuesta: {pregunta.opciones[elegida]}
                </p>
                <p className="mt-1 text-[0.95rem] leading-relaxed">
                  Respuesta correcta: {pregunta.opciones[pregunta.respuestaCorrecta]}
                </p>
                <p className="mt-3 max-w-[65ch] border-l-2 border-mark pl-3 text-[0.95rem] leading-relaxed">
                  {pregunta.explicacion}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn w-full sm:w-auto" onClick={onReintentar}>
          Reintentar nivel
        </button>
        {onSiguiente ? (
          <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={onSiguiente}>
            Pasar al nivel {bloque.nivel + 1}
          </button>
        ) : null}
        <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={onMapa}>
          Volver a los niveles
        </button>
      </div>
    </div>
  );
}
