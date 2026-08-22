import {
  skillDefinitions,
  type QuestionCategory,
  type QuizQuestion,
  type SkillId,
} from '../data/content'

export const STORAGE_KEY = 'sailing-trainer:progress:v2'
export const LEGACY_STORAGE_KEY = 'sailing-trainer:progress:v1'

export type Confidence = 'sure' | 'unsure' | 'guess'

export interface AnswerRecord {
  attempts: number
  correct: number
  correctStreak: number
  lastAnswered: string
  dueAt: string
  confidenceCounts: Record<Confidence, number>
  highConfidenceErrors: number
  observationAttempts?: number
  observationCorrect?: number
}

export interface DiagnosticResult {
  completedAt: string
  score: number
  total: number
  recommendedCourseId: string
}

export interface LearningProgress {
  version: 2
  answers: Record<string, AnswerRecord>
  studyDays: string[]
  diagnostic: DiagnosticResult | null
}

export interface DashboardStats {
  answered: number
  attempts: number
  accuracy: number
  mastered: number
  due: number
  currentStreak: number
}

export interface SkillStats {
  id: SkillId
  answered: number
  total: number
  accuracy: number
  mastery: number
  due: number
}

type AnswerInput =
  | boolean
  | {
      isCorrect: boolean
      confidence?: Confidence
      observationCorrect?: boolean
    }

interface LegacyAnswerRecord {
  attempts: number
  correct: number
  lastAnswered: string
}

interface LegacyProgress {
  version: 1
  answers: Record<string, LegacyAnswerRecord>
  studyDays: string[]
}

export const createEmptyProgress = (): LearningProgress => ({
  version: 2,
  answers: {},
  studyDays: [],
  diagnostic: null,
})

const dateKey = (date: Date) => date.toLocaleDateString('sv-SE')

const addDays = (date: Date, days: number): string => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next.toISOString()
}

const isCount = (value: unknown): value is number => Number.isInteger(value) && Number(value) >= 0

const isConfidenceCounts = (value: unknown): value is Record<Confidence, number> => {
  if (!value || typeof value !== 'object') return false
  const counts = value as Partial<Record<Confidence, number>>
  return isCount(counts.sure) && isCount(counts.unsure) && isCount(counts.guess)
}

const isAnswerRecord = (value: unknown): value is AnswerRecord => {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<AnswerRecord>
  return (
    isCount(record.attempts) &&
    isCount(record.correct) &&
    Number(record.correct) <= Number(record.attempts) &&
    isCount(record.correctStreak) &&
    typeof record.lastAnswered === 'string' &&
    typeof record.dueAt === 'string' &&
    isConfidenceCounts(record.confidenceCounts) &&
    isCount(record.highConfidenceErrors) &&
    (record.observationAttempts === undefined || isCount(record.observationAttempts)) &&
    (record.observationCorrect === undefined || isCount(record.observationCorrect)) &&
    Number(record.observationCorrect ?? 0) <= Number(record.observationAttempts ?? 0)
  )
}

const isDiagnostic = (value: unknown): value is DiagnosticResult => {
  if (!value || typeof value !== 'object') return false
  const result = value as Partial<DiagnosticResult>
  return (
    typeof result.completedAt === 'string' &&
    isCount(result.score) &&
    isCount(result.total) &&
    typeof result.recommendedCourseId === 'string'
  )
}

export const parseProgress = (raw: string | null): LearningProgress => {
  if (!raw) return createEmptyProgress()

  try {
    const value = JSON.parse(raw) as Partial<LearningProgress>
    if (value.version !== 2 || !value.answers || typeof value.answers !== 'object') {
      return createEmptyProgress()
    }

    const answers = Object.fromEntries(
      Object.entries(value.answers).filter((entry): entry is [string, AnswerRecord] =>
        isAnswerRecord(entry[1]),
      ),
    )
    const studyDays = Array.isArray(value.studyDays)
      ? [...new Set(value.studyDays.filter((day): day is string => typeof day === 'string'))].sort()
      : []

    return {
      version: 2,
      answers,
      studyDays,
      diagnostic: isDiagnostic(value.diagnostic) ? value.diagnostic : null,
    }
  } catch {
    return createEmptyProgress()
  }
}

