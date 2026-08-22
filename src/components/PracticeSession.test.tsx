import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { QuizQuestion } from '../data/content'
import { PracticeSession } from './PracticeSession'

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
})
