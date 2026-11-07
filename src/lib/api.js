async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(ruta, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(opciones.headers || {}),
    },
    ...opciones,
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.error || "No se pudo completar la petición.");
    error.status = respuesta.status;
    throw error;
  }
  return datos;
}

export const api = {
  sesion: () => pedir("/api/sesion"),
  registro: (cuerpo) => pedir("/api/registro", { method: "POST", body: JSON.stringify(cuerpo) }),
  entrar: (cuerpo) => pedir("/api/entrar", { method: "POST", body: JSON.stringify(cuerpo) }),
  salir: () => pedir("/api/salir", { method: "POST" }),
  perfil: (cuerpo) => pedir("/api/perfil", { method: "PATCH", body: JSON.stringify(cuerpo) }),
  importarProgreso: (cuerpo) => pedir("/api/progreso", { method: "PUT", body: JSON.stringify(cuerpo) }),
  marcarLeido: (id) => pedir("/api/leidos", { method: "POST", body: JSON.stringify({ id }) }),
  registrarIntento: (nivel, aciertos) =>
    pedir("/api/intentos", { method: "POST", body: JSON.stringify({ nivel, aciertos }) }),
  reiniciar: () => pedir("/api/progreso", { method: "DELETE" }),
  ranking: () => pedir("/api/ranking"),
};
