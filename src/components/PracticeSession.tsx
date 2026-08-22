import { useState } from 'react'
import type { QuizQuestion } from '../data/content'
import { getSignal } from '../data/content'
import { FlagArtwork } from './FlagArtwork'
import { ScenarioBoard } from './ScenarioBoard'

interface PracticeSessionProps {
  questions: QuizQuestion[]
  onAnswer: (questionId: string, isCorrect: boolean) => void
  onFinish: () => void
  onRetry: () => void
}

export function PracticeSession({
  questions,
  onAnswer,
  onFinish,
  onRetry,
}: PracticeSessionProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[questionIndex]
  if (!question) {
    return (
      <section className="empty-state">
        <h1>問題を準備できませんでした</h1>
        <button type="button" className="button button--ink" onClick={onFinish}>
          ホームへ戻る
        </button>
      </section>
    )
  }

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100)
    return (
      <section className="session-result" aria-labelledby="result-title">
        <p className="eyebrow">SESSION COMPLETE</p>
        <h1 id="result-title">今日の練習、おつかれさま</h1>
        <div className="result-score">
          <strong>{correctCount}</strong>
          <span>/ {questions.length} 問正解</span>
        </div>
        <div className="result-bar" aria-label={`正答率${percentage}%`}>
          <span style={{ width: `${percentage}%` }} />
        </div>
        <p>
          {percentage === 100
            ? '全問正解です。次は、理由を言葉にしてから答えてみましょう。'
            : '間違えた問題は記録され、次回の練習で優先して出題されます。'}
        </p>
        <div className="button-row">
          <button type="button" className="button button--ink" onClick={onRetry}>
            別の5問に挑戦
          </button>
          <button type="button" className="button button--line" onClick={onFinish}>
            ホームへ戻る
          </button>
        </div>
      </section>
    )
  }

  const answered = selectedIndex !== null
  const isCorrect = selectedIndex === question.correctIndex
  const flag = question.flagId ? getSignal(question.flagId) : undefined

  const chooseAnswer = (choiceIndex: number) => {
    if (answered) return
    const correct = choiceIndex === question.correctIndex
    setSelectedIndex(choiceIndex)
    if (correct) setCorrectCount((count) => count + 1)
    onAnswer(question.id, correct)
  }

  const moveNext = () => {
    if (questionIndex === questions.length - 1) {
      setFinished(true)
      return
    }
    setQuestionIndex((index) => index + 1)
    setSelectedIndex(null)
  }

  return (
    <section className="practice-session" aria-labelledby="question-title">
      <header className="session-header">
        <button type="button" className="text-button" onClick={onFinish}>
          練習を閉じる
        </button>
        <div className="session-progress" aria-label={`${questionIndex + 1}問目、全${questions.length}問`}>
          <span>
            {String(questionIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
          </span>
          <div>
            {questions.map((item, index) => (
              <i
                key={item.id}
                className={index <= questionIndex ? 'is-current' : ''}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </header>

      <div className="question-sheet">
        <p className="eyebrow">{question.category === 'signal' ? 'SIGNAL' : 'SITUATION'}</p>
        {flag ? <FlagArtwork kind={flag.artwork} label={flag.name} /> : null}
        {question.diagram ? <ScenarioBoard diagram={question.diagram} /> : null}
        <h1 id="question-title">{question.prompt}</h1>

        <div className="answer-list" role="group" aria-label="選択肢">
          {question.choices.map((choice, choiceIndex) => {
            const correctChoice = answered && choiceIndex === question.correctIndex
            const wrongChoice = answered && choiceIndex === selectedIndex && !correctChoice
            return (
              <button
                type="button"
                key={choice}
                className={`answer-choice${correctChoice ? ' is-correct' : ''}${wrongChoice ? ' is-wrong' : ''}`}
                onClick={() => chooseAnswer(choiceIndex)}
                disabled={answered}
              >
                <span>{String.fromCharCode(65 + choiceIndex)}</span>
                {choice}
              </button>
            )
          })}
        </div>

        {answered ? (
          <div className={`feedback-sheet${isCorrect ? ' is-correct' : ' is-wrong'}`} aria-live="polite">
            <p className="feedback-sheet__status">{isCorrect ? '正解' : 'もう一歩'}</p>
            <div className="feedback-row">
              <span>結論</span>
              <p>{question.conclusion}</p>
            </div>
            <div className="feedback-row">
              <span>見るポイント</span>
              <ul>
                {question.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="feedback-row">
              <span>正式な用語</span>
              <p>{question.formal}</p>
            </div>
            <button type="button" className="button button--ink" onClick={moveNext} autoFocus>
              {questionIndex === questions.length - 1 ? '結果を見る' : '次の問題へ'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
