import { describe, expect, it } from 'vitest'
import { coreRules, quizQuestions, raceSignals, skillDefinitions } from './content'

describe('教材データ', () => {
  it('32問すべてに一意なIDと有効な正解を持つ', () => {
    expect(quizQuestions).toHaveLength(32)
    expect(new Set(quizQuestions.map((question) => question.id)).size).toBe(32)

    for (const question of quizQuestions) {
      expect(question.choices.length).toBeGreaterThanOrEqual(2)
      expect(question.correctIndex).toBeGreaterThanOrEqual(0)
      expect(question.correctIndex).toBeLessThan(question.choices.length)
      expect(question.points.length).toBeGreaterThanOrEqual(2)
      expect(question.conclusion.trim()).not.toBe('')
      expect(question.formal.trim()).not.toBe('')

      if (question.choiceFeedback) {
        expect(question.choiceFeedback).toHaveLength(question.choices.length)
      }
    }
  })

  it('16種の信号旗を各1問で確認できる', () => {
    const signalQuestionFlagIds = quizQuestions
      .filter((question) => question.category === 'signal')
      .map((question) => question.flagId)

    expect(signalQuestionFlagIds).toHaveLength(raceSignals.length)
    expect(new Set(signalQuestionFlagIds)).toEqual(
      new Set(raceSignals.map((signal) => signal.id)),
    )
  })

  it('5領域と規則10〜17を問題バンクで扱う', () => {
    const coveredSkills = new Set(quizQuestions.map((question) => question.skill))
    const formalReferences = quizQuestions.map((question) => question.formal).join(' ')

    expect(coveredSkills).toEqual(new Set(skillDefinitions.map((skill) => skill.id)))
    for (const rule of coreRules) {
      expect(formalReferences).toContain(`規則${rule.number}`)
      expect(rule.example.trim()).not.toBe('')
    }
  })
})
