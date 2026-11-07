import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Lectura } from "../components/Lectura.jsx";
import { Practica } from "../components/Practicas.jsx";
import { useProgreso } from "../context/Progreso.jsx";
import { citas, puntos } from "../data/puntos.js";
import { etiquetaTema, temas, tituloCorto } from "../data/temas.js";
import md1 from "../content/1-introduccion-como-funcionan-las-computadoras.md?raw";
import md2 from "../content/2-que-hace-a-una-computadora.md?raw";
import md3 from "../content/3-binario-y-datos.md?raw";
import md4 from "../content/4-circuitos-y-logica.md?raw";
import md5 from "../content/5-cpu-memoria-entrada-salida.md?raw";
import md6 from "../content/6-hardware-y-software.md?raw";

const documentos = { 1: md1, 2: md2, 3: md3, 4: md4, 5: md5, 6: md6 };

function Navegacion({ anterior, siguiente }) {
  return (
    <nav className="flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-start sm:justify-between" aria-label="Lecciones contiguas">
      {anterior ? (
        <Link to={`/tema/${anterior.id}`} className="max-w-[34ch]">
          <span className="block text-[0.72rem] tracking-[0.14em] text-ink/50 uppercase">Anterior</span>
          <span className="mt-1 block underline decoration-mark decoration-2 underline-offset-[0.22em]">
            {tituloCorto(anterior.titulo)}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {siguiente ? (
        <Link to={`/tema/${siguiente.id}`} className="max-w-[34ch] sm:text-right">
          <span className="block text-[0.72rem] tracking-[0.14em] text-ink/50 uppercase">Siguiente</span>
          <span className="mt-1 block underline decoration-mark decoration-2 underline-offset-[0.22em]">
            {tituloCorto(siguiente.titulo)}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

function Puntos({ id }) {
  return (
    <section aria-labelledby={`puntos-${id}`}>
      <h2 id={`puntos-${id}`} className="text-[1.15rem]">
        Puntos clave
      </h2>
      <ul className="mt-4 grid gap-3">
        {puntos[id].map((punto) => (
          <li key={punto} className="grid grid-cols-[auto_1fr] gap-3 text-[0.95rem] leading-relaxed">
            <span className="marca mt-[0.45rem]" aria-hidden="true" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cita({ id }) {
  const cita = citas[id];
  return (
    <figure className="border-l-2 border-mark pl-4">
      <blockquote>
        <p className="text-[1.02rem] leading-snug">{cita.texto}</p>
      </blockquote>
      <figcaption className="mt-3 text-[0.82rem] text-ink/55">{cita.fuente}</figcaption>
    </figure>
  );
}

export function Tema() {
  const { id } = useParams();
  const numero = Number(id);
  const tema = temas.find((item) => item.id === numero);
  const { marcarLeido } = useProgreso();

  useEffect(() => {
    if (!tema) {
      document.title = "Lección no encontrada · Digitalización";
      return;
    }
    document.title = `${tituloCorto(tema.titulo)} · Digitalización`;
    marcarLeido(tema.id);
  }, [tema, marcarLeido]);

  if (!tema) {
    return (
      <div className="wrap py-16">
        <p className="text-[0.72rem] tracking-[0.16em] uppercase">Temario</p>
        <h1 className="mt-3 max-w-[16ch] text-[clamp(2rem,4vw,3.2rem)]">
          Esa lección no está en el tema.
        </h1>
        <Link className="btn mt-8" to="/">
          Volver al temario
        </Link>
      </div>
    );
  }

  const indice = temas.findIndex((item) => item.id === tema.id);
  const anterior = temas[indice - 1];
  const siguiente = temas[indice + 1];

  return (
    <div className="wrap py-8 sm:py-12">
      <Link
        to="/"
        className="text-[0.95rem] underline decoration-mark decoration-2 underline-offset-[0.22em]"
      >
        Volver al temario
      </Link>
      <p className="mt-8 text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">
        Tema {etiquetaTema(tema.id)} · {tema.videoOriginal}
      </p>
      <h1 className="mt-3 max-w-[18ch] text-[clamp(2.1rem,4.4vw,3.5rem)]">
        {tituloCorto(tema.titulo)}
      </h1>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">{tema.resumen}</p>
      <div className="mt-6">
        <Navegacion anterior={anterior} siguiente={siguiente} />
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <aside className="grid gap-8 lg:sticky lg:top-24 lg:order-2">
          <Puntos id={tema.id} />
          <Cita id={tema.id} />
        </aside>
        <div className="grid min-w-0 gap-8 lg:order-1">
          <Practica id={tema.id} />
          <Lectura markdown={documentos[tema.id]} />
          <Navegacion anterior={anterior} siguiente={siguiente} />
        </div>
      </div>
    </div>
  );
}
