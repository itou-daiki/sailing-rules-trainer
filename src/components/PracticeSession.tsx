import { useState } from 'react'
import type { QuizQuestion, SkillId } from '../data/content'
import { getSignal } from '../data/content'
import type { Confidence } from '../domain/learningEngine'
import type { BoatClass } from '../domain/boatClass'
import { FlagArtwork } from './FlagArtwork'
import { ScenarioBoard } from './ScenarioBoard'

interface PracticeSessionProps {
  boatClass: BoatClass
  questions: QuizQuestion[]
  sessionLabel?: string
  diagnostic?: boolean
  shared?: boolean
  shareUrl?: string
  reasoningOrder?: 'observe-first' | 'decide-first'
  onAnswer: (
    questionId: string,
    result: { isCorrect: boolean; confidence: Confidence; observationCorrect?: boolean },
  ) => void
  onComplete?: (correct: number, total: number, missedSkills: SkillId[]) => void
  onFinish: () => void
  onRetry: () => void
}

const confidenceOptions: Array<{ id: Confidence; label: string; note: string }> = [
  { id: 'sure', label: '自信あり', note: '理由も説明できる' },
  { id: 'unsure', label: 'たぶん', note: '少し迷った' },
  { id: 'guess', label: '推測', note: '根拠はまだない' },
]

