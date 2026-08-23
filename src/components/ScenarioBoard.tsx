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
  const color = boat.tack === 'port' ? '#c93627' : '#155b9a'
  const sailX = boat.tack === 'port' ? 11 : -11
  const sailSide = boat.tack === 'port' ? 'starboard' : 'port'
  return (
    <g transform={`translate(${boat.x} ${boat.y}) rotate(${boat.heading})`}>
      <path d="M0 -13 C7 -7 8 9 0 14 C-8 9 -7 -7 0 -13Z" fill="#f8f7f1" stroke="#0b2942" />
      <path
        d={`M0 -10 L0 9 L${sailX} 3 Z`}
        fill={color}
        opacity="0.92"
        stroke="#0b2942"
        strokeWidth="0.8"
        data-testid={`sail-${boat.id}`}
        data-sail-side={sailSide}
      />
      <path d={`M0 0 L${sailX} 3`} className="scenario-board__boom" aria-hidden="true" />
      <circle cx="0" cy="0" r="8" fill="none" stroke={color} strokeWidth="2" />
      <text x="0" y="3" textAnchor="middle" className="scenario-board__boat-id">
        {boat.id}
      </text>
    </g>
  )
}

export function ScenarioBoard({ diagram }: ScenarioBoardProps) {
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
              <Boat boat={boat} />
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
        <span>ポートタック（赤）：帆は右舷側</span>
        <span>スターボードタック（青）：帆は左舷側</span>
      </figcaption>
    </figure>
  )
}
