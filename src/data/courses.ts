import type { SkillId } from './content'

export type CourseArtworkKind = 'signals' | 'start' | 'meeting' | 'room' | 'mark' | 'race'

export interface LearningCourse {
  id: string
  order: number
  code: string
  title: string
  shortDescription: string
  outcome: string
  artwork: CourseArtworkKind
  artworkCaption: string
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
    artwork: 'signals',
    artworkCaption: '旗を見る → 次の行動を決める',
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
    artwork: 'start',
    artworkCaption: '時間を読む → ラインへ入る',
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
    artwork: 'meeting',
    artworkCaption: '帆の側を見る → 避ける艇を決める',
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
    artwork: 'room',
    artworkCaption: '優先でも → 相手の逃げ場を残す',
    skills: ['rule-limitations'],
    questionCount: 5,
  },
  {
    id: 'mark-room',
    order: 5,
    code: 'WATER 03',
    title: 'マークを回る',
    shortDescription: '3艇身ゾーン、内側・外側、ゾーン内のタック',
    outcome: '規則18を使う場面と、マークルームを与える艇を判断できる。',
    artwork: 'mark',
    artworkCaption: 'ゾーンへ入る瞬間 → 重なりと内外を見る',
    skills: ['mark-room'],
    questionCount: 6,
  },
  {
    id: 'race-ready',
    order: 6,
    code: 'RACE CHECK',
    title: 'レース前チェック',
    shortDescription: '信号旗と規則を混ぜた実戦確認',
    outcome: '異なる場面でも判断順序を転用できる。',
    artwork: 'race',
    artworkCaption: '信号と規則を → 1つの判断へ',
    skills: [
      'start-signals',
      'course-signals',
      'safety-signals',
      'right-of-way',
      'rule-limitations',
      'mark-room',
    ],
    questionCount: 8,
  },
]

export const getCourse = (id: string) => learningCourses.find((course) => course.id === id)