export function PracticeSession({
  boatClass,
  questions,
  sessionLabel = '今日の5問',
  diagnostic = false,
  shared = false,
  shareUrl,
  reasoningOrder = 'observe-first',
  onAnswer,
  onComplete,
  onFinish,
  onRetry,
}: PracticeSessionProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const [observationIndex, setObservationIndex] = useState<number | null>(null)
  const [observationCorrectCount, setObservationCorrectCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [missedSkills, setMissedSkills] = useState<SkillId[]>([])
  const [finished, setFinished] = useState(false)
  const [shareStatus, setShareStatus] = useState('')

  const question = questions[questionIndex]
  const observationTotal = questions.filter((item) => item.observation).length
  const independentMode = reasoningOrder === 'decide-first'
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
    const observationText = observationTotal > 0
      ? `／${independentMode ? '根拠' : '見る力'} ${observationCorrectCount}/${observationTotal}`
      : ''
    const resultText = `セーリング・ルール練習帳｜${sessionLabel} ${correctCount}/${questions.length}問正解${observationText}`
    const url = shareUrl ?? window.location.href.split('#')[0]
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
    const independentTarget = Math.ceil(questions.length * 0.8)
    const intermediateReached =
      independentMode &&
      correctCount >= independentTarget &&
      observationCorrectCount >= Math.ceil(observationTotal * 0.8)
    return (
      <section className="session-result" aria-labelledby="result-title">
        <p className="eyebrow">
          {diagnostic
            ? 'DECK CHECK COMPLETE'
            : shared
              ? 'CLUB CHALLENGE COMPLETE'
              : independentMode
                ? 'INDEPENDENT CASE COMPLETE'
                : 'SESSION COMPLETE'}
        </p>
        <h1 id="result-title">
          {diagnostic
            ? '現在地を確認しました'
            : shared
              ? '一人で考える時間は、ここまで'
              : independentMode
                ? '中級ケースの結果'
                : '今日の練習、おつかれさま'}
        </h1>
        <div className="result-score">
          <strong>{correctCount}</strong>
          <span>/ {questions.length} 問正解</span>
        </div>
        <div className="result-bar" aria-label={`正答率${percentage}%`}>
          <span style={{ width: `${percentage}%` }} />
        </div>
        {observationTotal > 0 ? (
          <div className="result-observation" aria-label={`判断材料の正答${observationCorrectCount}/${observationTotal}`}>
            <span>{independentMode ? '根拠' : '見る力'}</span>
            <strong>{observationCorrectCount} / {observationTotal}</strong>
            <p>
              {independentMode
                ? '先に結論を決めた後、その判断を支える材料を選べた数'
                : 'タック・重なり・動作の変化を、答える前に見抜けた数'}
            </p>
          </div>
        ) : null}
        <p>
          {shared
            ? '点数を比べる前に、答えが分かれた問題を1つ選んでください。'
            : diagnostic
            ? '結果に合わせて、最初に取り組むコースを選びました。'
            : independentMode
              ? intermediateReached
                ? '結論と根拠がともに4/5以上です。規則判断の中級目標を達成しました。'
                : correctCount < independentTarget
                  ? 'まず結論が分かれたケースを、基本コースの図と見比べてください。目標は結論4/5・根拠4/5です。'
                  : '結論は届いています。次は、タック・重なり・ゾーンのどれを根拠にしたかを言葉にしてください。目標は結論4/5・根拠4/5です。'
            : observationTotal > 0 && observationCorrectCount < observationTotal
              ? '見落とした判断材料を記録し、次回の問題順へ反映しました。'
            : percentage === 100
              ? '全問正解です。次は、理由を言葉にしてから答えてみましょう。'
              : '間違いと確信度を記録し、次回の問題順を調整しました。'}
        </p>
        {shared ? (
          <aside className="team-debrief" aria-labelledby="team-debrief-title">
            <span>AFTER QUIZ / 3 MIN</span>
            <h2 id="team-debrief-title">答えが分かれた1問を話す</h2>
            <ol>
              <li><strong>見る</strong><small>最初に図のどこを見た？</small></li>
              <li><strong>説明</strong><small>その材料から、なぜその答え？</small></li>
              <li><strong>行動</strong><small>艇上では、いつ何をする？</small></li>
            </ol>
            <p>順位は作りません。違う考えを見つけることが、この練習の成果です。</p>
          </aside>
        ) : null}
        <div className="button-row">
          {!diagnostic ? (
            <button type="button" className="button button--ink" onClick={onRetry}>
              {shared ? '同じ6問を解き直す' : '別の問題に挑戦'}
            </button>
          ) : null}
          <button type="button" className="button button--line" onClick={shareResult}>
            結果を共有
          </button>
          <button type="button" className="button button--line" onClick={onFinish}>
            {diagnostic ? 'おすすめを見る' : shared ? 'チャレンジ画面へ戻る' : 'ホームへ戻る'}
          </button>
        </div>
        <p className="share-status" aria-live="polite">{shareStatus}</p>
        <div className="practice-credit">Created by Dit-Lab.</div>
      </section>
    )
  }

  const answered = confidence !== null
  const isCorrect = selectedIndex === question.correctIndex
  const flag = question.flagId ? getSignal(question.flagId) : undefined
  const observation = question.observation
  const decideFirst = independentMode && Boolean(observation)

  const submitConfidence = (value: Confidence) => {
    if (selectedIndex === null || answered) return
    const correct = selectedIndex === question.correctIndex
    const observedCorrect = !observation || observationIndex === observation.correctIndex
    setConfidence(value)
    if (correct) setCorrectCount((count) => count + 1)
    if (!correct || !observedCorrect) {
      setMissedSkills((skills) =>
        skills.includes(question.skill) ? skills : [...skills, question.skill],
      )
    }
    onAnswer(question.id, {
      isCorrect: correct,
      confidence: value,
      ...(observation
        ? { observationCorrect: observedCorrect }
        : {}),
    })
  }

  const selectObservation = (choiceIndex: number) => {
    if (!observation || observationIndex !== null) return
    setObservationIndex(choiceIndex)
    if (choiceIndex === observation.correctIndex) {
      setObservationCorrectCount((count) => count + 1)
    }
  }

  const moveNext = () => {
    if (questionIndex === questions.length - 1) {
      onComplete?.(correctCount, questions.length, missedSkills)
      setFinished(true)
      return
    }
    setQuestionIndex((index) => index + 1)
    setSelectedIndex(null)
    setConfidence(null)
    setObservationIndex(null)
  }

  const selectedFeedback =
    selectedIndex === null ? undefined : question.choiceFeedback?.[selectedIndex]
  const observationStep = observation ? (
    <section className={`observation-check${observationIndex !== null ? ' is-resolved' : ''}`} aria-labelledby="observation-title">
      <header>
        <span>{decideFirst ? 'STEP 2' : 'STEP 1'}</span>
        <strong id="observation-title">{decideFirst ? '根拠' : '見る'}</strong>
        <small>{decideFirst ? 'その結論を支える材料を選ぶ' : '答えを決める前に、状況を分類'}</small>
      </header>
      <p>{observation.prompt}</p>
      <div role="group" aria-label="判断材料の選択肢">
        {observation.choices.map((choice, choiceIndex) => {
          const selected = observationIndex === choiceIndex
          const correct = observationIndex !== null && choiceIndex === observation.correctIndex
          const wrong = selected && choiceIndex !== observation.correctIndex
          return (
            <button
              type="button"
              key={choice}
              className={`${selected ? 'is-selected' : ''}${correct ? ' is-correct' : ''}${wrong ? ' is-wrong' : ''}`}
              onClick={() => selectObservation(choiceIndex)}
              disabled={observationIndex !== null}
              aria-pressed={selected}
            >
              <span>{String(choiceIndex + 1).padStart(2, '0')}</span>
              {choice}
            </button>
          )
        })}
      </div>
      {observationIndex !== null ? (
        <div className={`observation-check__feedback${observationIndex === observation.correctIndex ? ' is-correct' : ' is-wrong'}`} aria-live="polite">
          <strong>{observationIndex === observation.correctIndex ? '判断材料を見抜けた' : '見る場所を修正'}</strong>
          <p>{observation.feedback[observationIndex]}</p>
        </div>
      ) : null}
    </section>
  ) : null

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
        <h1 id="question-title" className={question.context ? 'has-context' : undefined}>
          {question.prompt}
        </h1>
        {question.context ? (
          <aside className="question-context" role="note" aria-label="ことばの補足">
            <span>ことばの補足</span>
            <p>{question.context}</p>
          </aside>
        ) : null}
        {flag ? <FlagArtwork kind={flag.artwork} label={flag.name} /> : null}
        {question.diagram ? <ScenarioBoard boatClass={boatClass} diagram={question.diagram} /> : null}

        {observation && !decideFirst ? observationStep : null}

        {!observation || decideFirst || observationIndex !== null ? (
          <section className={`decision-step${observation ? ' decision-step--second' : ''}`} aria-labelledby={observation ? 'decision-step-title' : undefined}>
            {observation ? (
              <header>
                <span>{decideFirst ? 'STEP 1' : 'STEP 2'}</span>
                <strong id="decision-step-title">決める</strong>
                <small>{decideFirst ? 'ヒントを見る前に、自分の結論を固定' : '確認した材料から、結論を選ぶ'}</small>
              </header>
            ) : null}
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
                    disabled={answered || (decideFirst && selectedIndex !== null)}
                    aria-pressed={selectedChoice}
                  >
                    <span>{String.fromCharCode(65 + choiceIndex)}</span>
                    {choice}
                  </button>
                )
              })}
            </div>
          </section>
        ) : (
          <p className="decision-step__waiting">まずSTEP 1で、図から判断材料を選びます。</p>
        )}

        {observation && decideFirst && selectedIndex !== null ? observationStep : null}

        {selectedIndex !== null && (!observation || observationIndex !== null) && !answered ? (
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
      <div className="practice-credit">Created by Dit-Lab.</div>
    </section>
  )
}
