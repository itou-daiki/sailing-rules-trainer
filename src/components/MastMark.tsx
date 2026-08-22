export function MastMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`mast-mark${compact ? ' mast-mark--compact' : ''}`} aria-hidden="true">
      <span className="mast-mark__mast" />
      <span className="mast-mark__flag mast-mark__flag--red" />
      <span className="mast-mark__flag mast-mark__flag--yellow" />
    </span>
  )
}
