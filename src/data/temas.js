import { Binary, Cpu, HardDrive, Sparkles, Terminal, Zap } from "lucide-react";
import datos from "./temas.json";

const iconos = { Sparkles, Cpu, Binary, Zap, HardDrive, Terminal };

export const temas = datos.map((tema) => ({
  ...tema,
  Icono: iconos[tema.icono] ?? Cpu,
}));

export function tituloCorto(titulo) {
  return titulo.replace(/^Tema\s+\d+\.\d+:\s*/i, "");
}

export function etiquetaTema(id) {
  return `1.${id}`;
}
