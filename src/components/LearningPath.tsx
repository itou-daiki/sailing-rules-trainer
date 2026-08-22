import { learningCourses, type LearningCourse } from '../data/courses'
import { skillDefinitions, type QuizQuestion } from '../data/content'
import {
  getSkillStats,
  type LearningProgress,
  type SkillStats,
} from '../domain/learningEngine'

interface LearningPathProps {
  progress: LearningProgress
  questions: QuizQuestion[]
  onDiagnostic: () => void
  onStartCourse: (course: LearningCourse) => void
}

const courseMastery = (course: LearningCourse, stats: SkillStats[]) => {
  const relevant = stats.filter((stat) => course.skills.includes(stat.id))
  if (relevant.length === 0) return 0
  return Math.round(relevant.reduce((sum, stat) => sum + stat.mastery, 0) / relevant.length)
}

export function LearningPath({
  progress,
  questions,
  onDiagnostic,
  onStartCourse,
}: LearningPathProps) {
  const stats = getSkillStats(progress, questions)
  const recommendedId = progress.diagnostic?.recommendedCourseId

  return (
    <section className="page-section course-page" aria-labelledby="course-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">TRAINING COURSE</p>
          <h1 id="course-title">迷わず進める、5つの練習</h1>
          <p className="lead">
            暗記の順ではなく、艇上で判断する順に並べています。各コースは5分前後です。
          </p>
        </div>
        <button type="button" className="button button--ink" onClick={onDiagnostic}>
          {progress.diagnostic ? '現在地を測り直す' : '5問で現在地を測る'}
        </button>
      </div>

      {progress.diagnostic ? (
        <div className="diagnostic-note">
          <span>DECK CHECK</span>
          <p>
            前回 {progress.diagnostic.score}/{progress.diagnostic.total}問正解。おすすめから始めても、好きなコースを選んでも構いません。
          </p>
        </div>
      ) : (
        <div className="diagnostic-note diagnostic-note--open">
          <span>FIRST STEP</span>
          <p>最初に5領域を1問ずつ解くと、今の理解に合うスタート地点を提案します。</p>
        </div>
      )}

      <ol className="course-list">
        {learningCourses.map((course) => {
          const mastery = courseMastery(course, stats)
          const recommended = course.id === recommendedId
          return (
            <li key={course.id} className={recommended ? 'is-recommended' : ''}>
              <div className="course-list__order">
                <span>{String(course.order).padStart(2, '0')}</span>
                <small>{course.code}</small>
              </div>
              <div className="course-list__body">
                <div>
                  {recommended ? <span className="recommended-label">おすすめ</span> : null}
                  <h2>{course.title}</h2>
                  <p>{course.shortDescription}</p>
                </div>
                <div className="course-list__outcome">
                  <span>できるようになること</span>
                  <p>{course.outcome}</p>
                </div>
              </div>
              <div className="course-list__action">
                <div aria-label={`習熟度${mastery}%`}>
                  <span style={{ width: `${mastery}%` }} />
                </div>
                <p>{mastery}%</p>
                <button type="button" onClick={() => onStartCourse(course)}>
                  {course.questionCount}問を始める
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <section className="skill-chart" aria-labelledby="skill-title">
        <div>
          <p className="eyebrow">FIVE SKILLS</p>
          <h2 id="skill-title">領域ごとの現在地</h2>
        </div>
        <dl>
          {skillDefinitions.map((skill) => {
            const stat = stats.find((item) => item.id === skill.id)
            return (
              <div key={skill.id}>
                <dt>
                  <strong>{skill.name}</strong>
                  <small>{skill.description}</small>
                </dt>
                <dd>{stat?.mastery ?? 0}%</dd>
              </div>
            )
          })}
        </dl>
      </section>
    </section>
  )
}
