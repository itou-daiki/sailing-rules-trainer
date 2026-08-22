import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SignalLibrary } from './SignalLibrary'

afterEach(cleanup)

describe('信号旗一覧', () => {
  it('公式レース信号26パターンと数字旗1〜9を案内する', () => {
    render(<SignalLibrary onPractice={vi.fn()} />)

    expect(screen.getByLabelText('収録範囲')).toHaveTextContent('26')
    expect(screen.getByText('AP＋数字旗1–9')).toBeInTheDocument()
    expect(screen.getByText('数字旗 1〜9 は、数字と延期時間が同じです。')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /数字旗 [1-9] の図/ })).toHaveLength(9)
    expect(document.querySelectorAll('.signal-row')).toHaveLength(26)
  })

  it('スタート前の信号だけに絞り込める', () => {
    render(<SignalLibrary onPractice={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /スタート前/ }))

    expect(screen.getByText('AP＋H旗')).toBeInTheDocument()
    expect(screen.getByText('Z旗')).toBeInTheDocument()
    expect(screen.queryByText('N＋A旗')).not.toBeInTheDocument()
  })
})
