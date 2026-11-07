import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useProgreso } from "../context/Progreso.jsx";

function destinoSeguro(valor) {
  if (!valor || !valor.startsWith("/") || valor.startsWith("//")) return "/perfil";
  return valor;
}

export function Registro() {
  const { usuario, cargando, registrar } = useProgreso();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const destino = destinoSeguro(params.get("siguiente"));
  const [formulario, setFormulario] = useState({
    nombre: "",
    alias: "",
    email: "",
    contrasena: "",
    codigoClase: "",
    enRanking: true,
  });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = "Crear cuenta · Digitalización";
  }, []);

  useEffect(() => {
    if (!cargando && usuario) navigate(destino, { replace: true });
  }, [cargando, usuario, destino, navigate]);

  function cambiar(campo) {
    return (event) => {
      const valor = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      setFormulario((previo) => ({ ...previo, [campo]: valor }));
    };
  }

  async function enviar(event) {
    event.preventDefault();
    const alias = formulario.alias.trim().replace(/\s+/g, " ");
    if (!/^[\p{L}\p{N} ]{2,24}$/u.test(alias)) {
      setError("El alias admite letras, números y espacios, de 2 a 24 caracteres.");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await registrar({ ...formulario, alias });
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
      <h1 className="mt-3 max-w-[14ch] text-[clamp(2.2rem,5vw,3.6rem)]">Crear una cuenta</h1>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed">
        El alias es el nombre que aparece en el ranking. El código de clase lo da el profesor:
        sin ese código no se puede registrar nadie.
      </p>
      <form className="mt-8 grid max-w-md gap-4" onSubmit={enviar}>
        <label className="grid gap-1 text-[0.95rem]">
          Nombre
          <input className="campo" autoComplete="name" required value={formulario.nombre} onChange={cambiar("nombre")} />
        </label>
        <label className="grid gap-1 text-[0.95rem]">
          Alias en el ranking
          <input
            className="campo"
            autoComplete="nickname"
            autoCapitalize="off"
            spellCheck="false"
            aria-describedby="pista-alias"
            required
            minLength={2}
            maxLength={24}
            value={formulario.alias}
            onChange={cambiar("alias")}
          />
          <span className="pista" id="pista-alias">
            Letras, números y espacios. De 2 a 24 caracteres.
          </span>
        </label>
        <label className="grid gap-1 text-[0.95rem]">
          Email
          <input className="campo" type="email" autoComplete="email" required value={formulario.email} onChange={cambiar("email")} />
        </label>
        <label className="grid gap-1 text-[0.95rem]">
          Contraseña
          <input
            className="campo"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={formulario.contrasena}
            onChange={cambiar("contrasena")}
          />
        </label>
        <label className="grid gap-1 text-[0.95rem]">
          Código de clase
          <input className="campo" required value={formulario.codigoClase} onChange={cambiar("codigoClase")} />
        </label>
        <label className="casilla">
          <input type="checkbox" checked={formulario.enRanking} onChange={cambiar("enRanking")} />
          Quiero aparecer en el ranking de la clase.
        </label>
        {error ? (
          <p className="text-[0.95rem] text-mal" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn w-full sm:w-auto" type="submit" disabled={enviando}>
          {enviando ? "Creando la cuenta" : "Crear la cuenta"}
        </button>
      </form>
      <p className="mt-6 text-[0.95rem]">
        <Link
          className="underline decoration-mark decoration-2 underline-offset-[0.22em]"
          to={`/entrar?siguiente=${encodeURIComponent(destino)}`}
        >
          Ya tengo cuenta
        </Link>
      </p>
    </div>
  );
}
