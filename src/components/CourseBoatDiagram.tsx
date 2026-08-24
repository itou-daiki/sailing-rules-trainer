import { useId, type ReactNode } from 'react'
import type { CourseArtworkKind } from '../data/courses'
import { PlanViewDinghy } from './PlanViewDinghy'

interface BoatProps {
  x: number
  y: number
  heading?: number
  scale?: number
  tack: 'port' | 'starboard'
  label?: string
}

const Boat = ({ x, y, heading = 0, scale = 1, tack, label }: BoatProps) => {
  return (
    <>
      <PlanViewDinghy tack={tack} x={x} y={y} heading={heading} scale={scale} />
      {label ? (
        <text x={x} y={y + 42 * scale} textAnchor="middle" className="course-boat-art__boat-label">
          {label}
        </text>
      ) : null}
    </>
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

const MarkScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <circle cx="111" cy="43" r="48" className="course-boat-art__zone" />
    <text x="61" y="18" className="course-boat-art__callout">3艇身ゾーン</text>
    <CourseMark x={111} y={43} />
    <path d="M75 135 C76 102 88 79 105 57" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <path d="M143 135 C142 104 132 79 118 59" markerEnd={`url(#${arrowId})`} className="course-boat-art__route is-muted" />
    <Boat x={86} y={99} heading={12} scale={0.65} tack="starboard" label="内側" />
    <Boat x={141} y={105} heading={-12} scale={0.65} tack="starboard" label="外側" />
  </>
)

const PenaltyScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M83 119 C45 111 42 61 81 54 C118 48 131 89 104 112" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <Boat x={82} y={87} heading={76} scale={0.66} tack="port" />
    <Boat x={174} y={54} heading={-7} scale={0.5} tack="starboard" />
    <path d="M129 32 V127" className="course-boat-art__clear-line" />
    <text x="140" y="119" className="course-boat-art__note">まず離れる</text>
    <text x="21" y="23" className="course-boat-art__callout">1 / 2 TURNS</text>
  </>
)

const ObstructionScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M183 30 H220 V150 H183Z" className="course-boat-art__breakwater" />
    <path d="M185 34l31 18 M185 52l31 18 M185 70l31 18 M185 88l31 18 M185 106l31 18 M185 124l31 18" className="course-boat-art__breakwater-lines" />
    <text x="202" y="23" textAnchor="middle" className="course-boat-art__note">防波堤</text>
    <path d="M145 130 V48" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <path d="M96 130 V48" markerEnd={`url(#${arrowId})`} className="course-boat-art__route is-muted" />
    <Boat x={145} y={94} scale={0.62} tack="starboard" label="内側" />
    <Boat x={96} y={103} scale={0.62} tack="starboard" label="外側" />
    <path d="M162 74 H180 M162 70v8 M180 70v8" className="course-boat-art__measure" />
    <text x="171" y="66" textAnchor="middle" className="course-boat-art__callout">ROOM</text>
  </>
)

const FairScene = ({ arrowId }: { arrowId: string }) => (
  <>
    <Wind />
    <path d="M39 121 L104 34 L169 112" className="course-boat-art__course" />
    <CourseMark x={104} y={34} />
    <path d="M55 116 C69 89 83 66 99 47" markerEnd={`url(#${arrowId})`} className="course-boat-art__route" />
    <Boat x={67} y={96} heading={25} scale={0.62} tack="starboard" />
    <path d="M33 78q-13 9 0 18 M31 76l-6 2 4 5 M31 99l-6-2 4-5" className="course-boat-art__motion" />
    <path d="M24 72 L40 103" className="course-boat-art__stop" />
    <g transform="translate(146 37)">
      <path d="M0 0V31" className="course-boat-art__signal-pole" />
      <path d="M2 2H24V17H2Z" className="course-boat-art__protest-flag" />
      <text x="12" y="42" textAnchor="middle" className="course-boat-art__note">手続</text>
    </g>
    <text x="128" y="119" className="course-boat-art__callout">WIND + WATER</text>
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
  mark: (arrowId) => <MarkScene arrowId={arrowId} />,
  penalty: (arrowId) => <PenaltyScene arrowId={arrowId} />,
  obstruction: (arrowId) => <ObstructionScene arrowId={arrowId} />,
  fair: (arrowId) => <FairScene arrowId={arrowId} />,
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
