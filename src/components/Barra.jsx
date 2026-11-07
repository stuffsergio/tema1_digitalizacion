export function Barra({ valor, total, etiqueta }) {
  const ratio = total === 0 ? 0 : Math.min(1, valor / total);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-[0.92rem]">
        <span>{etiqueta}</span>
        <span className="tabular-nums">
          {valor}
          <span className="text-ink/60">/{total}</span>
        </span>
      </div>
      <div
        className="mt-2 h-1 overflow-hidden bg-ink/10"
        role="progressbar"
        aria-label={etiqueta}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={valor}
      >
        <div
          className="h-full w-full origin-left bg-mark"
          style={{ transform: `scaleX(${ratio})` }}
        />
      </div>
    </div>
  );
}
