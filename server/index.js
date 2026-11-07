import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { cargarEntorno } from "./entorno.js";
import { db, guardarProgreso, intentosDe, progresoDe } from "./db.js";

cargarEntorno();

const PUERTO = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const CONFIAR_PROXY = process.env.TRUST_PROXY === "1";
const DIAS_SESION = 30;
const codigoClase =
  process.env.CODIGO_CLASE || (process.env.NODE_ENV === "production" ? "" : "daw2026");

const fallos = new Map();

function enviar(res, estado, datos, extra = {}) {
  const cuerpo = JSON.stringify(datos);
  res.writeHead(estado, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(cuerpo),
    ...extra,
  });
  res.end(cuerpo);
}

function cookiesDe(req) {
  const salida = {};
  const cabecera = req.headers.cookie || "";
  for (const parte of cabecera.split(";")) {
    const corte = parte.indexOf("=");
    if (corte === -1) continue;
    const clave = parte.slice(0, corte).trim();
    const valor = parte.slice(corte + 1).trim();
    if (clave) salida[clave] = decodeURIComponent(valor);
  }
  return salida;
}

function cookieSesion(token) {
  const trozos = [
    `sid=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${DIAS_SESION * 24 * 60 * 60}`,
  ];
  if (process.env.COOKIE_SECURE === "1") trozos.push("Secure");
  return trozos.join("; ");
}

