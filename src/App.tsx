import { useEffect, useMemo, useState } from 'react'
import { LearningPath } from './components/LearningPath'
import { MastMark } from './components/MastMark'
import { PracticeSession } from './components/PracticeSession'
import { RuleLibrary } from './components/RuleLibrary'
import { SignalLibrary } from './components/SignalLibrary'
import { StartSequenceTrainer } from './components/StartSequenceTrainer'
import { getCourse, type LearningCourse } from './data/courses'
import {
  RULESET,
  quizQuestions,
  skillDefinitions,
  type QuestionCategory,
  type QuizQuestion,
  type SkillId,
} from './data/content'
import {
  completeDiagnostic,
  createEmptyProgress,
  getDashboardStats,
  getSkillStats,
  loadProgress,
  recordAnswer,
  saveProgress,
  selectPracticeQuestions,
  type Confidence,
  type LearningProgress,
} from './domain/learningEngine'

type Page = 'home' | 'learn' | 'signals' | 'rules' | 'progress' | 'practice'

interface SessionConfig {
  label: string
  size: number
  category?: QuestionCategory
  skills?: SkillId[]
  diagnostic?: boolean
}

const pageFromHash = (): Page => {
  const page = window.location.hash.replace('#/', '')
  if (
    page === 'learn' ||
    page === 'signals' ||
    page === 'rules' ||
    page === 'progress' ||
    page === 'practice'
  ) {
    return page
  }
  return 'home'
}

const navItems: Array<{ id: Exclude<Page, 'practice'>; number: string; label: string }> = [
  { id: 'home', number: '01', label: 'ホーム' },
  { id: 'learn', number: '02', label: 'コース' },
  { id: 'signals', number: '03', label: '信号旗' },
  { id: 'rules', number: '04', label: 'ルール' },
  { id: 'progress', number: '05', label: '記録' },
]

const dailySession: SessionConfig = { label: '今日の5問', size: 5 }