const migrateLegacyProgress = (raw: string | null): LearningProgress => {
  if (!raw) return createEmptyProgress()

  try {
    const value = JSON.parse(raw) as Partial<LegacyProgress>
    if (value.version !== 1 || !value.answers || typeof value.answers !== 'object') {
      return createEmptyProgress()
    }

    const answers: Record<string, AnswerRecord> = {}
    for (const [questionId, candidate] of Object.entries(value.answers)) {
      if (!candidate || typeof candidate !== 'object') continue
      const record = candidate as Partial<LegacyAnswerRecord>
      if (
        !isCount(record.attempts) ||
        !isCount(record.correct) ||
        Number(record.correct) > Number(record.attempts) ||
        typeof record.lastAnswered !== 'string'
      ) {
        continue
      }
      answers[questionId] = {
        attempts: record.attempts,
        correct: record.correct,
        correctStreak: 0,
        lastAnswered: record.lastAnswered,
        dueAt: record.lastAnswered,
        confidenceCounts: { sure: 0, unsure: record.attempts, guess: 0 },
        highConfidenceErrors: 0,
      }
    }

    return {
      version: 2,
      answers,
      studyDays: Array.isArray(value.studyDays)
        ? value.studyDays.filter((day): day is string => typeof day === 'string')
        : [],
      diagnostic: null,
    }
  } catch {
    return createEmptyProgress()
  }
}

export const loadProgress = (storage: Pick<Storage, 'getItem'>): LearningProgress => {
  try {
    const current = storage.getItem(STORAGE_KEY)
    if (current) return parseProgress(current)
    return migrateLegacyProgress(storage.getItem(LEGACY_STORAGE_KEY))
  } catch {
    return createEmptyProgress()
  }
}

export const saveProgress = (
  progress: LearningProgress,
  storage: Pick<Storage, 'setItem'>,
): boolean => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export const recordAnswer = (
  progress: LearningProgress,
  questionId: string,
  input: AnswerInput,
  answeredAt = new Date(),
): LearningProgress => {
  const { isCorrect, confidence = 'unsure', observationCorrect } =
    typeof input === 'boolean'
      ? { isCorrect: input, confidence: 'unsure' as const, observationCorrect: undefined }
      : input
  const previous = progress.answers[questionId] ?? {
    attempts: 0,
    correct: 0,
    correctStreak: 0,
    lastAnswered: '',
    dueAt: answeredAt.toISOString(),
    confidenceCounts: { sure: 0, unsure: 0, guess: 0 },
    highConfidenceErrors: 0,
    observationAttempts: 0,
    observationCorrect: 0,
  }
  const correctStreak = isCorrect ? previous.correctStreak + 1 : 0
  const intervalByStreak = [0, 1, 3, 7, 14, 30]
  const interval = isCorrect
    ? confidence === 'guess'
      ? 1
      : (intervalByStreak[Math.min(correctStreak, intervalByStreak.length - 1)] ?? 1)
    : 0
  const today = dateKey(answeredAt)

  return {
    version: 2,
    answers: {
      ...progress.answers,
      [questionId]: {
        attempts: previous.attempts + 1,
        correct: previous.correct + (isCorrect ? 1 : 0),
        correctStreak,
        lastAnswered: answeredAt.toISOString(),
        dueAt: addDays(answeredAt, interval),
        confidenceCounts: {
          ...previous.confidenceCounts,
          [confidence]: previous.confidenceCounts[confidence] + 1,
        },
        highConfidenceErrors:
          previous.highConfidenceErrors + (!isCorrect && confidence === 'sure' ? 1 : 0),
        observationAttempts:
          (previous.observationAttempts ?? 0) + (observationCorrect === undefined ? 0 : 1),
        observationCorrect:
          (previous.observationCorrect ?? 0) + (observationCorrect === true ? 1 : 0),
      },
    },
    studyDays: [...new Set([...progress.studyDays, today])].sort(),
    diagnostic: progress.diagnostic,
  }
}

export const completeDiagnostic = (
  progress: LearningProgress,
  score: number,
  total: number,
  completedAt = new Date(),
  recommendedCourseId?: string,
): LearningProgress => ({
  ...progress,
  diagnostic: {
    completedAt: completedAt.toISOString(),
    score,
    total,
    recommendedCourseId:
      recommendedCourseId ?? (score <= Math.floor(total * 0.4)
        ? 'signal-watch'
        : score < Math.ceil(total * 0.8)
          ? 'boats-meet'
          : 'race-ready'),
  },
})

const stringHash = (value: string): number => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const weaknessScore = (
  question: QuizQuestion,
  progress: LearningProgress,
  seed: string,
  now: Date,
): number => {
  const record = progress.answers[question.id]
  const tieBreak = (stringHash(`${seed}:${question.id}`) % 997) / 1000
  if (!record) return -20_000 + question.difficulty * 100 + tieBreak

  const accuracy = record.correct / record.attempts
  const due = new Date(record.dueAt).getTime() <= now.getTime()
  const confidencePenalty = record.highConfidenceErrors * 40
  const observationAttempts = record.observationAttempts ?? 0
  const observationAccuracy =
    observationAttempts === 0 ? 1 : (record.observationCorrect ?? 0) / observationAttempts
  const observationPenalty = (1 - observationAccuracy) * 70
  const mastery = accuracy * 100 + Math.min(record.correctStreak, 4) * 24
  return (due ? -10_000 : 0) + mastery - confidencePenalty - observationPenalty + tieBreak
}

