import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlanViewDinghy } from './PlanViewDinghy'

describe('PlanViewDinghy', () => {
  it('艇体・艤装・風下へ開く帆を上面図として描く', () => {
    const { container } = render(
      <svg>
        <PlanViewDinghy tack="port" testId="port-dinghy" />
        <PlanViewDinghy tack="starboard" testId="starboard-dinghy" x={80} />
      </svg>,
    )

    for (const part of ['hull', 'foredeck', 'cockpit', 'centreboard', 'rudder', 'mast', 'boom']) {
      expect(container.querySelectorAll(`[data-boat-part="${part}"]`)).toHaveLength(2)
    }

    expect(screen.getByTestId('port-dinghy')).toHaveAttribute('data-model', 'plan-view-dinghy')
    expect(screen.getByTestId('starboard-dinghy')).toHaveAttribute('data-model', 'plan-view-dinghy')
    expect(screen.getByTestId('sail-port-dinghy')).toHaveAttribute('data-sail-side', 'starboard')
    expect(screen.getByTestId('sail-starboard-dinghy')).toHaveAttribute('data-sail-side', 'port')
  })
})
