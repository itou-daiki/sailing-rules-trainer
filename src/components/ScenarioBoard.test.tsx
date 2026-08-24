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

    expect(screen.getByTestId('A')).toHaveAttribute('data-model', 'plan-view-dinghy')
    expect(screen.getByTestId('B')).toHaveAttribute('data-model', 'plan-view-dinghy')
    expect(screen.getByTestId('sail-A')).toHaveAttribute('data-sail-side', 'starboard')
    expect(screen.getByTestId('sail-B')).toHaveAttribute('data-sail-side', 'port')
  })

  it('障害物問題では防波堤と通過できる側を図示する', () => {
    const diagram: ScenarioDiagram = {
      windDirection: 'north',
      obstruction: { x: 82, y: 50, width: 18, height: 72, label: '防波堤' },
      boats: [
        { id: 'A', label: '内側艇', x: 58, y: 58, heading: 0, tack: 'starboard' },
        { id: 'B', label: '外側艇', x: 35, y: 58, heading: 0, tack: 'starboard' },
      ],
    }

    render(<ScenarioBoard diagram={diagram} />)

    expect(screen.getByRole('img', { name: /防波堤/ })).toBeInTheDocument()
    expect(screen.getByText('防波堤')).toBeInTheDocument()
  })
})
