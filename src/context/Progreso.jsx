import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api.js";

const CLAVE = "digitalizacion-tema1-progreso";
const ProgresoContext = createContext(null);
const VACIO = { leidos: [], mejores: {} };

function leerLocal() {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return { ...VACIO, mejores: {} };
    const data = JSON.parse(raw);
    return {
      leidos: Array.isArray(data.leidos)
        ? data.leidos.filter((n) => Number.isInteger(n))
        : [],
      mejores: data.mejores && typeof data.mejores === "object" ? data.mejores : {},
    };
  } catch {
    return { leidos: [], mejores: {} };
  }
}

function guardarLocal(estado) {
  localStorage.setItem(CLAVE, JSON.stringify(estado));
}

function hayLocal(estado) {
  return estado.leidos.length > 0 || Object.keys(estado.mejores).length > 0;
}

export function ProgresoProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [intentos, setIntentos] = useState([]);
  const [estado, setEstado] = useState(VACIO);
  const [cargando, setCargando] = useState(true);
  const estadoRef = useRef(estado);
  const usuarioRef = useRef(usuario);
  estadoRef.current = estado;
  usuarioRef.current = usuario;

  const aplicarRemoto = useCallback((sesion) => {
    setUsuario(sesion.usuario);
    setEstado(sesion.progreso || { leidos: [], mejores: {} });
    setIntentos(sesion.intentos || []);
  }, []);

  const fusionarLocal = useCallback(async (progresoRemoto) => {
    const local = leerLocal();
    if (!hayLocal(local)) return progresoRemoto || { leidos: [], mejores: {} };
    const respuesta = await api.importarProgreso(local);
    localStorage.removeItem(CLAVE);
    return respuesta.progreso;
  }, []);

  useEffect(() => {
    let vivo = true;
    api
      .sesion()
      .then(async (sesion) => {
        if (!vivo) return;
        if (!sesion.usuario) {
          setUsuario(null);
          setEstado(leerLocal());
          setIntentos([]);
          setCargando(false);
          return;
        }
        const progreso = await fusionarLocal(sesion.progreso);
        if (!vivo) return;
        setUsuario(sesion.usuario);
        setEstado(progreso);
        setIntentos(sesion.intentos || []);
        setCargando(false);
      })
      .catch(() => {
        if (!vivo) return;
        setUsuario(null);
        setEstado(leerLocal());
        setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, [fusionarLocal]);

  const entrar = useCallback(
    async (email, contrasena) => {
      await api.entrar({ email, contrasena });
      const sesion = await api.sesion();
      const progreso = await fusionarLocal(sesion.progreso);
      aplicarRemoto({ ...sesion, progreso });
    },
    [aplicarRemoto, fusionarLocal],
  );

  const registrar = useCallback(
    async (datos) => {
      await api.registro(datos);
      const sesion = await api.sesion();
      const progreso = await fusionarLocal(sesion.progreso);
      aplicarRemoto({ ...sesion, progreso });
    },
    [aplicarRemoto, fusionarLocal],
  );

  const salir = useCallback(async () => {
    await api.salir();
    setUsuario(null);
    setIntentos([]);
    setEstado({ leidos: [], mejores: {} });
  }, []);

  const actualizarPerfil = useCallback(async (datos) => {
    const respuesta = await api.perfil(datos);
    setUsuario(respuesta.usuario);
  }, []);

  const marcarLeido = useCallback((id) => {
    if (estadoRef.current.leidos.includes(id)) return;
    const next = { ...estadoRef.current, leidos: [...estadoRef.current.leidos, id] };
    estadoRef.current = next;
    setEstado(next);
    if (usuarioRef.current) {
      api.marcarLeido(id).catch(() => {});
      return;
    }
    guardarLocal(next);
  }, []);

  const registrarResultado = useCallback(async (nivel, puntos) => {
    const anterior = Number(estadoRef.current.mejores[nivel] ?? 0);
    const next = {
      ...estadoRef.current,
      mejores: { ...estadoRef.current.mejores, [nivel]: Math.max(anterior, puntos) },
    };
    estadoRef.current = next;
    setEstado(next);
    if (!usuarioRef.current) {
      guardarLocal(next);
      return;
    }
    const respuesta = await api.registrarIntento(nivel, puntos);
    estadoRef.current = respuesta.progreso;
    setEstado(respuesta.progreso);
    setIntentos((previos) => [...previos, respuesta.intento]);
  }, []);

  const reiniciar = useCallback(async () => {
    if (usuarioRef.current) {
      const respuesta = await api.reiniciar();
      estadoRef.current = respuesta.progreso;
      setEstado(respuesta.progreso);
      return;
    }
    const vacio = { leidos: [], mejores: {} };
    guardarLocal(vacio);
    estadoRef.current = vacio;
    setEstado(vacio);
  }, []);

  const desbloqueado = useCallback(
    (nivel) => {
      const primero = nivel <= 4 ? 1 : 5;
      if (nivel === primero) return true;
      if (nivel < 1 || nivel > 8) return false;
      return Number(estado.mejores[nivel - 1] ?? 0) >= 7;
    },
    [estado.mejores],
  );

  const hechos = useMemo(() => {
    const niveles = Object.values(estado.mejores).filter((n) => Number(n) >= 7).length;
    return estado.leidos.length + niveles;
  }, [estado]);

  const value = useMemo(
    () => ({
      usuario,
      intentos,
      cargando,
      leidos: estado.leidos,
      mejores: estado.mejores,
      hechos,
      entrar,
      registrar,
      salir,
      actualizarPerfil,
      marcarLeido,
      registrarResultado,
      reiniciar,
      desbloqueado,
    }),
    [
      usuario,
      intentos,
      cargando,
      estado,
      hechos,
      entrar,
      registrar,
      salir,
      actualizarPerfil,
      marcarLeido,
      registrarResultado,
      reiniciar,
      desbloqueado,
    ],
  );

  return <ProgresoContext.Provider value={value}>{children}</ProgresoContext.Provider>;
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error("useProgreso debe usarse dentro de ProgresoProvider");
  return ctx;
}
