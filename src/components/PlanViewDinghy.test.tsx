import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlanViewDinghy } from './PlanViewDinghy'

describe('PlanViewDinghy', () => {
  it('艇体・艤装・風下へ開く帆を上面図として描く', () => {
    const { container } = render(
      <svg>
        <PlanViewDinghy boatClass="420" tack="port" testId="port-dinghy" />
        <PlanViewDinghy boatClass="470" tack="starboard" testId="starboard-dinghy" x={80} />
      </svg>,
    )

    for (const part of [
      'hull',
      'foredeck',
      'breakwater',
      'cockpit',
      'side-tank-port',
      'side-tank-starboard',
      'centreboard-case',
      'centreboard',
      'rudder',
      'mast',
      'boom',
      'mainsail',
      'jib',
      'forestay',
      'shroud-port',
      'shroud-starboard',
      'mainsheet-track',
      'spinnaker-bag-port',
      'spinnaker-bag-starboard',
      'spinnaker-pole',
    ]) {
      expect(container.querySelectorAll(`[data-boat-part="${part}"]`)).toHaveLength(2)
    }

    expect(screen.getByTestId('port-dinghy')).toHaveAttribute('data-model', 'plan-view-dinghy')
    expect(screen.getByTestId('starboard-dinghy')).toHaveAttribute('data-model', 'plan-view-dinghy')
    expect(screen.getByTestId('port-dinghy')).toHaveAttribute('data-boat-class', '420')
    expect(screen.getByTestId('port-dinghy')).toHaveAttribute('data-hull-length-mm', '4200')
    expect(screen.getByTestId('port-dinghy')).toHaveAttribute('data-hull-beam-mm', '1630')
    expect(screen.getByTestId('starboard-dinghy')).toHaveAttribute('data-boat-class', '470')
    expect(screen.getByTestId('starboard-dinghy')).toHaveAttribute('data-hull-length-mm', '4700')
    expect(screen.getByTestId('starboard-dinghy')).toHaveAttribute('data-hull-beam-mm', '1700')
    expect(screen.getByTestId('sail-port-dinghy')).toHaveAttribute('data-sail-side', 'starboard')
    expect(screen.getByTestId('sail-starboard-dinghy')).toHaveAttribute('data-sail-side', 'port')
    expect(screen.getByTestId('jib-port-dinghy')).toHaveAttribute('data-sail-side', 'starboard')
    expect(screen.getByTestId('jib-starboard-dinghy')).toHaveAttribute('data-sail-side', 'port')
  })

  it('帆のドラフトがブームより風下側へ張り出す', () => {
    render(
      <svg>
        <PlanViewDinghy boatClass="420" tack="port" testId="draft-port" />
        <PlanViewDinghy boatClass="470" tack="starboard" testId="draft-starboard" x={80} />
      </svg>,
    )

    expect(screen.getByTestId('sail-draft-port')).toHaveAttribute(
      'd',
      'M0 -16 C9 -9 26 8 22 22 L0 -16Z',
    )
    expect(screen.getByTestId('sail-draft-starboard')).toHaveAttribute(
      'd',
      'M0 -14 C-9 -7 -27 8 -23 23 L0 -14Z',
    )
  })
})
