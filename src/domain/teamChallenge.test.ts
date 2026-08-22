import { describe, expect, it } from 'vitest'
import {
  buildTeamChallengeUrl,
  createTeamChallengeCode,
  normalizeTeamChallengeCode,
  parseTeamChallengeCode,
  teamChallengeCodeFromHash,
} from './teamChallenge'

describe('teamChallenge', () => {
  it('コースを含む短いコードを作り、元の情報へ戻せる', () => {
    const code = createTeamChallengeCode(
      'mark-room',
      () => new Uint8Array([0, 1, 2, 3, 4, 5]),
    )

    expect(code).toBe('MR-ABCDEF')
    expect(parseTeamChallengeCode(code)).toEqual({
      code,
      courseId: 'mark-room',
      seed: code,
    })
  })

  it('紛らわしい文字を使わず、入力の小文字と空白を整える', () => {
    expect(normalizeTeamChallengeCode(' mr-abc234 ')).toBe('MR-ABC234')
    expect(createTeamChallengeCode('signal-watch', () => new Uint8Array(6).fill(31)))
      .toBe('SG-999999')
  })

  it('未知のコースと壊れたコードを受け付けない', () => {
    expect(parseTeamChallengeCode('XX-ABCDEF')).toBeNull()
    expect(parseTeamChallengeCode('MR-ABC')).toBeNull()
    expect(parseTeamChallengeCode('MR-ABCIO2')).toBeNull()
    expect(() => createTeamChallengeCode('unknown')).toThrow('Unknown course')
  })

  it('GitHub Pagesのパスを保った共有URLを作り、ハッシュからコードを読む', () => {
    const url = buildTeamChallengeUrl(
      'https://itou-daiki.github.io/sailing-rules-trainer/#/home',
      'mr-abc234',
    )

    expect(url).toBe(
      'https://itou-daiki.github.io/sailing-rules-trainer/#/team?code=MR-ABC234',
    )
    expect(teamChallengeCodeFromHash('#/team?code=MR-ABC234')).toBe('MR-ABC234')
    expect(teamChallengeCodeFromHash('#/team')).toBeNull()
  })
})
