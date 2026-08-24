import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BeginnerRuleGuide } from './BeginnerRuleGuide'

afterEach(cleanup)

describe('初心者向けタック図', () => {
  it('風向と、左右で異なる帆の位置を説明する', () => {
    render(
      <BeginnerRuleGuide
        boatClass="420"
        onBoatClassChange={vi.fn()}
        onPractice={vi.fn()}
      />,
    )

    expect(screen.getByRole('img', { name: '上から下へ吹く風' })).toBeInTheDocument()

    const portBoat = screen.getByRole('img', {
      name: '420艇。風を左舷側から受け、帆が右舷側にあるポートタック艇',
    })
    const starboardBoat = screen.getByRole('img', {
      name: '420艇。風を右舷側から受け、帆が左舷側にあるスターボードタック艇',
    })

    expect(portBoat.querySelector('[data-model="plan-view-dinghy"]')).toBeInTheDocument()
    expect(starboardBoat.querySelector('[data-model="plan-view-dinghy"]')).toBeInTheDocument()
    expect(portBoat.querySelector('[data-boat-part="mainsail"]')).toHaveAttribute(
      'data-sail-side',
      'starboard',
    )
    expect(starboardBoat.querySelector('[data-boat-part="mainsail"]')).toHaveAttribute(
      'data-sail-side',
      'port',
    )
    expect(portBoat.querySelector('[data-boat-part="cockpit"]')).toBeInTheDocument()
    expect(portBoat.querySelector('[data-boat-part="rudder"]')).toBeInTheDocument()
    expect(portBoat.querySelector('[data-boat-part="jib"]')).toBeInTheDocument()
    expect(portBoat.querySelector('[data-model="plan-view-dinghy"]')).toHaveAttribute(
      'data-boat-class',
      '420',
    )
    expect(screen.getByText('International 420')).toBeInTheDocument()
  })

  it('420と470を切り替えられる', () => {
    const onBoatClassChange = vi.fn()
    render(
      <BeginnerRuleGuide
        boatClass="420"
        onBoatClassChange={onBoatClassChange}
        onPractice={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '420を表示' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '470を表示' })).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(screen.getByRole('button', { name: '470を表示' }))

    expect(onBoatClassChange).toHaveBeenCalledWith('470')
  })

  it('図の下から状況問題へ進める', () => {
    const onPractice = vi.fn()
    render(
      <BeginnerRuleGuide
        boatClass="420"
        onBoatClassChange={vi.fn()}
        onPractice={onPractice}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '図を見て状況問題を解く' }))

    expect(onPractice).toHaveBeenCalledOnce()
  })
})
