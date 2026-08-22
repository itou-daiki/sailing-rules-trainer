import { describe, expect, it } from 'vitest'
import { quizQuestions, skillDefinitions } from '../data/content'
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  completeDiagnostic,
  createEmptyProgress,
  getDashboardStats,
  getSkillStats,
  loadProgress,
  parseProgress,
  recordAnswer,
  selectPracticeQuestions,
} from './learningEngine'

describe('learningEngine', () => {
  it('破損した保存データは空の記録として扱う', () => {
    expect(parseProgress('{broken')).toEqual(createEmptyProgress())
    expect(parseProgress('{"version":1,"answers":{}}')).toEqual(createEmptyProgress())
  })

  it('v1の学習記録をv2へ移行する', () => {
    const storage = {
      getItem: (key: string) =>
        key === STORAGE_KEY
          ? null
          : key === LEGACY_STORAGE_KEY
            ? JSON.stringify({
                version: 1,
                answers: {
                  'q-r10-port-starboard': {
                    attempts: 2,
                    correct: 1,
                    lastAnswered: '2026-08-20T00:00:00.000Z',
                  },
                },
                studyDays: ['2026-08-20'],
              })
            : null,
    }

    const migrated = loadProgress(storage)
    expect(migrated.version).toBe(2)
    expect(migrated.answers['q-r10-port-starboard']).toMatchObject({
      attempts: 2,
      correct: 1,
      correctStreak: 0,
    })
  })

  it('正誤・確信度・次回復習日を記録する', () => {
    const answeredAt = new Date('2026-08-22T01:00:00Z')
    const first = recordAnswer(
      createEmptyProgress(),
      'q-r10-port-starboard',
      { isCorrect: false, confidence: 'sure' },
      answeredAt,
    )
    const second = recordAnswer(
      first,
      'q-r10-port-starboard',
      { isCorrect: true, confidence: 'unsure' },
      answeredAt,
    )
    const record = second.answers['q-r10-port-starboard']

    expect(record).toMatchObject({
      attempts: 2,
      correct: 1,
      correctStreak: 1,
      highConfidenceErrors: 1,
      confidenceCounts: { sure: 1, unsure: 1, guess: 0 },
    })
    expect(new Date(record?.dueAt ?? 0).getTime()).toBeGreaterThan(answeredAt.getTime())
  })

  it('期限が来た問題と未回答問題を優先する', () => {
    let progress = createEmptyProgress()
    for (const question of quizQuestions.slice(0, 6)) {
      progress = recordAnswer(
        progress,
        question.id,
        { isCorrect: true, confidence: 'sure' },
        new Date('2026-08-22T00:00:00Z'),
      )
    }

    const selected = selectPracticeQuestions(quizQuestions, progress, {
      size: 5,
      seed: 'fixed',
      now: new Date('2026-08-22T01:00:00Z'),
    })

    expect(selected).toHaveLength(5)
    expect(selected.some((question) => !progress.answers[question.id])).toBe(true)
  })

  it('診断では5領域から1問ずつ選ぶ', () => {
    const selected = selectPracticeQuestions(quizQuestions, createEmptyProgress(), {
      size: 5,
      seed: 'diagnostic',
      diagnostic: true,
    })

    expect(selected).toHaveLength(5)
    expect(new Set(selected.map((question) => question.skill)).size).toBe(skillDefinitions.length)
  })

  it('指定した領域だけのコース練習を作れる', () => {
    const selected = selectPracticeQuestions(quizQuestions, createEmptyProgress(), {
      skills: ['right-of-way'],
      size: 5,
      seed: 'course',
    })

    expect(selected).toHaveLength(5)
    expect(selected.every((question) => question.skill === 'right-of-way')).toBe(true)
  })

  it('診断結果から推奨コースを設定する', () => {
    const progress = completeDiagnostic(createEmptyProgress(), 2, 5, new Date('2026-08-22'))
    expect(progress.diagnostic?.recommendedCourseId).toBe('signal-watch')
  })

  it('ダッシュボードと領域別習熟度を集計する', () => {
    let progress = createEmptyProgress()
    progress = recordAnswer(progress, 'q-r10-port-starboard', true, new Date('2026-08-20'))
    progress = recordAnswer(progress, 'q-r10-port-starboard', true, new Date('2026-08-21'))

    expect(getDashboardStats(progress, new Date('2026-08-22'))).toMatchObject({
      answered: 1,
      attempts: 2,
      accuracy: 100,
      mastered: 1,
      currentStreak: 2,
    })
    expect(getSkillStats(progress, quizQuestions)).toHaveLength(skillDefinitions.length)
  })
})
