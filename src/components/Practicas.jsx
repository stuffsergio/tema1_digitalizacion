import { useState } from "react";

const PESOS = [128, 64, 32, 16, 8, 4, 2, 1];

function bitsDesde(valor) {
  const n = Math.max(0, Math.min(255, Number.isFinite(valor) ? Math.trunc(valor) : 0));
  return PESOS.map((peso) => ((n & peso) === peso ? 1 : 0));
}

function PracticaBinaria() {
  const [bits, setBits] = useState(() => bitsDesde(9));
  const decimal = bits.reduce((suma, bit, i) => suma + bit * PESOS[i], 0);
  const encendidos = bits.map((bit, i) => (bit ? PESOS[i] : null)).filter((n) => n !== null);
  const formula = encendidos.length ? encendidos.join(" + ") : "0";

  function fijar(valor) {
    setBits(bitsDesde(valor));
  }

  return (
    <section className="border border-line p-4 sm:p-5" aria-labelledby="practica-binaria">
      <h2 id="practica-binaria" className="text-[1.25rem]">
        Compruébalo: un byte
      </h2>
      <p className="mt-2 max-w-[62ch] text-[0.98rem] leading-relaxed">
        Cada casilla es un cable. Amarillo es encendido (1). El 9 del vídeo es 00001001: pesan 8 y
        1.
      </p>
      <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {bits.map((bit, i) => (
          <div key={PESOS[i]} className="grid gap-1">
            <button
              type="button"
              className="bit-tecla"
              aria-pressed={bit === 1}
              aria-label={`Bit de peso ${PESOS[i]}, ${bit === 1 ? "encendido" : "apagado"}`}
              onClick={() =>
                setBits((prev) => prev.map((actual, idx) => (idx === i ? 1 - actual : actual)))
              }
            >
              {bit}
            </button>
            <span className="text-center text-[0.75rem] tabular-nums text-ink/60">{PESOS[i]}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[1.05rem] tabular-nums">
        {formula} = {decimal}
      </p>
      <p className="mt-1 max-w-[62ch] text-[0.9rem] text-ink/70">
        8 bits dan 256 combinaciones, del 0 al 255.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="grid gap-1 text-[0.9rem]">
          Escribe un decimal
          <input
            className="h-11 w-28 border border-ink bg-paper px-3 text-base tabular-nums"
            inputMode="numeric"
            value={decimal}
            onChange={(event) => {
              const limpio = event.target.value.replace(/\D/g, "");
              fijar(limpio === "" ? 0 : Number(limpio));
            }}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {[0, 9, 255].map((n) => (
            <button key={n} type="button" className="btn btn-ghost" onClick={() => fijar(n)}>
              Ver el {n}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticaPuertas() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const notA = a === 1 ? 0 : 1;
  const and = a === 1 && b === 1 ? 1 : 0;

  return (
    <section className="border border-line p-4 sm:p-5" aria-labelledby="practica-puertas">
      <h2 id="practica-puertas" className="text-[1.25rem]">
        Compruébalo: NOT y AND
      </h2>
      <p className="mt-2 max-w-[62ch] text-[0.98rem] leading-relaxed">
        Cambia las dos entradas. NOT solo mira A. AND exige que A y B estén encendidas.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          ["A", a, setA],
          ["B", b, setB],
        ].map(([nombre, valor, fijar]) => (
          <button
            key={nombre}
            type="button"
            className="bit-tecla h-14 justify-between px-4"
            style={{ display: "flex" }}
            aria-pressed={valor === 1}
            onClick={() => fijar(valor === 1 ? 0 : 1)}
          >
            <span>Entrada {nombre}</span>
            <span className="tabular-nums">{valor}</span>
          </button>
        ))}
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="border border-line p-3">
          <dt className="text-[0.85rem] text-ink/60">NOT A</dt>
          <dd className="mt-1 text-[1.6rem] tabular-nums">{notA}</dd>
        </div>
        <div className={`border p-3 ${and === 1 ? "border-ink bg-mark" : "border-line"}`}>
          <dt className="text-[0.85rem] text-ink/60">A AND B</dt>
          <dd className="mt-1 text-[1.6rem] tabular-nums">{and}</dd>
        </div>
      </dl>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left text-[0.95rem] tabular-nums">
          <caption className="mb-2 text-left">Sumador de 1 bit</caption>
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3 font-medium">A</th>
              <th className="py-2 pr-3 font-medium">B</th>
              <th className="py-2 pr-3 font-medium">Suma</th>
              <th className="py-2 font-medium">Bits de salida</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["0", "0", "0", "00"],
              ["0", "1", "1", "01"],
              ["1", "0", "1", "01"],
              ["1", "1", "2", "10"],
            ].map((fila) => (
              <tr key={fila.join()} className="border-b border-line">
                {fila.map((celda, indice) => (
                  <td key={`${fila.join("-")}-${indice}`} className="py-2 pr-3">
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 max-w-[62ch] text-[0.9rem] text-ink/70">
        1 + 1 no cabe en un solo bit. El resultado es 10, el 2 escrito con dos bits.
      </p>
    </section>
  );
}

const PASOS_TECLA = [
  {
    titulo: "Entrada",
    texto: "Pulsas la tecla B. El teclado la convierte en un número binario y lo envía.",
  },
  {
    titulo: "Memoria",
    texto: "La CPU pide las instrucciones para dibujar la letra B.",
  },
  {
    titulo: "Procesamiento",
    texto: "La CPU calcula los píxeles de la B y guarda ese resultado en la memoria.",
  },
  {
    titulo: "Salida",
    texto: "La pantalla enciende los puntos de luz que forman la letra.",
  },
];

function PracticaFlujo() {
  const [paso, setPaso] = useState(0);

  return (
    <section className="border border-line p-4 sm:p-5" aria-labelledby="practica-flujo">
      <h2 id="practica-flujo" className="text-[1.25rem]">
        Compruébalo: la tecla B
      </h2>
      <p className="mt-2 max-w-[62ch] text-[0.98rem] leading-relaxed">
        El dato no salta del teclado a la pantalla. Recorre las cuatro partes en orden.
      </p>
      <ol className="mt-5 grid gap-2">
        {PASOS_TECLA.map((item, i) => (
          <li key={item.titulo}>
            <button
              type="button"
              className={i === paso ? "paso paso-activo" : "paso"}
              aria-current={i === paso ? "step" : undefined}
              onClick={() => setPaso(i)}
            >
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block">{item.titulo}</span>
                <span className="mt-1 block max-w-[58ch] text-[0.95rem] leading-relaxed text-ink/75">
                  {item.texto}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setPaso((n) => Math.max(0, n - 1))}
          disabled={paso === 0}
        >
          Paso anterior
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => setPaso((n) => Math.min(PASOS_TECLA.length - 1, n + 1))}
          disabled={paso === PASOS_TECLA.length - 1}
        >
          Paso siguiente
        </button>
      </div>
    </section>
  );
}

const PROGRAMAS = ["Navegador", "Editor", "Reproductor"];

function PracticaSistema() {
  const [ciclo, setCiclo] = useState(0);
  const activo = ciclo % PROGRAMAS.length;

  const veces = PROGRAMAS.map((_, i) => {
    if (ciclo === 0 && i === 0) return 1;
    let n = 0;
    for (let c = 0; c <= ciclo; c += 1) if (c % PROGRAMAS.length === i) n += 1;
    return n;
  });

  return (
    <section className="border border-line p-4 sm:p-5" aria-labelledby="practica-so">
      <h2 id="practica-so" className="text-[1.25rem]">
        Compruébalo: un solo procesador
      </h2>
      <p className="mt-2 max-w-[62ch] text-[0.98rem] leading-relaxed">
        Hay tres programas abiertos y una CPU. En cada ciclo solo uno trabaja. El sistema
        operativo cambia el turno.
      </p>
      <p className="mt-4 text-[0.95rem] tabular-nums">Ciclo {ciclo + 1}</p>
      <ul className="mt-3 grid gap-2">
        {PROGRAMAS.map((nombre, i) => (
          <li
            key={nombre}
            className={i === activo ? "programa programa-activo" : "programa"}
            style={{ cursor: "default" }}
          >
            <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span>{nombre}</span>
              <span className="text-[0.9rem] text-ink/70">
                {i === activo ? "En la CPU" : "En espera"} · {veces[i]}{" "}
                {veces[i] === 1 ? "turno" : "turnos"}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed">
        Ahora mismo la CPU ejecuta {PROGRAMAS[activo]}. Los otros dos conservan su sitio en
        memoria hasta el ciclo siguiente.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={() => setCiclo((n) => n + 1)}>
          Ceder la CPU
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setCiclo(0)}>
          Volver al ciclo 1
        </button>
      </div>
    </section>
  );
}

export function Practica({ id }) {
  if (id === 3) return <PracticaBinaria />;
  if (id === 4) return <PracticaPuertas />;
  if (id === 5) return <PracticaFlujo />;
  if (id === 6) return <PracticaSistema />;
  return null;
}
