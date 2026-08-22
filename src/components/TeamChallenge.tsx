import { useState } from 'react'
import { getCourse, learningCourses } from '../data/courses'
import {
  buildTeamChallengeUrl,
  createTeamChallengeCode,
  normalizeTeamChallengeCode,
  parseTeamChallengeCode,
  type TeamChallengeData,
} from '../domain/teamChallenge'

interface TeamChallengeProps {
  initialCode?: string | null
  onStart: (challenge: TeamChallengeData) => void
  onCodeChange: (code: string) => void
  onBack: () => void
  createCode?: (courseId: string) => string
}

export function TeamChallenge({
  initialCode,
  onStart,
  onCodeChange,
  onBack,
  createCode = createTeamChallengeCode,
}: TeamChallengeProps) {
  const initialChallenge = initialCode ? parseTeamChallengeCode(initialCode) : null
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialChallenge?.courseId ?? learningCourses[0]?.id ?? '',
  )
  const [challenge, setChallenge] = useState<TeamChallengeData | null>(initialChallenge)
  const [joinCode, setJoinCode] = useState(initialCode ?? '')
  const [status, setStatus] = useState(
    initialCode && !initialChallenge ? 'コードを確認してください。例：MR-ABC234' : '',
  )

  const course = challenge ? getCourse(challenge.courseId) : null
  const challengeUrl = challenge
    ? buildTeamChallengeUrl(window.location.href, challenge.code)
    : ''

  const prepareChallenge = () => {
    const code = createCode(selectedCourseId)
    const nextChallenge = parseTeamChallengeCode(code)
    if (!nextChallenge) {
      setStatus('問題セットを作れませんでした。もう一度お試しください。')
      return
    }
    setChallenge(nextChallenge)
    setJoinCode(nextChallenge.code)
    setStatus('全員に同じ問題が出るセットを作りました。')
    onCodeChange(nextChallenge.code)
  }

  const joinChallenge = () => {
    const nextChallenge = parseTeamChallengeCode(joinCode)
    if (!nextChallenge) {
      setStatus('コードを確認してください。例：MR-ABC234')
      return
    }
    setChallenge(nextChallenge)
    setSelectedCourseId(nextChallenge.courseId)
    setJoinCode(nextChallenge.code)
    setStatus('問題セットを読み込みました。')
    onCodeChange(nextChallenge.code)
  }

  const shareChallenge = async () => {
    if (!challenge || !course) return
    const text = `部活チャレンジ「${course.title}」｜コード ${challenge.code}`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'セーリング・ルール練習帳', text, url: challengeUrl })
        setStatus('共有画面を開きました。')
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text}\n${challengeUrl}`)
        setStatus('コードとリンクをコピーしました。')
      } else {
        setStatus(`コード ${challenge.code} を伝えてください。`)
      }
    } catch {
      setStatus('共有をキャンセルしました。コードはそのまま使えます。')
    }
  }

  const resetChallenge = () => {
    setChallenge(null)
    setJoinCode('')
    setStatus('')
  }

  return (
    <section className="page-section team-page" aria-labelledby="team-title">
      <button type="button" className="text-button team-page__back" onClick={onBack}>
        ← ホームへ戻る
      </button>

      <header className="team-page__header">
        <div>
          <p className="eyebrow">CLUB CHALLENGE / NO ACCOUNT</p>
          <h1 id="team-title">同じ6問を解いて、<br />判断の理由を話す。</h1>
          <p>
            主将・先輩・コーチが問題セットを1つ作り、リンクか短いコードで配れます。
            点数の順位ではなく、答えが分かれた理由を練習後に比べます。
          </p>
        </div>
        <ol className="team-briefing" aria-label="部活チャレンジの進め方">
          <li><span>01</span><strong>配る</strong><small>コードを全員へ</small></li>
          <li><span>02</span><strong>一人で解く</strong><small>相談はまだしない</small></li>
          <li><span>03</span><strong>理由を話す</strong><small>見る場所を比べる</small></li>
        </ol>
      </header>

      {challenge && course ? (
        <div className="challenge-ready">
          <section className="challenge-ticket" aria-labelledby="challenge-ready-title">
            <div className="challenge-ticket__stub">
              <span>SESSION</span>
              <strong>{course.code}</strong>
              <small>6 MIN</small>
            </div>
            <div className="challenge-ticket__body">
              <p>SAILING RULES / TEAM SET</p>
              <h2 id="challenge-ready-title">{course.title}</h2>
              <span className="challenge-code" aria-label={`チャレンジコード ${challenge.code}`}>
                {challenge.code}
              </span>
              <small>このコードなら、どの端末でも同じ順番の問題が出ます。</small>
            </div>
          </section>

          <div className="challenge-ready__actions">
            <button type="button" className="button button--signal" onClick={() => onStart(challenge)}>
              一人で回答を始める <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="button button--ink" onClick={shareChallenge}>
              リンクとコードを共有
            </button>
            <button type="button" className="button button--line" onClick={resetChallenge}>
              別のセットを作る・入る
            </button>
          </div>
          <p className="challenge-status" aria-live="polite">{status}</p>

          <aside className="challenge-ground-rules">
            <strong>終わったら、この1問だけ</strong>
            <p>
              「答えが分かれた問題は？」「最初にどこを見た？」「どの動作なら安全？」を順に話します。
              氏名・点数・回答は送信されず、それぞれの端末だけに残ります。
            </p>
          </aside>
        </div>
      ) : (
        <div className="challenge-workbench">
          <section className="challenge-create" aria-labelledby="challenge-create-title">
            <div className="challenge-workbench__label">
              <span>FOR CAPTAIN / COACH</span>
              <strong>問題を配る</strong>
            </div>
            <div className="challenge-workbench__body">
              <h2 id="challenge-create-title">今日のテーマを1つ選ぶ</h2>
              <fieldset className="challenge-course-picker">
                <legend className="visually-hidden">部活チャレンジのコース</legend>
                {learningCourses.map((item) => (
                  <label key={item.id} className={selectedCourseId === item.id ? 'is-selected' : ''}>
                    <input
                      type="radio"
                      name="challenge-course"
                      value={item.id}
                      checked={selectedCourseId === item.id}
                      onChange={() => setSelectedCourseId(item.id)}
                    />
                    <span>{String(item.order).padStart(2, '0')}</span>
                    <strong>{item.title}</strong>
                    <small>{item.shortDescription}</small>
                  </label>
                ))}
              </fieldset>
              <button type="button" className="button button--signal" onClick={prepareChallenge}>
                共通の6問を作る <span aria-hidden="true">→</span>
              </button>
            </div>
          </section>

          <section className="challenge-join" aria-labelledby="challenge-join-title">
            <div className="challenge-workbench__label">
              <span>FOR SAILOR</span>
              <strong>コードで入る</strong>
            </div>
            <div className="challenge-workbench__body">
              <h2 id="challenge-join-title">受け取ったコードを入力</h2>
              <label htmlFor="challenge-code-input">6文字のセット番号</label>
              <input
                id="challenge-code-input"
                type="text"
                value={joinCode}
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                placeholder="MR-ABC234"
                maxLength={9}
                onChange={(event) => setJoinCode(normalizeTeamChallengeCode(event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') joinChallenge()
                }}
              />
              <button type="button" className="button button--ink" onClick={joinChallenge}>
                同じ問題へ入る
              </button>
              <p className="challenge-status" aria-live="polite">{status}</p>
              <small className="challenge-privacy">
                登録不要。リンクには問題の種類と順番だけが入り、個人情報や成績は含まれません。
              </small>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
