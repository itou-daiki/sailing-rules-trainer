import { useState } from 'react'
import type { QuizQuestion } from '../data/content'
import { getSignal } from '../data/content'
import type { Confidence } from '../domain/learningEngine'
import { FlagArtwork } from './FlagArtwork'
import { ScenarioBoard } from './ScenarioBoard'

interface PracticeSessionProps {
  questions: QuizQuestion[]
  sessionLabel?: string
  diagnostic?: boolean
  onAnswer: (
    questionId: string,
    result: { isCorrect: boolean; confidence: Confidence },
  ) => void
  onComplete?: (correct: number, total: number) => void
  onFinish: () => void
  onRetry: () => void
}

const confidenceOptions: Array<{ id: Confidence; label: string; note: string }> = [
  { id: 'sure', label: '自信あり', note: '理由も説明できる' },
  { id: 'unsure', label: 'たぶん', note: '少し迷った' },
  { id: 'guess', label: '推測', note: '根拠はまだない' },
]

export function PracticeSession({
  questions,
  sessionLabel = '今日の5問',
  diagnostic = false,
  onAnswer,
  onComplete,
  onFinish,
  onRetry,
}: PracticeSessionProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [shareStatus, setShareStatus] = useState('')

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

  const shareResult = async () => {
    const resultText = `セーリング・ルール練習帳｜${sessionLabel} ${correctCount}/${questions.length}問正解`
    const url = window.location.href.split('#')[0]
    try {
      if (navigator.share) {
        await navigator.share({ title: 'セーリング・ルール練習帳', text: resultText, url })
        setShareStatus('共有しました')
      } else {
        await navigator.clipboard.writeText(`${resultText}\n${url}`)
        setShareStatus('結果とURLをコピーしました')
      }
    } catch {
      setShareStatus('共有はキャンセルされました')
    }
  }

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100)
    return (
      <section className="session-result" aria-labelledby="result-title">
        <p className="eyebrow">{diagnostic ? 'DECK CHECK COMPLETE' : 'SESSION COMPLETE'}</p>
        <h1 id="result-title">
          {diagnostic ? '現在地を確認しました' : '今日の練習、おつかれさま'}
        </h1>
        <div className="result-score">
          <strong>{correctCount}</strong>
          <span>/ {questions.length} 問正解</span>
        </div>
        <div className="result-bar" aria-label={`正答率${percentage}%`}>
          <span style={{ width: `${percentage}%` }} />
        </div>
        <p>
          {diagnostic
            ? '結果に合わせて、最初に取り組むコースを選びました。'
            : percentage === 100
              ? '全問正解です。次は、理由を言葉にしてから答えてみましょう。'
              : '間違いと確信度を記録し、次回の問題順を調整しました。'}
        </p>
        <div className="button-row">
          {!diagnostic ? (
            <button type="button" className="button button--ink" onClick={onRetry}>
              別の問題に挑戦
            </button>
          ) : null}
          <button type="button" className="button button--line" onClick={shareResult}>
            結果を共有
          </button>
          <button type="button" className="button button--line" onClick={onFinish}>
            {diagnostic ? 'おすすめを見る' : 'ホームへ戻る'}
          </button>
        </div>
        <p className="share-status" aria-live="polite">{shareStatus}</p>
      </section>
    )
  }

  const answered = confidence !== null
  const isCorrect = selectedIndex === question.correctIndex
  const flag = question.flagId ? getSignal(question.flagId) : undefined

  const submitConfidence = (value: Confidence) => {
    if (selectedIndex === null || answered) return
    const correct = selectedIndex === question.correctIndex
    setConfidence(value)
    if (correct) setCorrectCount((count) => count + 1)
    onAnswer(question.id, { isCorrect: correct, confidence: value })
  }

  const moveNext = () => {
    if (questionIndex === questions.length - 1) {
      onComplete?.(correctCount, questions.length)
      setFinished(true)
      return
    }
    setQuestionIndex((index) => index + 1)
    setSelectedIndex(null)
    setConfidence(null)
  }

  const selectedFeedback =
    selectedIndex === null ? undefined : question.choiceFeedback?.[selectedIndex]

  return (
    <section className="practice-session" aria-labelledby="question-title">
      <header className="session-header">
        <button type="button" className="text-button" onClick={onFinish}>
          練習を閉じる
        </button>
        <div>
          <p className="session-label">{sessionLabel}</p>
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
        </div>
      </header>

      <div className="question-sheet">
        <div className="question-meta">
          <p className="eyebrow">{question.category === 'signal' ? 'SIGNAL' : 'SITUATION'}</p>
          <span>難度 {question.difficulty}</span>
        </div>
        {flag ? <FlagArtwork kind={flag.artwork} label={flag.name} /> : null}
        {question.diagram ? <ScenarioBoard diagram={question.diagram} /> : null}
        <h1 id="question-title">{question.prompt}</h1>

        <div className="answer-list" role="group" aria-label="選択肢">
          {question.choices.map((choice, choiceIndex) => {
            const correctChoice = answered && choiceIndex === question.correctIndex
            const wrongChoice = answered && choiceIndex === selectedIndex && !correctChoice
            const selectedChoice = !answered && choiceIndex === selectedIndex
            return (
              <button
                type="button"
                key={choice}
                className={`answer-choice${selectedChoice ? ' is-selected' : ''}${correctChoice ? ' is-correct' : ''}${wrongChoice ? ' is-wrong' : ''}`}
                onClick={() => setSelectedIndex(choiceIndex)}
                disabled={answered}
                aria-pressed={selectedChoice}
              >
                <span>{String.fromCharCode(65 + choiceIndex)}</span>
                {choice}
              </button>
            )
          })}
        </div>

        {selectedIndex !== null && !answered ? (
          <fieldset className="confidence-check">
            <legend>この判断に、どのくらい自信がありますか？</legend>
            <div>
              {confidenceOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => submitConfidence(option.id)}
                >
                  <strong>{option.label}</strong>
                  <small>{option.note}</small>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {answered ? (
          <div className={`feedback-sheet${isCorrect ? ' is-correct' : ' is-wrong'}`} aria-live="polite">
            <p className="feedback-sheet__status">{isCorrect ? '正解' : '判断を修正'}</p>
            {selectedFeedback ? (
              <div className="feedback-row feedback-row--diagnosis">
                <span>選び方</span>
                <p>{selectedFeedback}</p>
              </div>
            ) : null}
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
