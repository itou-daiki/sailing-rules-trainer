import type { SkillId } from './content'

export interface LearningCourse {
  id: string
  order: number
  code: string
  title: string
  shortDescription: string
  outcome: string
  skills: SkillId[]
  questionCount: number
}

export const learningCourses: LearningCourse[] = [
  {
    id: 'signal-watch',
    order: 1,
    code: 'DECK 01',
    title: '旗を見て動く',
    shortDescription: 'スタート・安全・コース信号の基礎',
    outcome: '旗を見た直後の行動を言える。',
    skills: ['start-signals', 'course-signals', 'safety-signals'],
    questionCount: 6,
  },
  {
    id: 'start-line',
    order: 2,
    code: 'DECK 02',
    title: '5分前からスタート',
    shortDescription: '予告、準備、1分、リコール',
    outcome: '信号を時系列で読み、戻り方を選べる。',
    skills: ['start-signals'],
    questionCount: 5,
  },
  {
    id: 'boats-meet',
    order: 3,
    code: 'WATER 01',
    title: '艇が出会うとき',
    shortDescription: '反対タック、風上・風下、前・後',
    outcome: '規則10〜13の判断順序を使える。',
    skills: ['right-of-way'],
    questionCount: 5,
  },
  {
    id: 'right-with-limits',
    order: 4,
    code: 'WATER 02',
    title: '航路権にも限界がある',
    shortDescription: '接触回避、取得、進路変更',
    outcome: '航路権艇側の義務まで説明できる。',
    skills: ['rule-limitations'],
    questionCount: 5,
  },
  {
    id: 'race-ready',
    order: 5,
    code: 'RACE CHECK',
    title: 'レース前チェック',
    shortDescription: '信号旗と規則を混ぜた実戦確認',
    outcome: '異なる場面でも判断順序を転用できる。',
    skills: [
      'start-signals',
      'course-signals',
      'safety-signals',
      'right-of-way',
      'rule-limitations',
    ],
    questionCount: 8,
  },
]

export const getCourse = (id: string) => learningCourses.find((course) => course.id === id)
