import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BeginnerRuleGuide } from './BeginnerRuleGuide'

afterEach(cleanup)

describe('初心者向けタック図', () => {
  it('風向と、左右で異なる帆の位置を説明する', () => {
    render(<BeginnerRuleGuide onPractice={vi.fn()} />)

    expect(screen.getByRole('img', { name: '上から下へ吹く風' })).toBeInTheDocument()

    const portBoat = screen.getByRole('img', {
      name: '風を左舷側から受け、帆が右舷側にあるポートタック艇',
    })
    const starboardBoat = screen.getByRole('img', {
      name: '風を右舷側から受け、帆が左舷側にあるスターボードタック艇',
    })

    expect(portBoat.querySelector('.tack-boat__sail')).toHaveAttribute(
      'd',
      expect.stringContaining('L145 116'),
    )
    expect(starboardBoat.querySelector('.tack-boat__sail')).toHaveAttribute(
      'd',
      expect.stringContaining('L55 116'),
    )
  })

  it('図の下から状況問題へ進める', () => {
    const onPractice = vi.fn()
    render(<BeginnerRuleGuide onPractice={onPractice} />)

    fireEvent.click(screen.getByRole('button', { name: '図を見て状況問題を解く' }))

    expect(onPractice).toHaveBeenCalledOnce()
  })
})
