import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { quizQuestions } from '../data/content'
import { learningCourses } from '../data/courses'
import { createEmptyProgress } from '../domain/learningEngine'
import { LearningPath } from './LearningPath'

afterEach(cleanup)

describe('練習コース一覧', () => {
  it('6つのレッスンを、内容が異なる艇図と一緒に案内する', () => {
    render(
      <LearningPath
        progress={createEmptyProgress()}
        questions={quizQuestions}
        onDiagnostic={vi.fn()}
        onStartCourse={vi.fn()}
        onStartIntermediate={vi.fn()}
      />,
    )

    for (const course of learningCourses) {
      expect(
        screen.getByRole('img', {
          name: `${course.title}の艇図。${course.artworkCaption}`,
        }),
      ).toBeInTheDocument()
    }
  })

  it('艇図の横から選んだコースを開始できる', () => {
    const onStartCourse = vi.fn()
    render(
      <LearningPath
        progress={createEmptyProgress()}
        questions={quizQuestions}
        onDiagnostic={vi.fn()}
        onStartCourse={onStartCourse}
        onStartIntermediate={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '旗を見て動く：6問を始める' }))

    expect(onStartCourse).toHaveBeenCalledWith(learningCourses[0])
  })

  it('反対タックの艇図はポート艇の帆を右、スターボード艇の帆を左に描く', () => {
    render(
      <LearningPath
        progress={createEmptyProgress()}
        questions={quizQuestions}
        onDiagnostic={vi.fn()}
        onStartCourse={vi.fn()}
        onStartIntermediate={vi.fn()}
      />,
    )

    const diagram = screen
      .getByRole('img', { name: /艇が出会うときの艇図/ })
      .closest('.course-boat-art')
    const portSail = diagram?.querySelector('.course-boat-art__sail.is-port')
    const starboardSail = diagram?.querySelector('.course-boat-art__sail.is-starboard')

    expect(portSail).toHaveAttribute('d', expect.stringContaining('L18 8'))
    expect(starboardSail).toHaveAttribute('d', expect.stringContaining('L-18 8'))
  })

  it('中級者はヒントなしで判断するケースへ進める', () => {
    const onStartIntermediate = vi.fn()
    render(
      <LearningPath
        progress={createEmptyProgress()}
        questions={quizQuestions}
        onDiagnostic={vi.fn()}
        onStartCourse={vi.fn()}
        onStartIntermediate={onStartIntermediate}
      />,
    )

    expect(screen.getByText('見る → 決める')).toBeInTheDocument()
    expect(screen.getByText('先に決める → 根拠を示す')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /中級ケース5問を始める/ }))
    expect(onStartIntermediate).toHaveBeenCalledOnce()
  })
})
