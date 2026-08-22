import { useId, type ReactNode } from 'react'
import type { CourseArtworkKind } from '../data/courses'

interface BoatProps {
  x: number
  y: number
  heading?: number
  scale?: number
  tack: 'port' | 'starboard'
  label?: string
}

const Boat = ({ x, y, heading = 0, scale = 1, tack, label }: BoatProps) => {
  const isPort = tack === 'port'
  const sailX = isPort ? 18 : -18

  return (
    <g transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`}>
      <path
        d="M0 -27 C10 -19 11 16 0 29 C-11 16 -10 -19 0 -27Z"
        className="course-boat-art__hull"
      />
      <path d={`M0 -17 L0 19 L${sailX} 8 Z`} className={`course-boat-art__sail is-${tack}`} />
      <path d={`M0 -8 L${sailX * 0.86} 8`} className="course-boat-art__boom" />
      <circle cx="0" cy="-8" r="2.2" className="course-boat-art__mast" />
      {label ? (
        <text x="0" y="42" textAnchor="middle" className="course-boat-art__boat-label">
          {label}
        </text>
      ) : null}
    </g>
  )
}

const CourseMark = ({ x, y, label }: { x: number; y: number; label?: string }) => (
  <g>
    <circle cx={x} cy={y} r="8" className="course-boat-art__mark" />
    <path d={`M${x} ${y - 7} L${x} ${y - 19} L${x + 11} ${y - 14} L${x} ${y - 10}`} className="course-boat-art__mark-flag" />
    {label ? (
      <text x={x} y={y + 23} textAnchor="middle" className="course-boat-art__note">
        {label}
      </text>
    ) : null}
  </g>
)

const Wind = () => (
  <g className="course-boat-art__wind">
    <text x="176" y="17">WIND</text>
    <path d="M206 22 H172" />
    <path d="m172 22 8-5 M172 22l8 5" />
  </g>
)

const SignalScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M32 29 V118" className="course-boat-art__signal-pole" />
    <path d="M34 35 H61 V51 H34Z" className="course-boat-art__signal is-yellow" />
    <path d="M34 56 H61 V72 H34Z" className="course-boat-art__signal is-blue" />
    <text x="18" y="130" className="course-boat-art__note">信号艇</text>
    <path d="M137 111 C110 99 84 78 64 57" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <text x="86" y="103" className="course-boat-art__callout">見る</text>
    <Boat x={154} y={101} heading={-20} scale={0.78} tack="starboard" />
  </>
)

const StartScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M28 60 H184" className="course-boat-art__start-line" />
    <CourseMark x={31} y={60} />
    <CourseMark x={181} y={60} />
    <text x="106" y="50" textAnchor="middle" className="course-boat-art__callout">START LINE</text>
    <path d="M106 125 C106 106 109 88 117 70" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <Boat x={103} y={112} heading={5} scale={0.76} tack="starboard" />
    <g className="course-boat-art__clock">
      <text x="25" y="19">5</text><text x="47" y="19">4</text><text x="69" y="19">1</text><text x="91" y="19">0</text>
      <path d="M23 24 H98" />
    </g>
  </>
)

const MeetingScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M31 126 L100 54" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <path d="M181 126 L111 54" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <Boat x={64} y={92} heading={45} scale={0.82} tack="port" />
    <Boat x={148} y={92} heading={-45} scale={0.82} tack="starboard" />
    <g className="course-boat-art__key">
      <circle cx="54" cy="133" r="7" className="is-port" />
      <text x="68" y="137">PORT</text>
      <circle cx="134" cy="133" r="7" className="is-starboard" />
      <text x="148" y="137">STARBOARD</text>
    </g>
  </>
)

const RoomScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M64 131 C65 103 76 78 100 50" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <path d="M143 128 C142 98 139 78 136 47" markerEnd={`url(#${arrowId})`} className="course-boat-art__route is-muted" />
    <path d="M111 129 C110 103 112 79 125 55" className="course-boat-art__room" />
    <path d="M173 129 C172 101 164 77 148 54" className="course-boat-art__room" />
    <Boat x={77} y={99} heading={13} scale={0.78} tack="starboard" />
    <Boat x={143} y={86} heading={-4} scale={0.74} tack="port" />
    <text x="156" y="116" textAnchor="middle" className="course-boat-art__callout">逃げ場</text>
    <path d="M126 121 H169" className="course-boat-art__measure" />
  </>
)

const RaceScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M55 118 L106 34 L166 108 L55 118" className="course-boat-art__course" />
    <path d="M67 111 C82 87 94 64 104 45" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <CourseMark x={106} y={34} />
    <CourseMark x={166} y={108} />
    <path d="M34 121 H81" className="course-boat-art__start-line" />
    <Boat x={61} y={109} heading={26} scale={0.58} tack="starboard" />
    <text x="20" y="137" className="course-boat-art__note">START</text>
  </>
)

const scenes: Record<CourseArtworkKind, (arrowId: string) => ReactNode> = {
  signals: (arrowId) => <SignalScene arrowId={arrowId} />,
  start: (arrowId) => <StartScene arrowId={arrowId} />,
  meeting: (arrowId) => <MeetingScene arrowId={arrowId} />,
  room: (arrowId) => <RoomScene arrowId={arrowId} />,
  race: (arrowId) => <RaceScene arrowId={arrowId} />,
}

interface CourseBoatDiagramProps {
  kind: CourseArtworkKind
  title: string
  caption: string
}

export function CourseBoatDiagram({ kind, title, caption }: CourseBoatDiagramProps) {
  const arrowId = `course-arrow-${useId().replaceAll(':', '')}`

  return (
    <figure className={`course-boat-art course-boat-art--${kind}`}>
      <svg role="img" aria-label={`${title}の艇図。${caption}`} viewBox="0 0 220 150">
        <defs>
          <marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8Z" className="course-boat-art__arrow-head" />
          </marker>
        </defs>
        <path d="M5 34 H215 M5 75 H215 M5 116 H215 M54 5 V145 M108 5 V145 M162 5 V145" className="course-boat-art__grid" />
        {scenes[kind](arrowId)}
      </svg>
      <figcaption>
        <span>LOOK</span>
        <strong>{caption}</strong>
      </figcaption>
    </figure>
  )
}
