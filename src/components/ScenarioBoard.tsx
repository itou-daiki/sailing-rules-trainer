import type { BoatPosition, ScenarioDiagram } from '../data/content'

interface ScenarioBoardProps {
  diagram: ScenarioDiagram
}

const windRotation: Record<ScenarioDiagram['windDirection'], number> = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
}

const Boat = ({ boat }: { boat: BoatPosition }) => {
  const color = boat.tack === 'port' ? '#e4442d' : '#155b9a'
  return (
    <g transform={`translate(${boat.x} ${boat.y}) rotate(${boat.heading})`}>
      <path d="M0 -13 C7 -7 8 9 0 14 C-8 9 -7 -7 0 -13Z" fill="#f8f7f1" stroke="#0b2942" />
      <path d="M0 -10 0 9 11 3Z" fill={color} opacity="0.92" stroke="#0b2942" strokeWidth="0.8" />
      <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="2" />
      <text x="0" y="3" textAnchor="middle" className="scenario-board__boat-id">
        {boat.id}
      </text>
      <text x="0" y="23" textAnchor="middle" className="scenario-board__boat-label">
        {boat.label}
      </text>
    </g>
  )
}

export function ScenarioBoard({ diagram }: ScenarioBoardProps) {
  return (
    <figure className="scenario-board">
      <svg role="img" aria-label="問題の艇の位置関係" viewBox="0 0 100 100">
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
        {diagram.mark ? (
          <g transform={`translate(${diagram.mark.x} ${diagram.mark.y})`}>
            <circle r="5" fill="#ed6a2c" stroke="#0b2942" />
            <path d="M0 5v8" stroke="#0b2942" />
          </g>
        ) : null}
        {diagram.boats.map((boat) => (
          <Boat key={boat.id} boat={boat} />
        ))}
      </svg>
      <figcaption>
        赤いセール＝ポートタック ／ 青いセール＝スターボードタック
      </figcaption>
    </figure>
  )
}
