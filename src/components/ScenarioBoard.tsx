import type { BoatPosition, ScenarioDiagram } from '../data/content'
import type { BoatClass } from '../domain/boatClass'
import { PlanViewDinghy } from './PlanViewDinghy'

interface ScenarioBoardProps {
  boatClass: BoatClass
  diagram: ScenarioDiagram
}

const windRotation: Record<ScenarioDiagram['windDirection'], number> = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
}

const Boat = ({ boat, boatClass }: { boat: BoatPosition; boatClass: BoatClass }) => {
  return (
    <>
      <PlanViewDinghy
        boatClass={boatClass}
        tack={boat.tack}
        x={boat.x}
        y={boat.y}
        heading={boat.heading}
        scale={0.5}
        testId={boat.id}
      />
      <g transform={`translate(${boat.x} ${boat.y}) rotate(${boat.heading})`}>
        <circle cy="-19" r="4" className={`scenario-board__boat-badge is-${boat.tack}`} />
        <text x="0" y="-17.4" textAnchor="middle" className="scenario-board__boat-id">
          {boat.id}
        </text>
      </g>
    </>
  )
}

export function ScenarioBoard({ boatClass, diagram }: ScenarioBoardProps) {
  return (
    <figure className="scenario-board">
      <svg
        role="img"
        aria-label={`問題の艇の位置関係${diagram.mark?.zone ? '。破線の円は3艇身ゾーン' : ''}${diagram.obstruction ? `。${diagram.obstruction.label}は通過できない障害物` : ''}`}
        viewBox="0 0 100 100"
      >
        <rect width="100" height="100" className="scenario-board__water" />
        <g transform={`translate(13 13) rotate(${windRotation[diagram.windDirection]})`}>
          <path d="M0 10V-7M0-7-4-1M0-7 4-1" className="scenario-board__wind-arrow" />
          <text x="7" y="0" className="scenario-board__wind-label">
            風
          </text>
        </g>
        {diagram.overlap ? (
          <path d="M31 49H75" className="scenario-board__guide" aria-hidden="true" />
        ) : null}
        {diagram.path ? (
          <path d={diagram.path.d} className="scenario-board__path" aria-hidden="true" />
        ) : null}
        {diagram.obstruction ? (
          <g className="scenario-board__obstruction">
            <rect
              x={diagram.obstruction.x - diagram.obstruction.width / 2}
              y={diagram.obstruction.y - diagram.obstruction.height / 2}
              width={diagram.obstruction.width}
              height={diagram.obstruction.height}
            />
            <text
              x={diagram.obstruction.x}
              y={diagram.obstruction.y}
              textAnchor="middle"
              transform={diagram.obstruction.height > diagram.obstruction.width
                ? `rotate(90 ${diagram.obstruction.x} ${diagram.obstruction.y})`
                : undefined}
            >
              {diagram.obstruction.label}
            </text>
          </g>
        ) : null}
        {diagram.mark ? (
          <g transform={`translate(${diagram.mark.x} ${diagram.mark.y})`}>
            {diagram.mark.zone ? (
              <>
                <circle r="31" className="scenario-board__zone" />
                <text x="7" y="-20" className="scenario-board__zone-label">3艇身ゾーン</text>
              </>
            ) : null}
            <circle r="5" fill="#ed6a2c" stroke="#0b2942" />
            <path d="M0 5v8" stroke="#0b2942" />
          </g>
        ) : null}
        {diagram.boats.map((boat) => {
          const labelOnLeft = boat.x > 55 || (boat.x >= 45 && boat.x <= 55 && boat.id === 'B')
          return (
            <g key={boat.id}>
              <Boat boat={boat} boatClass={boatClass} />
              <text
                x={boat.x + (labelOnLeft ? -12 : 12)}
                y={boat.y + 2}
                textAnchor={labelOnLeft ? 'end' : 'start'}
                className="scenario-board__boat-label"
              >
                {boat.label}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>
        <span>{boatClass}モデル</span>
        <span>ポートタック（赤い縁）：帆は右舷側</span>
        <span>スターボードタック（青い縁）：帆は左舷側</span>
      </figcaption>
    </figure>
  )
}
