import ReactMarkdown from "react-markdown";

const componentes = {
  h1: () => null,
  a: ({ href, children }) => (
    <a href={href} className="underline decoration-mark decoration-2 underline-offset-[0.2em]">
      {children}
    </a>
  ),
};

export function partirMarkdown(md) {
  const sinTitulo = md.replace(/^#\s+.+(?:\r?\n)+/, "");
  const [cuerpo, resto] = sinTitulo.split(/\r?\n---\r?\n/);
  const fuente = (resto || "").replace(/\*/g, "").trim();
  return { cuerpo: cuerpo.trim(), fuente };
}

export function Lectura({ markdown }) {
  const { cuerpo, fuente } = partirMarkdown(markdown);

  return (
    <article className="lectura">
      <ReactMarkdown components={componentes}>{cuerpo}</ReactMarkdown>
      {fuente ? (
        <p className="mt-10 max-w-[62ch] text-[0.9rem] text-ink/60">{fuente}</p>
      ) : null}
    </article>
  );
}
