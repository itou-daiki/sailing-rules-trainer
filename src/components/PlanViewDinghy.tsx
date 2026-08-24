import { BOAT_CLASS_SPECS, type BoatClass } from '../domain/boatClass'

interface PlanViewDinghyProps {
  boatClass: BoatClass
  tack: 'port' | 'starboard'
  x?: number
  y?: number
  heading?: number
  scale?: number
  testId?: string
}

interface DinghyGeometry {
  bowY: number
  sternY: number
  halfBeam: number
  transomHalf: number
  breakwaterY: number
  mastY: number
  shroudY: number
  caseFrontY: number
  caseAftY: number
  trackY: number
  cockpitFrontHalf: number
  cockpitMidHalf: number
  cockpitAftHalf: number
  boomX: number
  boomY: number
}

const geometryByClass: Record<BoatClass, DinghyGeometry> = {
  '420': {
    bowY: -38,
    sternY: 32,
    halfBeam: 13.5,
    transomHalf: 10,
    breakwaterY: -20.5,
    mastY: -16,
    shroudY: -10.5,
    caseFrontY: -10,
    caseAftY: 8.5,
    trackY: 8,
    cockpitFrontHalf: 7.1,
    cockpitMidHalf: 7.8,
    cockpitAftHalf: 4.2,
    boomX: 22,
    boomY: 22,
  },
  '470': {
    bowY: -40,
    sternY: 34,
    halfBeam: 12.8,
    transomHalf: 9.2,
    breakwaterY: -16.5,
    mastY: -14,
    shroudY: -9,
    caseFrontY: -9.5,
    caseAftY: 14,
    trackY: 9.5,
    cockpitFrontHalf: 6.8,
    cockpitMidHalf: 7.2,
    cockpitAftHalf: 4.1,
    boomX: 23,
    boomY: 23,
  },
}

/**
 * International 420 / 470 seen from directly above.
 * The bow points towards negative Y; heading rotates that bow clockwise.
 * Hull/deck proportions follow the official World Sailing building specifications.
 */