const loadInitialProgress = (): LearningProgress => {
  try {
    return loadProgress(window.localStorage)
  } catch {
    return createEmptyProgress()
  }
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const [progress, setProgress] = useState<LearningProgress>(loadInitialProgress)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(dailySession)
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>(() =>
    selectPracticeQuestions(quizQuestions, loadInitialProgress(), { size: 5 }),
  )

  const stats = useMemo(() => getDashboardStats(progress), [progress])

  useEffect(() => {
    const handleHashChange = () => setPage(pageFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (nextPage: Exclude<Page, 'practice'>) => {
    window.location.hash = nextPage === 'home' ? '#/' : `#/${nextPage}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const beginSession = (config: SessionConfig, retry = false) => {
    const seed = retry
      ? `${Date.now()}`
      : `${new Date().toLocaleDateString('sv-SE')}:${config.label}`
    setSessionConfig(config)
    setSessionQuestions(
      selectPracticeQuestions(quizQuestions, progress, {
        category: config.category,
        skills: config.skills,
        size: config.size,
        seed,
        diagnostic: config.diagnostic,
      }),
    )
    window.location.hash = '#/practice'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startPractice = (category?: QuestionCategory) =>
    beginSession({
      label: category === 'signal' ? '信号旗チェック' : category === 'rule' ? '状況判断' : '今日の5問',
      size: 5,
      category,
    })

  const startDiagnostic = () =>
    beginSession({ label: '5領域の現在地チェック', size: 5, diagnostic: true })

  const startCourse = (course: LearningCourse) =>
    beginSession({
      label: course.title,
      size: course.questionCount,
      skills: course.skills,
    })

  const handleAnswer = (
    questionId: string,
    result: { isCorrect: boolean; confidence: Confidence },
  ) => {
    setProgress((current) => {
      const next = recordAnswer(current, questionId, result)
      saveProgress(next, window.localStorage)
      return next
    })
  }

  const handleSessionComplete = (correct: number, total: number) => {
    if (!sessionConfig.diagnostic) return
    setProgress((current) => {
      const next = completeDiagnostic(current, correct, total)
      saveProgress(next, window.localStorage)
      return next
    })
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        本文へ移動
      </a>
      {page !== 'practice' ? (
        <header className="site-header">
          <button className="brand" type="button" onClick={() => navigate('home')}>
            <MastMark compact />
            <span>
              <strong>セーリング・ルール練習帳</strong>
              <small>{RULESET.edition}</small>
            </span>
          </button>
          <nav className="desktop-nav" aria-label="メイン">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={page === item.id ? 'is-active' : ''}
                aria-current={page === item.id ? 'page' : undefined}
                onClick={() => navigate(item.id)}
              >
                <span>{item.number}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </header>
      ) : null}

      <main id="main-content" className={page === 'practice' ? 'main main--practice' : 'main'}>
        {page === 'home' ? (
          <HomePage
            progress={progress}
            stats={stats}
            onStart={() => startPractice()}
            onDiagnostic={startDiagnostic}
            onNavigate={navigate}
            onStartSequence={() => {
              const course = getCourse('start-line')
              if (course) startCourse(course)
            }}
          />
        ) : null}
        {page === 'learn' ? (
          <LearningPath
            progress={progress}
            questions={quizQuestions}
            onDiagnostic={startDiagnostic}
            onStartCourse={startCourse}
          />
        ) : null}
        {page === 'signals' ? <SignalLibrary onPractice={() => startPractice('signal')} /> : null}
        {page === 'rules' ? <RuleLibrary onPractice={() => startPractice('rule')} /> : null}
        {page === 'progress' ? (
          <ProgressPage
            progress={progress}
            stats={stats}
            onStart={() => startPractice()}
          />
        ) : null}
        {page === 'practice' ? (
          <PracticeSession
            key={sessionQuestions.map((question) => question.id).join(':')}
            questions={sessionQuestions}
            sessionLabel={sessionConfig.label}
            diagnostic={sessionConfig.diagnostic}
            onAnswer={handleAnswer}
            onComplete={handleSessionComplete}
            onFinish={() => navigate(sessionConfig.diagnostic ? 'learn' : 'home')}
            onRetry={() => beginSession(sessionConfig, true)}
          />
        ) : null}
      </main>

      {page !== 'practice' ? (
        <>
          <footer className="site-footer">
            <p>
              このサイトは非公式の学習補助です。判断に迷う場合は、帆走指示書と公式規則を確認してください。
            </p>
            <div>
              <a href={RULESET.officialUrl} target="_blank" rel="noreferrer">
                World Sailing 公式規則
              </a>
              <a href={RULESET.jsafUrl} target="_blank" rel="noreferrer">
                JSAF 正誤表・規則情報
              </a>
              <a
                href="https://github.com/itou-daiki/sailing-rules-trainer/issues/new"
                target="_blank"
                rel="noreferrer"
              >
                問題の改善を提案
              </a>
              <span>
                内容確認：{RULESET.currentThrough}／{RULESET.checkedAt}
              </span>
            </div>
          </footer>
          <nav className="bottom-nav" aria-label="メイン">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                className={page === item.id ? 'is-active' : ''}
                aria-current={page === item.id ? 'page' : undefined}
                onClick={() => navigate(item.id)}
              >
                <span>{item.number}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </>
      ) : null}
    </div>
  )
}

interface HomePageProps {
  progress: LearningProgress
  stats: ReturnType<typeof getDashboardStats>
  onStart: () => void
  onDiagnostic: () => void
  onNavigate: (page: 'learn' | 'signals' | 'rules') => void
  onStartSequence: () => void
}

function HomePage({
  progress,
  stats,
  onStart,
  onDiagnostic,
  onNavigate,
  onStartSequence,
}: HomePageProps) {
  const hasDiagnostic = progress.diagnostic !== null
  return (
    <>
      <section className="hero">
        <div className="hero__mast-column">
          <MastMark />
          <span>OBSERVE</span>
          <span>DECIDE</span>
          <span>EXPLAIN</span>
        </div>
        <div className="hero__content">
          <p className="eyebrow">5 MINUTE DECK WORK</p>
          <h1>
            海に出る前に、
            <br />
            <span className="hero__command">判断を速くする。</span>
          </h1>
          <p className="hero__lead">
            信号旗と艇の位置を見て、自分で決める。答えた後に、理由と規則番号を確かめる。
          </p>
          <div className="hero__actions">
            <button
              type="button"
              className="button button--signal"
              onClick={hasDiagnostic ? onStart : onDiagnostic}
            >
              {hasDiagnostic ? '今日の5問を始める' : '5問で現在地を測る'}
              <span aria-hidden="true">→</span>
            </button>
            <p>登録不要・記録はこの端末だけに保存</p>
          </div>
        </div>
        <aside className="hero__status" aria-label="学習状況">
          <p>TODAY'S LOG</p>
          <dl>
            <div>
              <dt>今日の復習</dt>
              <dd>{stats.due}<small>問</small></dd>
            </div>
            <div>
              <dt>正答率</dt>
              <dd>{stats.accuracy}%</dd>
            </div>
            <div>
              <dt>連続日数</dt>
              <dd>{stats.currentStreak}<small>日</small></dd>
            </div>
          </dl>
        </aside>
      </section>

      <StartSequenceTrainer onPractice={onStartSequence} />

      <section className="home-route" aria-labelledby="route-title">
        <div className="section-heading">
          <p className="eyebrow">TWO WAYS IN</p>
          <h2 id="route-title">どちらから始めても、最後は状況判断へ</h2>
        </div>
        <div className="route-grid">
          <button type="button" className="route-panel route-panel--course" onClick={() => onNavigate('learn')}>
            <span className="route-panel__number">01</span>
            <span className="mini-log" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="route-panel__body">
              <strong>学習コース</strong>
              <small>現在地 → 5分練習 → 復習</small>
            </span>
            <span className="route-panel__arrow" aria-hidden="true">→</span>
          </button>
          <button type="button" className="route-panel route-panel--signal" onClick={() => onNavigate('signals')}>
            <span className="route-panel__number">02</span>
            <span className="mini-flag" aria-hidden="true"><i /><i /><i /></span>
            <span className="route-panel__body">
              <strong>信号旗</strong>
              <small>形 → 意味 → 艇上での行動</small>
            </span>
            <span className="route-panel__arrow" aria-hidden="true">→</span>
          </button>
          <button type="button" className="route-panel route-panel--rule" onClick={() => onNavigate('rules')}>
            <span className="route-panel__number">03</span>
            <span className="mini-course" aria-hidden="true"><i>A</i><i>B</i></span>
            <span className="route-panel__body">
              <strong>基本ルール</strong>
              <small>タック → 重なり → 優先関係</small>
            </span>
            <span className="route-panel__arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section className="learning-loop" aria-labelledby="loop-title">
        <div>
          <p className="eyebrow">TRAINING LOOP</p>
          <h2 id="loop-title">答えて終わりにしない</h2>
        </div>
        <ol>
          <li><span>01</span><strong>見る</strong><small>旗・風・艇の位置</small></li>
          <li><span>02</span><strong>決める</strong><small>まず自分で選ぶ</small></li>
          <li><span>03</span><strong>説明する</strong><small>判断の根拠を確認</small></li>
          <li><span>04</span><strong>また解く</strong><small>苦手問題を優先</small></li>
        </ol>
      </section>
    </>
  )
}

interface ProgressPageProps {
  progress: LearningProgress
  stats: ReturnType<typeof getDashboardStats>
  onStart: () => void
}

function ProgressPage({ progress, stats, onStart }: ProgressPageProps) {
  const skillStats = getSkillStats(progress, quizQuestions)
  const weakQuestions = quizQuestions
    .filter((question) => {
      const record = progress.answers[question.id]
      return record && record.correct / record.attempts < 0.8
    })
    .slice(0, 5)

  return (
    <section className="page-section progress-page" aria-labelledby="progress-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">PERSONAL LOG</p>
          <h1 id="progress-title">この端末の学習記録</h1>
          <p className="lead">記録はブラウザ内だけに保存され、外部へ送信しません。</p>
        </div>
        <button type="button" className="button button--ink" onClick={onStart}>
          今日の5問を始める
        </button>
      </div>

      <dl className="stats-ledger">
        <div><dt>今日の復習</dt><dd>{stats.due}<small>問</small></dd></div>
        <div><dt>正答率</dt><dd>{stats.accuracy}<small>%</small></dd></div>
        <div><dt>習得した問題</dt><dd>{stats.mastered}<small>問</small></dd></div>
        <div><dt>連続学習</dt><dd>{stats.currentStreak}<small>日</small></dd></div>
      </dl>

      <div className="progress-skills">
        <h2>5領域の習熟度</h2>
        <dl>
          {skillDefinitions.map((skill) => {
            const skillStat = skillStats.find((item) => item.id === skill.id)
            const mastery = skillStat?.mastery ?? 0
            return (
              <div key={skill.id}>
                <dt>
                  <span>{skill.name}</span>
                  <div aria-hidden="true"><i style={{ width: `${mastery}%` }} /></div>
                </dt>
                <dd>{mastery}%</dd>
              </div>
            )
          })}
        </dl>
      </div>

      <div className="weak-list">
        <h2>もう一度見る問題</h2>
        {weakQuestions.length > 0 ? (
          <ol>
            {weakQuestions.map((question) => {
              const record = progress.answers[question.id]
              return (
                <li key={question.id}>
                  <span>{question.category === 'signal' ? '信号旗' : 'ルール'}</span>
                  <p>{question.prompt}</p>
                  <strong>{record ? Math.round((record.correct / record.attempts) * 100) : 0}%</strong>
                </li>
              )
            })}
          </ol>
        ) : (
          <div className="empty-log">
            <p>まだ復習問題はありません。</p>
            <small>間違えた問題がここに並び、次の練習で優先されます。</small>
          </div>
        )}
      </div>
    </section>
  )
}
