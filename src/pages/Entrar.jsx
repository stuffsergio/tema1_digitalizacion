import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useProgreso } from "../context/Progreso.jsx";

function destinoSeguro(valor) {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//")) return "/perfil";
  return valor;
}

export function Entrar() {
  const { usuario, cargando, entrar } = useProgreso();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const destino = destinoSeguro(params.get("siguiente"));
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = "Entrar · Digitalización";
  }, []);

  useEffect(() => {
    if (!cargando && usuario) navigate(destino, { replace: true });
  }, [cargando, usuario, destino, navigate]);

  async function enviar(event) {
    event.preventDefault();
    setError("");
    setEnviando(true);
    try {
      await entrar(email, contrasena);
      navigate(destino, { replace: true });
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="wrap py-10 sm:py-14">
      <p className="text-[0.72rem] tracking-[0.16em] text-ink/60 uppercase">Cuenta</p>
      <h1 className="mt-3 max-w-[14ch] text-[clamp(2.2rem,5vw,3.6rem)]">Entrar</h1>
      <p className="mt-4 max-w-[58ch] text-[1.05rem] leading-relaxed">
        Con la cuenta se guarda el progreso y cada intento del cuestionario. El ranking usa la
        nota del primer intento.
      </p>
      <form className="mt-8 grid max-w-md gap-4" onSubmit={enviar}>
        <label className="grid gap-1 text-[0.95rem]">
          Email
          <input
            className="campo"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-[0.95rem]">
          Contraseña
          <input
            className="campo"
            type="password"
            autoComplete="current-password"
            required
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
          />
        </label>
        {error ? <p className="text-[0.95rem] text-mal">{error}</p> : null}
        <button className="btn w-full sm:w-auto" type="submit" disabled={enviando}>
          {enviando ? "Entrando" : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-[0.95rem]">
        <Link
          className="underline decoration-mark decoration-2 underline-offset-[0.22em]"
          to={`/registro?siguiente=${encodeURIComponent(destino)}`}
        >
          Crear una cuenta
        </Link>
      </p>
    </div>
  );
}
