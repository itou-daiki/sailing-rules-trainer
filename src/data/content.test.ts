import { describe, expect, it } from 'vitest'
import {
  allSignals,
  coreRules,
  quizQuestions,
  raceSignals,
  skillDefinitions,
  specialSignals,
} from './content'

describe('教材データ', () => {
  it('77問すべてに一意なIDと有効な正解を持つ', () => {
    expect(quizQuestions).toHaveLength(77)
    expect(new Set(quizQuestions.map((question) => question.id)).size).toBe(77)

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
      if (question.observation) {
        expect(question.observation.choices.length).toBeGreaterThanOrEqual(2)
        expect(question.observation.feedback).toHaveLength(question.observation.choices.length)
        expect(question.observation.correctIndex).toBeLessThan(question.observation.choices.length)
      }
    }
  })

  it('基本26パターンと追加信号5種を各1問で確認できる', () => {
    const signalQuestionFlagIds = quizQuestions
      .filter((question) => question.category === 'signal')
      .map((question) => question.flagId)

    expect(signalQuestionFlagIds).toHaveLength(allSignals.length)
    expect(new Set(signalQuestionFlagIds)).toEqual(
      new Set(allSignals.map((signal) => signal.id)),
    )

    expect(raceSignals).toHaveLength(26)
    expect(specialSignals).toHaveLength(5)
    expect(allSignals).toHaveLength(31)
    const signalIds = new Set(allSignals.map((signal) => signal.id))
    for (const id of [
      'ap-h',
      'ap-a',
      'ap-numeral',
      'z',
      'n-h',
      'n-a',
      'c-starboard',
      'c-port',
      'c-shorter',
      'c-longer',
      'o-rule42',
      'r-rule42',
      'yellow-penalty',
      'red-protest',
      'd-ashore',
    ]) {
      expect(signalIds).toContain(id)
    }
  })

  it('9領域と初学者〜中級者に重要な規則を問題バンクで扱う', () => {
    const coveredSkills = new Set(quizQuestions.map((question) => question.skill))
    const formalReferences = quizQuestions.map((question) => question.formal).join(' ')

    expect(coveredSkills).toEqual(new Set(skillDefinitions.map((skill) => skill.id)))
    for (const rule of coreRules) {
      expect(formalReferences).toContain(`規則${rule.number}`)
      expect(rule.example.trim()).not.toBe('')
    }

    expect(skillDefinitions).toHaveLength(9)
    for (const skill of ['penalties', 'obstructions-safety', 'race-conduct'] as const) {
      expect(quizQuestions.filter((question) => question.skill === skill).length)
        .toBeGreaterThanOrEqual(6)
    }
    for (const ruleNumber of ['1', '3', '19', '20', '21', '22', '23', '28', '31', '40', '41', '42', '43', '44', '60']) {
      expect(formalReferences).toContain(`規則${ruleNumber}`)
    }
  })

  it('問題文・選択肢・観察ステップは規則番号の暗記を前提にしない', () => {
    const learnerFacingPrompts = quizQuestions.flatMap((question) => [
      question.prompt,
      ...question.choices,
      ...(question.observation ? [question.observation.prompt] : []),
    ])

    expect(
      learnerFacingPrompts.filter((prompt) => /規則\s*\d|part\s*2/i.test(prompt)),
    ).toEqual([])
  })
})
