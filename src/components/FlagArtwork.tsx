import { useId } from 'react'
import type { FlagArtworkKind } from '../data/content'

interface FlagArtworkProps {
  kind: FlagArtworkKind
  label: string
  compact?: boolean
}

type RectFlagKind =
  | 'p'
  | 'i'
  | 'z'
  | 'u'
  | 'black'
  | 'x'
  | 's'
  | 'c'
  | 'y'
  | 'v'
  | 'n'
  | 'l'
  | 'm'
  | 'orange'
  | 'blue'

type AtomicFlagKind = RectFlagKind | 'ap' | 'first-sub' | 'a' | 'h' | 'pennant-1'

export type NumeralPennantNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

const RectFlag = ({ kind }: { kind: RectFlagKind }) => {
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
    case 'z':
      return (
        <>
          <path d="M0 0h180L90 60z" fill="#f0d938" />
          <path d="M0 0v120l90-60z" fill="#15191c" />
          <path d="M180 0v120L90 60z" fill="#155b9a" />
          <path d="M0 120h180L90 60z" fill="#e4442d" />
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

const NumeralPennant = ({
  number,
  clipId,
}: {
  number: NumeralPennantNumber
  clipId: string
}) => (
  <>
    <defs>
      <clipPath id={clipId}>
        <path d="M0 15 180 45v30L0 105z" />
      </clipPath>
    </defs>
    <g clipPath={`url(#${clipId})`}>
      {number === 1 ? (
        <>
          <rect width="180" height="120" fill="#f8f7f1" />
          <circle cx="48" cy="60" r="25" fill="#e81f2b" />
        </>
      ) : null}
      {number === 2 ? (
        <>
          <rect width="180" height="120" fill="#155b9a" />
          <circle cx="48" cy="60" r="25" fill="#f8f7f1" />
        </>
      ) : null}
      {number === 3 ? (
        <>
          <rect width="60" height="120" fill="#e81f2b" />
          <rect x="60" width="60" height="120" fill="#f8f7f1" />
          <rect x="120" width="60" height="120" fill="#155b9a" />
        </>
      ) : null}
      {number === 4 ? (
        <>
          <rect width="180" height="120" fill="#e81f2b" />
          <rect y="48" width="180" height="24" fill="#f8f7f1" />
          <rect x="48" width="24" height="120" fill="#f8f7f1" />
        </>
      ) : null}
      {number === 5 ? (
        <>
          <rect width="120" height="120" fill="#f0d938" />
          <rect x="120" width="60" height="120" fill="#155b9a" />
        </>
      ) : null}
      {number === 6 ? (
        <>
          <rect width="180" height="60" fill="#15191c" />
          <rect y="60" width="180" height="60" fill="#f8f7f1" />
        </>
      ) : null}
      {number === 7 ? (
        <>
          <rect width="180" height="60" fill="#f0d938" />
          <rect y="60" width="180" height="60" fill="#e81f2b" />
        </>
      ) : null}
      {number === 8 ? (
        <>
          <rect width="180" height="120" fill="#f8f7f1" />
          <rect y="48" width="180" height="24" fill="#e81f2b" />
          <rect x="60" width="24" height="120" fill="#e81f2b" />
        </>
      ) : null}
      {number === 9 ? (
        <>
          <rect width="90" height="60" fill="#f8f7f1" />
          <rect x="90" width="90" height="60" fill="#15191c" />
          <rect y="60" width="90" height="60" fill="#e81f2b" />
          <rect x="90" y="60" width="90" height="60" fill="#f0d938" />
        </>
      ) : null}
    </g>
    <path d="M0 15 180 45v30L0 105z" fill="none" stroke="#0b2942" strokeWidth="3" />
  </>
)

const AtomicFlag = ({ kind, clipId }: { kind: AtomicFlagKind; clipId: string }) => {
  if (kind === 'ap') {
    return (
      <>
        <defs>
          <clipPath id={clipId}>
            <path d="M0 10 180 45v30L0 110z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="180" height="120" fill="#e4442d" />
          <path d="M36 0h30v120H36zM96 0h30v120H96z" fill="#f8f7f1" />
        </g>
        <path d="M0 10 180 45v30L0 110z" fill="none" stroke="#0b2942" strokeWidth="3" />
      </>
    )
  }

  if (kind === 'first-sub') {
    return (
      <>
        <path d="M0 0 180 60 0 120z" fill="#155b9a" />
        <path d="M28 22 136 60 28 98z" fill="#f0c748" />
        <path d="M0 0 180 60 0 120z" fill="none" stroke="#0b2942" strokeWidth="3" />
      </>
    )
  }

  if (kind === 'a') {
    return (
      <>
        <defs>
          <clipPath id={clipId}>
            <path d="M0 0h180l-45 60 45 60H0z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="90" height="120" fill="#f8f7f1" />
          <rect x="90" width="90" height="120" fill="#155b9a" />
        </g>
        <path d="M0 0h180l-45 60 45 60H0z" fill="none" stroke="#0b2942" strokeWidth="3" />
      </>
    )
  }

  if (kind === 'h') {
    return (
      <>
        <rect width="90" height="120" fill="#f8f7f1" />
        <rect x="90" width="90" height="120" fill="#e81f2b" />
        <rect width="180" height="120" fill="none" stroke="#0b2942" strokeWidth="3" />
      </>
    )
  }

  if (kind === 'pennant-1') {
    return <NumeralPennant number={1} clipId={clipId} />
  }

  return (
    <>
      <RectFlag kind={kind} />
      <rect width="180" height="120" fill="none" stroke="#0b2942" strokeWidth="3" />
    </>
  )
}

const CompoundFlag = ({
  kind,
  clipId,
}: {
  kind: 'ap-h' | 'ap-a' | 'ap-numeral' | 'n-h' | 'n-a'
  clipId: string
}) => {
  const top: AtomicFlagKind = kind.startsWith('ap') ? 'ap' : 'n'
  const bottom: AtomicFlagKind = kind.endsWith('-h')
    ? 'h'
    : kind.endsWith('-a')
      ? 'a'
      : 'pennant-1'

  return (
    <>
      <g transform="translate(45 0) scale(.5)">
        <AtomicFlag kind={top} clipId={`${clipId}-top`} />
      </g>
      <g transform="translate(45 60) scale(.5)">
        <AtomicFlag kind={bottom} clipId={`${clipId}-bottom`} />
      </g>
      {kind === 'ap-numeral' ? (
        <g aria-hidden="true">
          <circle cx="150" cy="96" r="21" fill="#0b2942" />
          <text x="150" y="101" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">
            1–9
          </text>
        </g>
      ) : null}
    </>
  )
}

const CourseChangeFlag = ({
  kind,
  clipId,
}: {
  kind: 'c-starboard' | 'c-port' | 'c-shorter' | 'c-longer'
  clipId: string
}) => (
  <>
    <g transform="translate(0 20) scale(.66)">
      <AtomicFlag kind="c" clipId={`${clipId}-c`} />
    </g>
    {kind === 'c-starboard' ? (
      <path d="M150 18 126 102h48z" fill="#00a651" stroke="#0b2942" strokeWidth="2" />
    ) : null}
    {kind === 'c-port' ? (
      <rect x="132" y="22" width="38" height="76" fill="#e81f2b" stroke="#0b2942" strokeWidth="2" />
    ) : null}
    {kind === 'c-shorter' || kind === 'c-longer' ? (
      <g>
        <rect x="128" y="22" width="46" height="76" fill="#f8f7f1" stroke="#0b2942" strokeWidth="2" />
        <path d="M138 60h26" stroke="#15191c" strokeWidth="7" />
        {kind === 'c-longer' ? <path d="M151 47v26" stroke="#15191c" strokeWidth="7" /> : null}
      </g>
    ) : null}
  </>
)

const compoundKinds = new Set<FlagArtworkKind>(['ap-h', 'ap-a', 'ap-numeral', 'n-h', 'n-a'])
const courseChangeKinds = new Set<FlagArtworkKind>([
  'c-starboard',
  'c-port',
  'c-shorter',
  'c-longer',
])

export function FlagArtwork({ kind, label, compact = false }: FlagArtworkProps) {
  const clipId = useId().replaceAll(':', '')

  return (
    <figure className={`flag-artwork${compact ? ' flag-artwork--compact' : ''}`}>
      <span className="flag-artwork__halyard" aria-hidden="true" />
      <svg
        role="img"
        aria-label={`${label}の図`}
        viewBox="0 0 180 120"
        preserveAspectRatio="xMidYMid meet"
      >
        {compoundKinds.has(kind) ? (
          <CompoundFlag
            kind={kind as 'ap-h' | 'ap-a' | 'ap-numeral' | 'n-h' | 'n-a'}
            clipId={clipId}
          />
        ) : courseChangeKinds.has(kind) ? (
          <CourseChangeFlag
            kind={kind as 'c-starboard' | 'c-port' | 'c-shorter' | 'c-longer'}
            clipId={clipId}
          />
        ) : (
          <AtomicFlag kind={kind as AtomicFlagKind} clipId={clipId} />
        )}
      </svg>
    </figure>
  )
}

export function NumeralPennantArtwork({ number }: { number: NumeralPennantNumber }) {
  const clipId = useId().replaceAll(':', '')

  return (
    <svg
      className="numeral-pennant"
      role="img"
      aria-label={`数字旗 ${number} の図`}
      viewBox="0 0 180 120"
      preserveAspectRatio="xMidYMid meet"
    >
      <NumeralPennant number={number} clipId={`${clipId}-numeral-${number}`} />
    </svg>
  )
}
