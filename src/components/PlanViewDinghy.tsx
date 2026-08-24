interface PlanViewDinghyProps {
  tack: 'port' | 'starboard'
  x?: number
  y?: number
  heading?: number
  scale?: number
  testId?: string
}

/**
 * A class-neutral single-sail dinghy seen from directly above.
 * The bow points towards negative Y; heading rotates that bow clockwise.
 */
export function PlanViewDinghy({
  tack,
  x = 0,
  y = 0,
  heading = 0,
  scale = 1,
  testId,
}: PlanViewDinghyProps) {
  const sailSide = tack === 'port' ? 'starboard' : 'port'
  const side = tack === 'port' ? 1 : -1
  const boomX = 19 * side
  const sailTestId = testId ? `sail-${testId}` : undefined

  return (
    <g
      className={`plan-dinghy is-${tack}`}
      transform={`translate(${x} ${y}) rotate(${heading}) scale(${scale})`}
      data-model="plan-view-dinghy"
      data-tack={tack}
      data-testid={testId}
    >
      <path
        d="M0 -31 C7 -28 11 -17 12 -2 L11 20 L8 28 H-8 L-11 20 L-12 -2 C-11 -17 -7 -28 0 -31Z"
        className="plan-dinghy__hull"
        data-boat-part="hull"
      />
      <path
        d="M0 -28 C6 -24 8 -17 9 -7 H-9 C-8 -17 -6 -24 0 -28Z"
        className="plan-dinghy__foredeck"
        data-boat-part="foredeck"
      />
      <path
        d="M-8 2 Q-8 -2 -4 -3 H4 Q8 -2 8 2 V20 Q8 24 4 24 H-4 Q-8 24 -8 20Z"
        className="plan-dinghy__cockpit"
        data-boat-part="cockpit"
      />
      <path d="M0 -27 V26" className="plan-dinghy__centreline" aria-hidden="true" />
      <path
        d="M-1.8 6 H1.8 V18 H-1.8Z"
        className="plan-dinghy__centreboard"
        data-boat-part="centreboard"
      />
      <path d="M0 26 V36" className="plan-dinghy__rudder" data-boat-part="rudder" />
      <path d="M0 27 L0 15" className="plan-dinghy__tiller" aria-hidden="true" />
      <path
        d={`M0 -8 C${8 * side} -1 ${23 * side} 10 ${boomX} 20 L0 -8Z`}
        className="plan-dinghy__sail"
        data-boat-part="mainsail"
        data-sail-side={sailSide}
        data-testid={sailTestId}
      />
      <path
        d={`M${5 * side} -1 Q${16 * side} 8 ${19 * side} 18`}
        className="plan-dinghy__sail-seam"
        aria-hidden="true"
      />
      <path
        d={`M0 -8 L${boomX} 20`}
        className="plan-dinghy__boom"
        data-boat-part="boom"
      />
      <circle cx="0" cy="-8" r="2.4" className="plan-dinghy__mast" data-boat-part="mast" />
      <circle cx={boomX} cy="20" r="1.4" className="plan-dinghy__clew" aria-hidden="true" />
    </g>
  )
}