function cookieVacia() {
  const trozos = ["sid=", "HttpOnly", "Path=/", "SameSite=Lax", "Max-Age=0"];
  if (process.env.COOKIE_SECURE === "1") trozos.push("Secure");
  return trozos.join("; ");
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    const trozos = [];
    let tamano = 0;
    req.on("data", (trozo) => {
      tamano += trozo.length;
      if (tamano > 100_000) {
        reject(Object.assign(new Error("La petición es demasiado grande"), { status: 413 }));
        req.destroy();
        return;
      }
      trozos.push(trozo);
    });
    req.on("end", () => {
      if (!trozos.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(trozos).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("El cuerpo no es JSON válido"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function ipDe(req) {
  const remota = req.socket.remoteAddress || "";
  const local = remota === "127.0.0.1" || remota === "::1" || remota.endsWith("127.0.0.1");
  if ((local || CONFIAR_PROXY) && typeof req.headers["x-forwarded-for"] === "string") {
    return req.headers["x-forwarded-for"].split(",")[0].trim();
  }
  return remota || "desconocida";
}

function bloqueado(ip) {
  const previo = fallos.get(ip);
  return Boolean(previo && previo.hasta >= Date.now() && previo.cuenta >= 12);
}

function anotarFallo(ip) {
  const ahora = Date.now();
  const previo = fallos.get(ip);
  if (!previo || previo.hasta < ahora) {
    fallos.set(ip, { cuenta: 1, hasta: ahora + 15 * 60 * 1000 });
    return;
  }
  previo.cuenta += 1;
}

function iguales(a, b) {
  const izquierda = createHash("sha256").update(String(a)).digest();
  const derecha = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(izquierda, derecha);
}

function hashContrasena(contrasena, sal = randomBytes(16)) {
  const hash = scryptSync(contrasena, sal, 32);
  return { sal: sal.toString("hex"), hash: hash.toString("hex") };
}

function contrasenaValida(contrasena, salHex, hashHex) {
  const calculado = scryptSync(contrasena, Buffer.from(salHex, "hex"), 32);
  const guardado = Buffer.from(hashHex, "hex");
  if (calculado.length !== guardado.length) return false;
  return timingSafeEqual(calculado, guardado);
}

function limpiarTexto(valor, min, max) {
  const texto = String(valor ?? "").trim().replace(/\s+/g, " ");
  if (texto.length < min || texto.length > max) return "";
  return texto;
}

function aliasValido(alias) {
  return /^[\p{L}\p{N} ]{2,24}$/u.test(alias);
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
}

function usuarioPublico(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    email: fila.email,
    alias: fila.alias,
    enRanking: fila.en_ranking === 1,
  };
}

function sesionActual(req) {
  const token = cookiesDe(req).sid;
  if (!token) return null;
  const fila = db
    .prepare(
      `SELECT s.token, s.expira, u.id, u.nombre, u.email, u.alias, u.en_ranking
       FROM sesiones s JOIN usuarios u ON u.id = s.usuario_id
       WHERE s.token = ?`,
    )
    .get(token);
  if (!fila) return null;
  if (new Date(fila.expira).getTime() < Date.now()) {
    db.prepare("DELETE FROM sesiones WHERE token = ?").run(token);
    return null;
  }
  return fila;
}

function normalizarLeidos(lista) {
  if (!Array.isArray(lista)) return [];
  return [...new Set(lista.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 6))];
}

function normalizarMejores(objeto) {
  const salida = {};
  if (!objeto || typeof objeto !== "object") return salida;
  for (const nivel of [1, 2, 3, 4]) {
    const valor = Number(objeto[nivel] ?? objeto[String(nivel)]);
    if (Number.isInteger(valor) && valor >= 0 && valor <= 10) salida[String(nivel)] = valor;
  }
  return salida;
}

function fusionar(actual, entrante) {
  const leidos = [...new Set([...actual.leidos, ...entrante.leidos])].sort((a, b) => a - b);
  const mejores = { ...actual.mejores };
  for (const [nivel, nota] of Object.entries(entrante.mejores)) {
    mejores[nivel] = Math.max(Number(mejores[nivel] ?? 0), nota);
  }
  return { leidos, mejores };
}

function nivelAbierto(mejores, nivel) {
  if (nivel <= 1) return true;
  return Number(mejores[String(nivel - 1)] ?? 0) >= 7;
}

function crearSesion(usuarioId) {
  const token = randomBytes(32).toString("hex");
  const expira = new Date(Date.now() + DIAS_SESION * 24 * 60 * 60 * 1000).toISOString();
  db.prepare("INSERT INTO sesiones (token, usuario_id, expira) VALUES (?, ?, ?)").run(
    token,
    usuarioId,
    expira,
  );
  return token;
}

function primerIntento(intentos, nivel) {
  return intentos.find((intento) => intento.nivel === nivel) ?? null;
}

function filaRanking(usuario, intentos, progreso) {
  let suma = 0;
  for (const nivel of [1, 2, 3, 4]) {
    const primero = primerIntento(intentos, nivel);
    if (primero) suma += primero.aciertos;
  }
  const niveles = [1, 2, 3, 4].filter((nivel) => Number(progreso.mejores[String(nivel)] ?? 0) >= 7)
    .length;
  return {
    alias: usuario.alias,
    primerIntento: suma,
    intentos: intentos.length,
    nivelesSuperados: niveles,
    lecciones: progreso.leidos.length,
    creado: usuario.creado,
    id: usuario.id,
  };
}

const servidor = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const ruta = url.pathname;
    const metodo = req.method || "GET";

    if (ruta === "/api/salud" && metodo === "GET") {
      enviar(res, 200, { ok: true });
      return;
    }

    if (ruta === "/api/sesion" && metodo === "GET") {
      const sesion = sesionActual(req);
      if (!sesion) {
        enviar(res, 200, { usuario: null, progreso: null, intentos: [] });
        return;
      }
      const intentos = intentosDe(sesion.id).map((intento, _, lista) => ({
        ...intento,
        esPrimero: primerIntento(lista, intento.nivel)?.id === intento.id,
      }));
      enviar(res, 200, {
        usuario: usuarioPublico(sesion),
        progreso: progresoDe(sesion.id),
        intentos,
      });
      return;
    }

    if (ruta === "/api/registro" && metodo === "POST") {
      if (!codigoClase) {
        enviar(res, 403, { error: "El registro está cerrado en este servidor." });
        return;
      }
      const cuerpo = await leerCuerpo(req);
      if (!iguales(String(cuerpo.codigoClase ?? "").trim(), codigoClase)) {
        enviar(res, 403, { error: "El código de clase no es correcto." });
        return;
      }
      const nombre = limpiarTexto(cuerpo.nombre, 2, 40);
      const alias = limpiarTexto(cuerpo.alias, 2, 24);
      const email = String(cuerpo.email ?? "").trim().toLowerCase();
      const contrasena = String(cuerpo.contrasena ?? "");
      if (!nombre || !emailValido(email)) {
        enviar(res, 400, { error: "Revisa el nombre y el email." });
        return;
      }
      if (!alias || !aliasValido(alias)) {
        enviar(res, 400, { error: "El alias admite letras, números y espacios, de 2 a 24 caracteres." });
        return;
      }
      if (contrasena.length < 8 || contrasena.length > 72) {
        enviar(res, 400, { error: "La contraseña necesita entre 8 y 72 caracteres." });
        return;
      }
      if (db.prepare("SELECT id FROM usuarios WHERE email = ?").get(email)) {
        enviar(res, 409, { error: "Ese email ya tiene una cuenta." });
        return;
      }
      if (db.prepare("SELECT id FROM usuarios WHERE alias = ?").get(alias)) {
        enviar(res, 409, { error: "Ese alias ya está en uso. Elige otro." });
        return;
      }
      const { sal, hash } = hashContrasena(contrasena);
      const enRanking = cuerpo.enRanking === false ? 0 : 1;
      const resultado = db
        .prepare(
          `INSERT INTO usuarios (email, nombre, alias, password_hash, password_salt, en_ranking, creado)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(email, nombre, alias, hash, sal, enRanking, new Date().toISOString());
      const token = crearSesion(Number(resultado.lastInsertRowid));
      enviar(res, 201, { ok: true }, { "Set-Cookie": cookieSesion(token) });
      return;
    }

    if (ruta === "/api/entrar" && metodo === "POST") {
      const ip = ipDe(req);
      if (bloqueado(ip)) {
        enviar(res, 429, { error: "Demasiados intentos. Espera unos minutos." });
        return;
      }
      const cuerpo = await leerCuerpo(req);
      const email = String(cuerpo.email ?? "").trim().toLowerCase();
      const contrasena = String(cuerpo.contrasena ?? "");
      const fila = db
        .prepare("SELECT id, password_hash, password_salt FROM usuarios WHERE email = ?")
        .get(email);
      if (!fila || !contrasenaValida(contrasena, fila.password_salt, fila.password_hash)) {
        anotarFallo(ip);
        enviar(res, 401, { error: "Email o contraseña incorrectos." });
        return;
      }
      const token = crearSesion(fila.id);
      enviar(res, 200, { ok: true }, { "Set-Cookie": cookieSesion(token) });
      return;
    }

    if (ruta === "/api/salir" && metodo === "POST") {
      const token = cookiesDe(req).sid;
      if (token) db.prepare("DELETE FROM sesiones WHERE token = ?").run(token);
      enviar(res, 200, { ok: true }, { "Set-Cookie": cookieVacia() });
      return;
    }

    if (ruta === "/api/ranking" && metodo === "GET") {
      const sesionRanking = sesionActual(req);
      const usuarios = db
        .prepare("SELECT id, alias, creado FROM usuarios WHERE en_ranking = 1 ORDER BY id ASC")
        .all();
      const filas = usuarios.map((usuario) => {
        const fila = filaRanking(usuario, intentosDe(usuario.id), progresoDe(usuario.id));
        return {
          alias: fila.alias,
          primerIntento: fila.primerIntento,
          nivelesSuperados: fila.nivelesSuperados,
          lecciones: fila.lecciones,
          mio: sesionRanking?.id === fila.id,
          ordenIntentos: fila.intentos,
          creado: fila.creado,
        };
      });
      filas.sort((a, b) => {
        if (b.primerIntento !== a.primerIntento) return b.primerIntento - a.primerIntento;
        if (a.ordenIntentos !== b.ordenIntentos) return a.ordenIntentos - b.ordenIntentos;
        return a.creado.localeCompare(b.creado);
      });
      enviar(res, 200, {
        filas: filas.map((fila, indice) => ({
          puesto: indice + 1,
          alias: fila.alias,
          primerIntento: fila.primerIntento,
          nivelesSuperados: fila.nivelesSuperados,
          lecciones: fila.lecciones,
          mio: fila.mio,
        })),
      });
      return;
    }

    const sesion = sesionActual(req);
    if (!sesion) {
      enviar(res, 401, { error: "Tienes que entrar con tu cuenta." });
      return;
    }

    if (ruta === "/api/perfil" && metodo === "PATCH") {
      const cuerpo = await leerCuerpo(req);
      const alias = limpiarTexto(cuerpo.alias, 2, 24);
      if (!aliasValido(alias)) {
        enviar(res, 400, { error: "El alias admite letras, números y espacios, de 2 a 24 caracteres." });
        return;
      }
      const ocupado = db.prepare("SELECT id FROM usuarios WHERE alias = ? AND id != ?").get(alias, sesion.id);
      if (ocupado) {
        enviar(res, 409, { error: "Ese alias ya está en uso. Elige otro." });
        return;
      }
      const enRanking = cuerpo.enRanking ? 1 : 0;
      db.prepare("UPDATE usuarios SET alias = ?, en_ranking = ? WHERE id = ?").run(alias, enRanking, sesion.id);
      const fresco = db
        .prepare("SELECT id, nombre, email, alias, en_ranking FROM usuarios WHERE id = ?")
        .get(sesion.id);
      enviar(res, 200, { usuario: usuarioPublico(fresco) });
      return;
    }

    if (ruta === "/api/progreso" && metodo === "PUT") {
      const cuerpo = await leerCuerpo(req);
      const actual = progresoDe(sesion.id);
      const fusion = fusionar(actual, {
        leidos: normalizarLeidos(cuerpo.leidos),
        mejores: normalizarMejores(cuerpo.mejores),
      });
      guardarProgreso(sesion.id, fusion);
      enviar(res, 200, { progreso: fusion });
      return;
    }

    if (ruta === "/api/leidos" && metodo === "POST") {
      const cuerpo = await leerCuerpo(req);
      const id = Number(cuerpo.id);
      if (!Number.isInteger(id) || id < 1 || id > 6) {
        enviar(res, 400, { error: "Esa lección no existe." });
        return;
      }
      const actual = progresoDe(sesion.id);
      if (!actual.leidos.includes(id)) actual.leidos.push(id);
      actual.leidos.sort((a, b) => a - b);
      guardarProgreso(sesion.id, actual);
      enviar(res, 200, { progreso: actual });
      return;
    }

    if (ruta === "/api/intentos" && metodo === "POST") {
      const cuerpo = await leerCuerpo(req);
      const nivel = Number(cuerpo.nivel);
      const aciertos = Number(cuerpo.aciertos);
      if (!Number.isInteger(nivel) || nivel < 1 || nivel > 4) {
        enviar(res, 400, { error: "Ese nivel no existe." });
        return;
      }
      if (!Number.isInteger(aciertos) || aciertos < 0 || aciertos > 10) {
        enviar(res, 400, { error: "La puntuación tiene que estar entre 0 y 10." });
        return;
      }
      const actual = progresoDe(sesion.id);
      if (!nivelAbierto(actual.mejores, nivel)) {
        enviar(res, 403, { error: "Ese nivel sigue bloqueado." });
        return;
      }
      const creado = new Date().toISOString();
      const insertado = db
        .prepare("INSERT INTO intentos (usuario_id, nivel, aciertos, creado) VALUES (?, ?, ?, ?)")
        .run(sesion.id, nivel, aciertos, creado);
      const previos = db
        .prepare("SELECT COUNT(*) AS total FROM intentos WHERE usuario_id = ? AND nivel = ?")
        .get(sesion.id, nivel);
      actual.mejores[String(nivel)] = Math.max(Number(actual.mejores[String(nivel)] ?? 0), aciertos);
      guardarProgreso(sesion.id, actual);
      enviar(res, 201, {
        progreso: actual,
        intento: {
          id: Number(insertado.lastInsertRowid),
          nivel,
          aciertos,
          creado,
          esPrimero: previos.total === 1,
        },
      });
      return;
    }

    if (ruta === "/api/progreso" && metodo === "DELETE") {
      guardarProgreso(sesion.id, { leidos: [], mejores: {} });
      enviar(res, 200, { progreso: { leidos: [], mejores: {} } });
      return;
    }

    enviar(res, 404, { error: "No encontrado" });
  } catch (error) {
    const estado = error.status || 500;
    if (estado === 500) console.error(error);
    enviar(res, estado, { error: error.status ? error.message : "Error interno del servidor" });
  }
});

servidor.listen(PUERTO, HOST, () => {
  console.log(`API en http://${HOST}:${PUERTO}`);
  if (!process.env.CODIGO_CLASE && process.env.NODE_ENV !== "production") {
    console.log("Código de clase de desarrollo: daw2026");
  }
});