export function PlanViewDinghy({
  boatClass,
  tack,
  x = 0,
  y = 0,
  heading = 0,
  scale = 1,
  testId,
}: PlanViewDinghyProps) {
  const spec = BOAT_CLASS_SPECS[boatClass]
  const geometry = geometryByClass[boatClass]
  const {
    bowY,
    sternY,
    halfBeam,
    transomHalf,
    breakwaterY,
    mastY,
    shroudY,
    caseFrontY,
    caseAftY,
    trackY,
    cockpitFrontHalf,
    cockpitMidHalf,
    cockpitAftHalf,
    boomX,
    boomY,
  } = geometry
  const sailSide = tack === 'port' ? 'starboard' : 'port'
  const side = tack === 'port' ? 1 : -1
  const sailTestId = testId ? `sail-${testId}` : undefined
  const jibTestId = testId ? `jib-${testId}` : undefined
  const breakwaterCrown = boatClass === '420' ? breakwaterY - 3 : breakwaterY - 1.4
  const outerShoulderY = boatClass === '420' ? -10 : -8

  return (
    <g
      className={`plan-dinghy plan-dinghy--${boatClass} is-${tack}`}
      transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`}
      data-model="plan-view-dinghy"
      data-boat-class={boatClass}
      data-hull-length-mm={spec.lengthMm}
      data-hull-beam-mm={spec.beamMm}
      data-tack={tack}
      data-testid={testId}
    >
      <path
        d={`M0 ${bowY} C6 ${bowY + 2} ${halfBeam - 1.2} ${bowY + 13} ${halfBeam} ${outerShoulderY} L${halfBeam} ${sternY - 9} Q${halfBeam - 0.2} ${sternY - 2} ${transomHalf} ${sternY} H${-transomHalf} Q${-halfBeam + 0.2} ${sternY - 2} ${-halfBeam} ${sternY - 9} L${-halfBeam} ${outerShoulderY} C${-halfBeam + 1.2} ${bowY + 13} -6 ${bowY + 2} 0 ${bowY}Z`}
        className="plan-dinghy__hull"
        data-boat-part="hull"
      />

      <path
        d={`M0 ${bowY + 1} C5 ${bowY + 4} ${halfBeam - 2} ${bowY + 13} ${halfBeam - 0.8} ${breakwaterY} Q0 ${breakwaterCrown} ${-halfBeam + 0.8} ${breakwaterY} C${-halfBeam + 2} ${bowY + 13} -5 ${bowY + 4} 0 ${bowY + 1}Z`}
        className="plan-dinghy__foredeck"
        data-boat-part="foredeck"
      />

      <path
        d={`M${-halfBeam + 0.7} ${breakwaterY + 0.5} L${-halfBeam + 0.7} ${sternY - 9} Q${-halfBeam + 0.8} ${sternY - 2.6} ${-transomHalf + 0.8} ${sternY - 1.4} L${-cockpitAftHalf} ${sternY - 2.8} Q${-cockpitMidHalf} 5 ${-cockpitFrontHalf} ${breakwaterY + 2.3}Z`}
        className="plan-dinghy__side-tank"
        data-boat-part="side-tank-port"
      />
      <path
        d={`M${halfBeam - 0.7} ${breakwaterY + 0.5} L${halfBeam - 0.7} ${sternY - 9} Q${halfBeam - 0.8} ${sternY - 2.6} ${transomHalf - 0.8} ${sternY - 1.4} L${cockpitAftHalf} ${sternY - 2.8} Q${cockpitMidHalf} 5 ${cockpitFrontHalf} ${breakwaterY + 2.3}Z`}
        className="plan-dinghy__side-tank"
        data-boat-part="side-tank-starboard"
      />

      <path
        d={`M${-cockpitFrontHalf} ${breakwaterY + 2.3} Q${-cockpitMidHalf} 4 ${-cockpitAftHalf} ${sternY - 2.8} Q0 ${sternY - 0.8} ${cockpitAftHalf} ${sternY - 2.8} Q${cockpitMidHalf} 4 ${cockpitFrontHalf} ${breakwaterY + 2.3} Q0 ${breakwaterY + 5.2} ${-cockpitFrontHalf} ${breakwaterY + 2.3}Z`}
        className="plan-dinghy__cockpit"
        data-boat-part="cockpit"
      />

      <path
        d={`M${-halfBeam + 0.8} ${breakwaterY} Q0 ${breakwaterCrown} ${halfBeam - 0.8} ${breakwaterY}`}
        className="plan-dinghy__breakwater"
        data-boat-part="breakwater"
      />
      <circle cx={-halfBeam + 3.1} cy="5" r="1.7" className="plan-dinghy__inspection-port" data-boat-part="inspection-port-port" />
      <circle cx={halfBeam - 3.1} cy="5" r="1.7" className="plan-dinghy__inspection-port" data-boat-part="inspection-port-starboard" />

      <rect
        x="-2.8"
        y={caseFrontY}
        width="5.6"
        height={caseAftY - caseFrontY}
        rx="1.2"
        className="plan-dinghy__centreboard-case"
        data-boat-part="centreboard-case"
      />
      <path
        d={`M-1.7 ${caseFrontY + 7} H1.7 V${caseAftY - 1.4} H-1.7Z`}
        className="plan-dinghy__centreboard"
        data-boat-part="centreboard"
      />
      <path
        d={`M${-cockpitMidHalf - 0.4} ${trackY} H${cockpitMidHalf + 0.4}`}
        className="plan-dinghy__mainsheet-track"
        data-boat-part="mainsheet-track"
      />
      <path d={`M-4 ${trackY + 3} V${sternY - 5}`} className="plan-dinghy__hiking-strap" data-boat-part="hiking-strap-port" />
      <path d={`M4 ${trackY + 3} V${sternY - 5}`} className="plan-dinghy__hiking-strap" data-boat-part="hiking-strap-starboard" />

      <path
        d={`M-7 ${breakwaterY + 3.2} Q-4.3 ${breakwaterY + 2.5} -3.5 ${breakwaterY + 6.7} L-7.1 ${breakwaterY + 8.5}Z`}
        className="plan-dinghy__spinnaker-bag"
        data-boat-part="spinnaker-bag-port"
      />
      <path
        d={`M7 ${breakwaterY + 3.2} Q4.3 ${breakwaterY + 2.5} 3.5 ${breakwaterY + 6.7} L7.1 ${breakwaterY + 8.5}Z`}
        className="plan-dinghy__spinnaker-bag"
        data-boat-part="spinnaker-bag-starboard"
      />
      <path
        d={`M-5.2 ${breakwaterY + 8} L-5.2 ${sternY - 6}`}
        className="plan-dinghy__spinnaker-pole"
        data-boat-part="spinnaker-pole"
      />

      <path d={`M0 ${bowY + 2} V${mastY}`} className="plan-dinghy__forestay" data-boat-part="forestay" />
      <path d={`M0 ${mastY} L${-halfBeam + 1} ${shroudY}`} className="plan-dinghy__shroud" data-boat-part="shroud-port" />
      <path d={`M0 ${mastY} L${halfBeam - 1} ${shroudY}`} className="plan-dinghy__shroud" data-boat-part="shroud-starboard" />
      <path d={`M0 ${mastY} L${-halfBeam - 2.7} 1`} className="plan-dinghy__trapeze" data-boat-part="trapeze-port" />
      <path d={`M0 ${mastY} L${halfBeam + 2.7} 1`} className="plan-dinghy__trapeze" data-boat-part="trapeze-starboard" />
      <circle cx={-halfBeam - 2.7} cy="1" r="1.1" className="plan-dinghy__trapeze-ring" aria-hidden="true" />
      <circle cx={halfBeam + 2.7} cy="1" r="1.1" className="plan-dinghy__trapeze-ring" aria-hidden="true" />

      <path
        d={`M0 ${bowY + 3} C${2.6 * side} ${bowY + 8} ${9 * side} ${mastY - 3} ${11 * side} ${mastY + 7} Q${7 * side} ${mastY + 1} 0 ${mastY}Z`}
        className="plan-dinghy__jib"
        data-boat-part="jib"
        data-sail-side={sailSide}
        data-testid={jibTestId}
      />
      <path
        d={`M0 ${mastY} C${9 * side} ${mastY + 7} ${(boatClass === '420' ? 26 : 27) * side} 8 ${boomX * side} ${boomY} L0 ${mastY}Z`}
        className="plan-dinghy__sail"
        data-boat-part="mainsail"
        data-sail-side={sailSide}
        data-testid={sailTestId}
      />
      <path
        d={`M${5.5 * side} ${mastY + 7} Q${17 * side} 7 ${boomX * side} ${boomY - 2}`}
        className="plan-dinghy__sail-seam"
        aria-hidden="true"
      />
      <path d={`M0 ${mastY} L${boomX * side} ${boomY}`} className="plan-dinghy__boom" data-boat-part="boom" />
      <circle cx="0" cy={mastY} r="2.4" className="plan-dinghy__mast" data-boat-part="mast" />
      <circle cx={boomX * side} cy={boomY} r="1.4" className="plan-dinghy__clew" aria-hidden="true" />

      <path d={`M0 ${sternY} V${sternY + 12}`} className="plan-dinghy__rudder" data-boat-part="rudder" />
      <path d={`M0 ${sternY + 1} V${sternY - 9}`} className="plan-dinghy__tiller" aria-hidden="true" />
      <path d={`M0 ${bowY + 2} V${sternY - 1}`} className="plan-dinghy__centreline" aria-hidden="true" />
      <text x="0" y={sternY - 3.4} textAnchor="middle" className="plan-dinghy__class-mark" aria-hidden="true">
        {boatClass}
      </text>
    </g>
  )
}
