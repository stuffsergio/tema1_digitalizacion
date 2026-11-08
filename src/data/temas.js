import {
  Binary,
  Cpu,
  FileCode,
  Globe,
  HardDrive,
  KeyRound,
  Route,
  Search,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";
import datos from "./temas.json";

const iconos = {
  Sparkles,
  Cpu,
  Binary,
  Zap,
  HardDrive,
  Terminal,
  Globe,
  Wifi,
  Server,
  Route,
  FileCode,
  KeyRound,
  Shield,
  Search,
};

export const temas = datos.map((tema) => ({
  ...tema,
  Icono: iconos[tema.icono] ?? Cpu,
}));

export function tituloCorto(titulo) {
  return titulo.replace(/^Tema\s+\d+\.\d+:\s*/i, "");
}

export function etiquetaTema(id) {
  if (id <= 6) return `1.${id}`;
  return `2.${id - 6}`;
}

export function parteDe(id) {
  return id <= 6 ? 1 : 2;
}

export function temasDe(parte) {
  return temas.filter((tema) => parteDe(tema.id) === parte);
}
