import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TeamChallenge } from './TeamChallenge'

afterEach(cleanup)

describe('TeamChallenge', () => {
  it('選んだテーマから共通セットを作って開始できる', () => {
    const onStart = vi.fn()
    const onCodeChange = vi.fn()
    render(
      <TeamChallenge
        onStart={onStart}
        onCodeChange={onCodeChange}
        onBack={() => undefined}
        createCode={() => 'SG-ABC234'}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /共通の6問を作る/ }))
    expect(screen.getByText('SG-ABC234')).toBeInTheDocument()
    expect(onCodeChange).toHaveBeenCalledWith('SG-ABC234')

    fireEvent.click(screen.getByRole('button', { name: /一人で回答を始める/ }))
    expect(onStart).toHaveBeenCalledWith({
      code: 'SG-ABC234',
      courseId: 'signal-watch',
      seed: 'SG-ABC234',
    })
  })

  it('共有コードを小文字で入力しても同じセットへ入れる', () => {
    const onStart = vi.fn()
    render(
      <TeamChallenge
        onStart={onStart}
        onCodeChange={() => undefined}
        onBack={() => undefined}
      />,
    )

    fireEvent.change(screen.getByLabelText('6文字のセット番号'), {
      target: { value: 'mr-abc234' },
    })
    fireEvent.click(screen.getByRole('button', { name: '同じ問題へ入る' }))
    expect(screen.getByText('MR-ABC234')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /一人で回答を始める/ }))
    expect(onStart).toHaveBeenCalledWith({
      code: 'MR-ABC234',
      courseId: 'mark-room',
      seed: 'MR-ABC234',
    })
  })

  it('壊れたコードには入力例を示す', () => {
    render(
      <TeamChallenge
        onStart={() => undefined}
        onCodeChange={() => undefined}
        onBack={() => undefined}
      />,
    )

    fireEvent.change(screen.getByLabelText('6文字のセット番号'), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: '同じ問題へ入る' }))
    expect(screen.getByText('コードを確認してください。例：MR-ABC234')).toBeInTheDocument()
  })
})
