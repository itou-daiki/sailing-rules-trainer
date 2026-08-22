import { describe, expect, it } from 'vitest'
import { ruleChanges, ruleEras, ruleEvolutionSources } from './ruleEvolution'

describe('規則の変遷と変更点データ', () => {
  it('4段階の変遷と6つの変更点を一意なIDで持つ', () => {
    expect(ruleEras).toHaveLength(4)
    expect(ruleChanges).toHaveLength(6)

    const ids = [...ruleEras, ...ruleChanges].map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('各変更点に新旧比較と艇上の行動がある', () => {
    for (const change of ruleChanges) {
      expect(change.reference.trim()).not.toBe('')
      expect(change.before.trim()).not.toBe('')
      expect(change.now.trim()).not.toBe('')
      expect(change.onWater.trim()).not.toBe('')
    }
  })

  it('根拠資料は公式HTTPSページへリンクする', () => {
    expect(ruleEvolutionSources.length).toBeGreaterThanOrEqual(4)

    for (const source of ruleEvolutionSources) {
      expect(source.url).toMatch(/^https:\/\/(www\.)?(sailing\.org|jsaf\.or\.jp)\//)
    }
  })
})
