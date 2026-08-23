import { getCourse } from '../data/courses'

const COURSE_ALIASES = {
  SG: 'signal-watch',
  ST: 'start-line',
  RW: 'boats-meet',
  LM: 'right-with-limits',
  MR: 'mark-room',
  PT: 'after-incident',
  OB: 'obstacles-safety',
  FR: 'fair-racing',
  RC: 'race-ready',
} as const

const CODE_CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_PATTERN = /^([A-Z]{2})-([ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6})$/

export interface TeamChallengeData {
  code: string
  courseId: string
  seed: string
}

type CourseAlias = keyof typeof COURSE_ALIASES
type RandomBytes = (length: number) => Uint8Array

const COURSE_IDS_TO_ALIASES = Object.fromEntries(
  Object.entries(COURSE_ALIASES).map(([alias, courseId]) => [courseId, alias]),
) as Record<string, CourseAlias>

const browserRandomBytes: RandomBytes = (length) => {
  const bytes = new Uint8Array(length)
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}

export const normalizeTeamChallengeCode = (input: string) =>
  input.trim().toUpperCase().replace(/\s+/g, '')

export const createTeamChallengeCode = (
  courseId: string,
  randomBytes: RandomBytes = browserRandomBytes,
): string => {
  const alias = COURSE_IDS_TO_ALIASES[courseId]
  if (!alias || !getCourse(courseId)) throw new Error('Unknown course')

  const bytes = randomBytes(6)
  if (bytes.length < 6) throw new Error('Not enough random bytes')
  const suffix = Array.from(bytes.slice(0, 6), (byte) =>
    CODE_CHARACTERS[byte % CODE_CHARACTERS.length],
  ).join('')
  return `${alias}-${suffix}`
}

export const parseTeamChallengeCode = (input: string): TeamChallengeData | null => {
  const code = normalizeTeamChallengeCode(input)
  const match = CODE_PATTERN.exec(code)
  if (!match) return null

  const courseId = COURSE_ALIASES[match[1] as CourseAlias]
  if (!courseId || !getCourse(courseId)) return null
  return { code, courseId, seed: code }
}

export const teamChallengeCodeFromHash = (hash: string): string | null => {
  const query = hash.split('?')[1]
  if (!query) return null
  const code = new URLSearchParams(query).get('code')
  return code ? normalizeTeamChallengeCode(code) : null
}

export const buildTeamChallengeUrl = (currentUrl: string, code: string): string => {
  const url = new URL(currentUrl)
  url.hash = `/team?code=${encodeURIComponent(normalizeTeamChallengeCode(code))}`
  return url.toString()
}
