import { Cpu, Globe } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProgreso } from "../context/Progreso.jsx";
import { temasDe } from "../data/temas.js";

const partes = [
  {
    id: 1,
    to: "/tema1",
    Icono: Cpu,
    kicker: "Parte 1",
    titulo: "Cómo funcionan los ordenadores",
    texto: "Seis lecciones, del bit al sistema operativo. Vídeos 1 a 6.",
    desplazamiento: 0,
  },
  {
    id: 2,
    to: "/tema2",
    Icono: Globe,
    kicker: "Parte 2",
    titulo: "Redes e Internet",
    texto: "Ocho lecciones, del cable al buscador. Vídeos 7 a 14.",
    desplazamiento: 4,
  },
];

function avance(parte, leidos, mejores) {
  const lista = temasDe(parte.id);
  const lecciones = lista.filter((tema) => leidos.includes(tema.id)).length;
  const niveles = [1, 2, 3, 4].filter(
    (nivel) => Number(mejores[nivel + parte.desplazamiento] ?? 0) >= 7,
  ).length;
  return { lecciones, total: lista.length, niveles };
}

export function Inicio() {
  const { usuario, leidos, mejores } = useProgreso();

  useEffect(() => {
    document.title = "Digitalización · 1.º DAW";
  }, []);

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">
        1.º DAW · Digitalización
      </p>
      <h1 className="mt-4 max-w-[16ch] text-[clamp(2.55rem,6vw,4.6rem)]">
        Dos partes, un temario
      </h1>
      <p className="mt-5 max-w-[62ch] text-[1.08rem] leading-relaxed">
        Primero, cómo una máquina trata la información. Después, cómo esa información viaja
        por Internet. Cada parte tiene sus lecciones y su cuestionario.
      </p>
      <p className="mt-4 max-w-[62ch] text-[0.95rem] leading-relaxed text-ink/70">
        {usuario
          ? `Estás en la cuenta de ${usuario.alias}. El progreso de cada parte se guarda en tu perfil.`
          : "Las lecciones se pueden leer sin cuenta. Para guardar el progreso y entrar en el ranking, crea una cuenta o inicia sesión."}
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {partes.map((parte) => {
          const Icono = parte.Icono;
          const datos = avance(parte, leidos, mejores);
          return (
            <Link key={parte.id} to={parte.to} className="tema-card">
              <span className="flex items-start justify-between gap-4">
                <span className="bg-mark px-1.5 py-0.5 text-[0.85rem]">{parte.kicker}</span>
                <Icono aria-hidden="true" size={18} strokeWidth={1.75} />
              </span>
              <span className="text-[clamp(1.6rem,3vw,2.1rem)] leading-tight tracking-[-0.03em]">
                {parte.titulo}
              </span>
              <span className="max-w-[36ch] text-[1.02rem] leading-relaxed text-ink/75">
                {parte.texto}
              </span>
              <span className="mt-auto pt-3 text-[0.92rem] tabular-nums text-ink/60">
                {datos.lecciones}/{datos.total} lecciones · {datos.niveles}/4 niveles
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
