import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { QuizQuestion } from '../data/content'
import { PracticeSession } from './PracticeSession'

afterEach(cleanup)

const question: QuizQuestion = {
  id: 'test-signal',
  category: 'signal',
  skill: 'start-signals',
  difficulty: 1,
  flagId: 'x',
  prompt: 'この旗の意味は？',
  choices: ['個別リコール', 'コース短縮', '延期'],
  correctIndex: 0,
  conclusion: '個別リコールです。',
  points: ['X旗を確認する'],
  formal: '規則29.1',
}

const observationQuestion: QuizQuestion = {
  id: 'test-observation',
  category: 'rule',
  skill: 'right-of-way',
  difficulty: 1,
  prompt: '避ける艇は？',
  choices: ['A艇', 'B艇', '両艇'],
  correctIndex: 0,
  conclusion: 'A艇が避けます。',
  points: ['先にタックを見る'],
  formal: '規則10',
  observation: {
    prompt: '2艇の関係は？',
    choices: ['反対タック', '同一タック', 'タック中'],
    correctIndex: 0,
    feedback: ['反対タックです。', '先にタックを見直します。', '両艇とも直進中です。'],
  },
}

describe('PracticeSession', () => {
  it('選択後に正誤と3段階の解説を表示する', () => {
    const onAnswer = vi.fn()
    render(
      <PracticeSession
        questions={[question]}
        onAnswer={onAnswer}
        onFinish={vi.fn()}
        onRetry={vi.fn()}
      />,
    )

    expect(screen.getByText('Created by Dit-Lab.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /個別リコール/ }))
    fireEvent.click(screen.getByRole('button', { name: /自信あり/ }))

    expect(onAnswer).toHaveBeenCalledWith('test-signal', {
      isCorrect: true,
      confidence: 'sure',
    })
    expect(screen.getByText('正解')).toBeInTheDocument()
    expect(screen.getByText('結論')).toBeInTheDocument()
    expect(screen.getByText('見るポイント')).toBeInTheDocument()
    expect(screen.getByText('正式な用語')).toBeInTheDocument()
  })

  it('答える前に判断材料を確認し、その正誤も記録する', () => {
    const onAnswer = vi.fn()
    const onComplete = vi.fn()
    render(
      <PracticeSession
        questions={[observationQuestion]}
        onAnswer={onAnswer}
        onComplete={onComplete}
        onFinish={vi.fn()}
        onRetry={vi.fn()}
      />,
    )

    expect(screen.queryByRole('button', { name: /A艇/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /同一タック/ }))
    expect(screen.getByText('見る場所を修正')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /A艇/ }))
    fireEvent.click(screen.getByRole('button', { name: /自信あり/ }))

    expect(onAnswer).toHaveBeenCalledWith('test-observation', {
      isCorrect: true,
      confidence: 'sure',
      observationCorrect: false,
    })

    fireEvent.click(screen.getByRole('button', { name: '結果を見る' }))
    expect(onComplete).toHaveBeenCalledWith(1, 1, ['right-of-way'])
  })
})
