import type { QuestionCategory, QuizQuestion } from '../data/content'

export const STORAGE_KEY = 'sailing-trainer:progress:v1'

export interface AnswerRecord {
  attempts: number
  correct: number
  lastAnswered: string
}

export interface LearningProgress {
  version: 1
  answers: Record<string, AnswerRecord>
  studyDays: string[]
}

export interface DashboardStats {
  answered: number
  attempts: number
  accuracy: number
  mastered: number
  currentStreak: number
}

export const createEmptyProgress = (): LearningProgress => ({
  version: 1,
  answers: {},
  studyDays: [],
})

const dateKey = (date: Date) => date.toLocaleDateString('sv-SE')

const isAnswerRecord = (value: unknown): value is AnswerRecord => {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<AnswerRecord>
  return (
    Number.isInteger(record.attempts) &&
    Number.isInteger(record.correct) &&
    (record.attempts ?? -1) >= 0 &&
    (record.correct ?? -1) >= 0 &&
    (record.correct ?? 1) <= (record.attempts ?? 0) &&
    typeof record.lastAnswered === 'string'
  )
}

export const parseProgress = (raw: string | null): LearningProgress => {
  if (!raw) return createEmptyProgress()

  try {
    const value = JSON.parse(raw) as Partial<LearningProgress>
    if (value.version !== 1 || !value.answers || typeof value.answers !== 'object') {
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

    return { version: 1, answers, studyDays }
  } catch {
    return createEmptyProgress()
  }
}

export const loadProgress = (storage: Pick<Storage, 'getItem'>): LearningProgress =>
  parseProgress(storage.getItem(STORAGE_KEY))

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
  isCorrect: boolean,
  answeredAt = new Date(),
): LearningProgress => {
  const previous = progress.answers[questionId] ?? {
    attempts: 0,
    correct: 0,
    lastAnswered: '',
  }
  const today = dateKey(answeredAt)

  return {
    version: 1,
    answers: {
      ...progress.answers,
      [questionId]: {
        attempts: previous.attempts + 1,
        correct: previous.correct + (isCorrect ? 1 : 0),
        lastAnswered: answeredAt.toISOString(),
      },
    },
    studyDays: [...new Set([...progress.studyDays, today])].sort(),
  }
}

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
): number => {
  const record = progress.answers[question.id]
  if (!record) return -10_000 + (stringHash(`${seed}:${question.id}`) % 997) / 1000

  const accuracy = record.correct / record.attempts
  const masteryPenalty = accuracy * 100 + Math.min(record.correct, 3) * 12
  const tieBreak = (stringHash(`${seed}:${question.id}`) % 997) / 1000
  return masteryPenalty + tieBreak
}

export const selectPracticeQuestions = (
  questions: QuizQuestion[],
  progress: LearningProgress,
  options: { category?: QuestionCategory; size?: number; seed?: string } = {},
): QuizQuestion[] => {
  const { category, size = 5, seed = dateKey(new Date()) } = options
  const candidates = category
    ? questions.filter((question) => question.category === category)
    : questions
  const ranked = [...candidates].sort(
    (first, second) =>
      weaknessScore(first, progress, seed) - weaknessScore(second, progress, seed),
  )

  if (category || size < 2) return ranked.slice(0, size)

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

const calculateStreak = (studyDays: string[], today: Date): number => {
  const days = new Set(studyDays)
  const cursor = new Date(today)
  cursor.setHours(12, 0, 0, 0)

  const todayKey = dateKey(cursor)
  if (!days.has(todayKey)) {
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
      (record) => record.attempts >= 2 && record.correct / record.attempts >= 0.8,
    ).length,
    currentStreak: calculateStreak(progress.studyDays, today),
  }
}
