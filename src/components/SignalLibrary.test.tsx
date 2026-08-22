import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SignalLibrary } from './SignalLibrary'

afterEach(cleanup)

describe('信号旗一覧', () => {
  it('基本26パターンと追加信号5種、数字旗1〜9を案内する', () => {
    render(<SignalLibrary onPractice={vi.fn()} />)

    expect(screen.getByLabelText('収録範囲')).toHaveTextContent('31')
    expect(screen.getByText('付則・大会文書の追加信号')).toBeInTheDocument()
    expect(screen.getByText('O旗（規則42の緩和）')).toBeInTheDocument()
    expect(screen.getByText('AP＋数字旗1–9')).toBeInTheDocument()
    expect(screen.getByText('数字旗 1〜9 は、数字と延期時間が同じです。')).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /数字旗 [1-9] の図/ })).toHaveLength(9)
    expect(document.querySelectorAll('.signal-row')).toHaveLength(31)
  })

  it('スタート前の信号だけに絞り込める', () => {
    render(<SignalLibrary onPractice={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /スタート前/ }))

    expect(screen.getByText('AP＋H旗')).toBeInTheDocument()
    expect(screen.getByText('Z旗')).toBeInTheDocument()
    expect(screen.queryByText('N＋A旗')).not.toBeInTheDocument()
  })

  it('追加信号だけに絞り込み、基本信号と区別する', () => {
    render(<SignalLibrary onPractice={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /追加信号/ }))

    expect(screen.getByText('O旗（規則42の緩和）')).toBeInTheDocument()
    expect(screen.getByText('D旗（出艇開始・大会指定）')).toBeInTheDocument()
    expect(screen.queryByText('回答旗')).not.toBeInTheDocument()
    expect(document.querySelectorAll('.signal-row')).toHaveLength(5)
  })
})
