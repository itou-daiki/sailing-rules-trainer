import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ScenarioDiagram } from '../data/content'
import { ScenarioBoard } from './ScenarioBoard'

describe('ScenarioBoard', () => {
  it('タックに応じて帆を風下側へ描く', () => {
    const diagram: ScenarioDiagram = {
      windDirection: 'north',
      boats: [
        { id: 'A', label: 'ポート', x: 30, y: 50, heading: 30, tack: 'port' },
        { id: 'B', label: 'スターボード', x: 70, y: 50, heading: -30, tack: 'starboard' },
      ],
    }

    render(<ScenarioBoard diagram={diagram} />)

    expect(screen.getByTestId('sail-A')).toHaveAttribute('data-sail-side', 'starboard')
    expect(screen.getByTestId('sail-A')).toHaveAttribute('d', 'M0 -10 L0 9 L11 3 Z')
    expect(screen.getByTestId('sail-B')).toHaveAttribute('data-sail-side', 'port')
    expect(screen.getByTestId('sail-B')).toHaveAttribute('d', 'M0 -10 L0 9 L-11 3 Z')
  })
})
