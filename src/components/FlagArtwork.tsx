import { useId } from 'react'
import type { FlagArtworkKind } from '../data/content'

interface FlagArtworkProps {
  kind: FlagArtworkKind
  label: string
  compact?: boolean
}

const RectFlag = ({ kind }: { kind: Exclude<FlagArtworkKind, 'ap' | 'first-sub'> }) => {
  switch (kind) {
    case 'p':
      return (
        <>
          <rect width="180" height="120" fill="#155b9a" />
          <rect x="55" y="25" width="70" height="70" fill="#f8f7f1" />
        </>
      )
    case 'i':
      return (
        <>
          <rect width="180" height="120" fill="#f0c748" />
          <circle cx="90" cy="60" r="25" fill="#15191c" />
        </>
      )
    case 'u':
      return (
        <>
          <rect width="90" height="60" fill="#e4442d" />
          <rect x="90" width="90" height="60" fill="#f8f7f1" />
          <rect y="60" width="90" height="60" fill="#f8f7f1" />
          <rect x="90" y="60" width="90" height="60" fill="#e4442d" />
        </>
      )
    case 'black':
      return <rect width="180" height="120" fill="#15191c" />
    case 'x':
      return (
        <>
          <rect width="180" height="120" fill="#f8f7f1" />
          <rect x="70" width="40" height="120" fill="#155b9a" />
          <rect y="40" width="180" height="40" fill="#155b9a" />
        </>
      )
    case 's':
      return (
        <>
          <rect width="180" height="120" fill="#f8f7f1" />
          <rect x="55" y="25" width="70" height="70" fill="#155b9a" />
        </>
      )
    case 'c':
      return (
        <>
          <rect width="180" height="24" fill="#155b9a" />
          <rect y="24" width="180" height="24" fill="#f8f7f1" />
          <rect y="48" width="180" height="24" fill="#e4442d" />
          <rect y="72" width="180" height="24" fill="#f8f7f1" />
          <rect y="96" width="180" height="24" fill="#155b9a" />
        </>
      )
    case 'y':
      return (
        <>
          <rect width="180" height="120" fill="#f0c748" />
          <path d="M-24 0 56 0 176 120 96 120zM96 0h80l28 28v80z" fill="#e4442d" />
        </>
      )
    case 'v':
      return (
        <>
          <rect width="180" height="120" fill="#f8f7f1" />
          <path d="M0 0h31l149 99v21h-31L0 21zM149 0h31v21L31 120H0V99z" fill="#e4442d" />
        </>
      )
    case 'n':
      return (
        <>
          <rect width="180" height="120" fill="#f8f7f1" />
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 4 }, (_, column) =>
              (row + column) % 2 === 0 ? (
                <rect
                  key={`${row}-${column}`}
                  x={column * 45}
                  y={row * 30}
                  width="45"
                  height="30"
                  fill="#155b9a"
                />
              ) : null,
            ),
          )}
        </>
      )
    case 'l':
      return (
        <>
          <rect width="90" height="60" fill="#f0c748" />
          <rect x="90" width="90" height="60" fill="#15191c" />
          <rect y="60" width="90" height="60" fill="#15191c" />
          <rect x="90" y="60" width="90" height="60" fill="#f0c748" />
        </>
      )
    case 'm':
      return (
        <>
          <rect width="180" height="120" fill="#155b9a" />
          <path d="M0 0h27l153 102v18h-27L0 18zM153 0h27v18L27 120H0v-18z" fill="#f8f7f1" />
        </>
      )
    case 'orange':
      return <rect width="180" height="120" fill="#ed6a2c" />
    case 'blue':
      return <rect width="180" height="120" fill="#155b9a" />
  }
}

export function FlagArtwork({ kind, label, compact = false }: FlagArtworkProps) {
  const clipId = useId().replaceAll(':', '')

  return (
    <figure className={`flag-artwork${compact ? ' flag-artwork--compact' : ''}`}>
      <span className="flag-artwork__halyard" aria-hidden="true" />
      <svg
        role="img"
        aria-label={`${label}の図`}
        viewBox="0 0 180 120"
        preserveAspectRatio="none"
      >
        {kind === 'ap' ? (
          <>
            <defs>
              <clipPath id={clipId}>
                <path d="M0 0h180l-48 60 48 60H0z" />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              <rect width="180" height="120" fill="#e4442d" />
              <path d="M36 0h30v120H36zM96 0h30v120H96z" fill="#f8f7f1" />
            </g>
          </>
        ) : kind === 'first-sub' ? (
          <>
            <path d="M0 0 180 60 0 120z" fill="#155b9a" />
            <path d="M28 22 136 60 28 98z" fill="#f0c748" />
          </>
        ) : (
          <RectFlag kind={kind} />
        )}
        {kind === 'ap' ? (
          <path d="M0 0h180l-48 60 48 60H0z" fill="none" stroke="#0b2942" strokeWidth="3" />
        ) : kind === 'first-sub' ? (
          <path d="M0 0 180 60 0 120z" fill="none" stroke="#0b2942" strokeWidth="3" />
        ) : (
          <rect width="180" height="120" fill="none" stroke="#0b2942" strokeWidth="3" />
        )}
      </svg>
    </figure>
  )
}
