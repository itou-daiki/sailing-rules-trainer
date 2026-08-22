import { describe, expect, it } from 'vitest'
import { quizQuestions } from '../data/content'
import {
  createEmptyProgress,
  getDashboardStats,
  parseProgress,
  recordAnswer,
  selectPracticeQuestions,
} from './learningEngine'

describe('learningEngine', () => {
  it('破損した保存データは空の記録として扱う', () => {
    expect(parseProgress('{broken')).toEqual(createEmptyProgress())
    expect(parseProgress('{"version":2,"answers":{}}')).toEqual(createEmptyProgress())
  })

  it('解答回数・正解数・学習日を記録する', () => {
    const first = recordAnswer(
      createEmptyProgress(),
      'q-r10-port-starboard',
      false,
      new Date('2026-08-22T01:00:00Z'),
    )
    const second = recordAnswer(
      first,
      'q-r10-port-starboard',
      true,
      new Date('2026-08-22T02:00:00Z'),
    )

    expect(second.answers['q-r10-port-starboard']).toMatchObject({
      attempts: 2,
      correct: 1,
    })
    expect(second.studyDays).toHaveLength(1)
  })

  it('未回答と苦手問題を優先して選ぶ', () => {
    let progress = createEmptyProgress()
    for (const question of quizQuestions.slice(0, 5)) {
      progress = recordAnswer(progress, question.id, true, new Date('2026-08-20T00:00:00Z'))
      progress = recordAnswer(progress, question.id, true, new Date('2026-08-21T00:00:00Z'))
    }

    const selected = selectPracticeQuestions(quizQuestions, progress, {
      size: 5,
      seed: 'fixed',
    })

    expect(selected).toHaveLength(5)
    expect(selected.every((question) => !progress.answers[question.id])).toBe(true)
  })

  it('カテゴリを限定できる', () => {
    const selected = selectPracticeQuestions(quizQuestions, createEmptyProgress(), {
      category: 'rule',
      size: 4,
      seed: 'fixed',
    })

    expect(selected).toHaveLength(4)
    expect(selected.every((question) => question.category === 'rule')).toBe(true)
  })

  it('総合練習には信号旗とルールの両方を含める', () => {
    const selected = selectPracticeQuestions(quizQuestions, createEmptyProgress(), {
      size: 5,
      seed: 'fixed',
    })

    expect(new Set(selected.map((question) => question.category))).toEqual(
      new Set(['signal', 'rule']),
    )
  })

  it('正答率・習得数・連続学習日を集計する', () => {
    let progress = createEmptyProgress()
    progress = recordAnswer(progress, 'q1', true, new Date('2026-08-21T03:00:00Z'))
    progress = recordAnswer(progress, 'q1', true, new Date('2026-08-22T03:00:00Z'))
    progress = recordAnswer(progress, 'q2', false, new Date('2026-08-22T04:00:00Z'))

    expect(getDashboardStats(progress, new Date('2026-08-22T12:00:00+09:00'))).toMatchObject({
      answered: 2,
      attempts: 3,
      accuracy: 67,
      mastered: 1,
      currentStreak: 2,
    })
  })
})
