import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

mkdirSync("data", { recursive: true });

export const db = new DatabaseSync("data/app.db");

db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    nombre TEXT NOT NULL,
    alias TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    en_ranking INTEGER NOT NULL DEFAULT 1,
    creado TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sesiones (
    token TEXT PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expira TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progresos (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    leidos TEXT NOT NULL DEFAULT '[]',
    mejores TEXT NOT NULL DEFAULT '{}'
  );

  CREATE TABLE IF NOT EXISTS intentos (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nivel INTEGER NOT NULL,
    aciertos INTEGER NOT NULL,
    creado TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS intentos_usuario ON intentos (usuario_id, nivel, id);
`);

export function progresoDe(usuarioId) {
  const fila = db.prepare("SELECT leidos, mejores FROM progresos WHERE usuario_id = ?").get(usuarioId);
  if (!fila) return { leidos: [], mejores: {} };
  return {
    leidos: JSON.parse(fila.leidos),
    mejores: JSON.parse(fila.mejores),
  };
}

export function guardarProgreso(usuarioId, progreso) {
  db.prepare(`
    INSERT INTO progresos (usuario_id, leidos, mejores)
    VALUES (?, ?, ?)
    ON CONFLICT(usuario_id) DO UPDATE SET leidos = excluded.leidos, mejores = excluded.mejores
  `).run(usuarioId, JSON.stringify(progreso.leidos), JSON.stringify(progreso.mejores));
}

export function intentosDe(usuarioId) {
  return db
    .prepare(
      "SELECT id, nivel, aciertos, creado FROM intentos WHERE usuario_id = ? ORDER BY id ASC",
    )
    .all(usuarioId);
}