const rankQuestions = (
  questions: QuizQuestion[],
  progress: LearningProgress,
  seed: string,
  now: Date,
) =>
  [...questions].sort(
    (first, second) =>
      weaknessScore(first, progress, seed, now) - weaknessScore(second, progress, seed, now),
  )

export const selectPracticeQuestions = (
  questions: QuizQuestion[],
  progress: LearningProgress,
  options: {
    category?: QuestionCategory
    skills?: SkillId[]
    size?: number
    seed?: string
    diagnostic?: boolean
    now?: Date
  } = {},
): QuizQuestion[] => {
  const {
    category,
    skills,
    size = 5,
    seed = dateKey(new Date()),
    diagnostic = false,
    now = new Date(),
  } = options
  const candidates = questions.filter(
    (question) =>
      (!category || question.category === category) &&
      (!skills || skills.includes(question.skill)),
  )

  if (diagnostic) {
    const selected = skillDefinitions.flatMap((skill) => {
      const skillQuestions = candidates.filter((question) => question.skill === skill.id)
      return rankQuestions(skillQuestions, createEmptyProgress(), seed, now).slice(0, 1)
    })
    return selected.slice(0, size)
  }

  const ranked = rankQuestions(candidates, progress, seed, now)
  if (category || skills || size < 2) return ranked.slice(0, size)

  const firstSignal = ranked.find((question) => question.category === 'signal')
  const firstRule = ranked.find((question) => question.category === 'rule')
  const selected = [firstSignal, firstRule].filter(
    (question): question is QuizQuestion => question !== undefined,
  )

  for (const question of ranked) {
    if (selected.length >= size) break
    if (!selected.some((item) => item.id === question.id)) selected.push(question)
  }
  return selected
}

export const selectTeamChallengeQuestions = (
  questions: QuizQuestion[],
  options: {
    skills: SkillId[]
    size: number
    seed: string
  },
): QuizQuestion[] =>
  selectPracticeQuestions(questions, createEmptyProgress(), {
    skills: options.skills,
    size: options.size,
    seed: options.seed,
  })

const calculateStreak = (studyDays: string[], today: Date): number => {
  const days = new Set(studyDays)
  const cursor = new Date(today)
  cursor.setHours(12, 0, 0, 0)

  if (!days.has(dateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(dateKey(cursor))) return 0
  }

  let streak = 0
  while (days.has(dateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

const isDue = (record: AnswerRecord, now: Date) =>
  new Date(record.dueAt).getTime() <= now.getTime()

export const getDashboardStats = (
  progress: LearningProgress,
  today = new Date(),
): DashboardStats => {
  const records = Object.values(progress.answers)
  const attempts = records.reduce((sum, record) => sum + record.attempts, 0)
  const correct = records.reduce((sum, record) => sum + record.correct, 0)

  return {
    answered: records.length,
    attempts,
    accuracy: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
    mastered: records.filter(
      (record) => record.attempts >= 2 && record.correctStreak >= 2,
    ).length,
    due: records.filter((record) => isDue(record, today)).length,
    currentStreak: calculateStreak(progress.studyDays, today),
  }
}

export const getSkillStats = (
  progress: LearningProgress,
  questions: QuizQuestion[],
  now = new Date(),
): SkillStats[] =>
  skillDefinitions.map((skill) => {
    const skillQuestions = questions.filter((question) => question.skill === skill.id)
    const records = skillQuestions.flatMap((question) => {
      const record = progress.answers[question.id]
      return record ? [record] : []
    })
    const attempts = records.reduce((sum, record) => sum + record.attempts, 0)
    const correct = records.reduce((sum, record) => sum + record.correct, 0)
    const masteryPoints = records.reduce((sum, record) => {
      const accuracy = record.correct / record.attempts
      return sum + Math.min(1, accuracy * 0.4 + (record.correctStreak / 2) * 0.6)
    }, 0)

    return {
      id: skill.id,
      answered: records.length,
      total: skillQuestions.length,
      accuracy: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
      mastery:
        skillQuestions.length === 0
          ? 0
          : Math.round((masteryPoints / skillQuestions.length) * 100),
      due: records.filter((record) => isDue(record, now)).length,
    }
  })
