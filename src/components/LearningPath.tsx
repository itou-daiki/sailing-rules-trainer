import { learningCourses, type LearningCourse } from '../data/courses'
import { skillDefinitions, type QuizQuestion } from '../data/content'
import {
  getSkillStats,
  type LearningProgress,
  type SkillStats,
} from '../domain/learningEngine'
import { CourseBoatDiagram } from './CourseBoatDiagram'

interface LearningPathProps {
  progress: LearningProgress
  questions: QuizQuestion[]
  onDiagnostic: () => void
  onStartCourse: (course: LearningCourse) => void
  onStartIntermediate: () => void
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
  onStartIntermediate,
}: LearningPathProps) {
  const stats = getSkillStats(progress, questions)
  const recommendedId = progress.diagnostic?.recommendedCourseId

  return (
    <section className="page-section course-page" aria-labelledby="course-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">TRAINING COURSE</p>
          <h1 id="course-title">迷わず進める、9つの練習</h1>
          <p className="lead">
            暗記の順ではなく、艇上で判断する順に並べています。各コースは5分前後です。
          </p>
        </div>
        <button type="button" className="button button--ink" onClick={onDiagnostic}>
          {progress.diagnostic ? '現在地を測り直す' : '9問で現在地を測る'}
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
          <p>最初に9領域を1問ずつ解くと、今の理解に合うスタート地点を提案します。</p>
        </div>
      )}

      <section className="level-map" aria-labelledby="level-map-title">
        <div className="level-map__heading">
          <p className="eyebrow">CHOOSE YOUR TRAINING</p>
          <h2 id="level-map-title">今の段階で、考える順番を変える</h2>
        </div>
        <div className="level-map__routes">
          <article>
            <span>BASIC / 初学者</span>
            <h3>見る → 決める</h3>
            <p>タック・重なり・ゾーンを先に確認し、判断の型を身につけます。</p>
            <small>下の9コースから始める</small>
          </article>
          <article className="level-map__intermediate">
            <span>APPLY / 中級</span>
            <h3>先に決める → 根拠を示す</h3>
            <p>ヒントなしで結論を固定してから、見た判断材料を選びます。</p>
            <button type="button" className="button button--ink" onClick={onStartIntermediate}>
              中級ケース5問を始める <span aria-hidden="true">→</span>
            </button>
          </article>
        </div>
        <p className="level-map__scope">
          ここでの「中級」は、艇が出会う場面に加え、障害物・違反後・推進・抗議までの状況判断です。艇速・操船・戦術は、水上練習と指導者のフィードバックが別に必要です。
        </p>
      </section>

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
              <CourseBoatDiagram
                kind={course.artwork}
                title={course.title}
                caption={course.artworkCaption}
              />
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
                <div
                  role="progressbar"
                  aria-label={`${course.title}の習熟度`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={mastery}
                >
                  <span style={{ width: `${mastery}%` }} />
                </div>
                <p>{mastery}%</p>
                <button
                  type="button"
                  aria-label={`${course.title}：${course.questionCount}問を始める`}
                  onClick={() => onStartCourse(course)}
                >
                  {course.questionCount}問を始める
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <section className="skill-chart" aria-labelledby="skill-title">
        <div>
          <p className="eyebrow">NINE SKILLS</p>
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
