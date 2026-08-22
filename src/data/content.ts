export type FlagArtworkKind =
  | 'ap'
  | 'ap-h'
  | 'ap-a'
  | 'ap-numeral'
  | 'p'
  | 'i'
  | 'z'
  | 'u'
  | 'black'
  | 'x'
  | 'first-sub'
  | 's'
  | 'c'
  | 'c-starboard'
  | 'c-port'
  | 'c-shorter'
  | 'c-longer'
  | 'y'
  | 'v'
  | 'n'
  | 'n-h'
  | 'n-a'
  | 'l'
  | 'm'
  | 'orange'
  | 'blue'
  | 'o'
  | 'r'
  | 'yellow'
  | 'red'
  | 'd'

export type SignalStage =
  | 'スタート前'
  | 'スタート'
  | 'レース中'
  | 'コース'
  | '安全'
  | '追加信号'

export interface RaceSignal {
  id: string
  code: string
  name: string
  artwork: FlagArtworkKind
  stage: SignalStage
  summary: string
  sailorAction: string
  detail: string
  reference: string
  variants?: Array<{ code: string; meaning: string }>
}

export interface CoreRule {
  id: string
  number: string
  title: string
  takeaway: string
  example: string
  lookFor: string[]
  caution: string
}

export interface BoatPosition {
  id: 'A' | 'B'
  label: string
  x: number
  y: number
  heading: number
  tack: 'port' | 'starboard'
}

export interface ScenarioDiagram {
  windDirection: 'north' | 'south' | 'east' | 'west'
  boats: BoatPosition[]
  overlap?: boolean
  mark?: { x: number; y: number; zone?: boolean }
  path?: { boat: 'A' | 'B'; d: string }
}

export type QuestionCategory = 'signal' | 'rule'

export type SkillId =
  | 'start-signals'
  | 'course-signals'
  | 'safety-signals'
  | 'right-of-way'
  | 'rule-limitations'
  | 'mark-room'

export interface ObservationCheck {
  prompt: string
  choices: string[]
  correctIndex: number
  feedback: string[]
}

export interface SkillDefinition {
  id: SkillId
  shortName: string
  name: string
  description: string
}

export interface QuizQuestion {
  id: string
  category: QuestionCategory
  skill: SkillId
  difficulty: 1 | 2 | 3
  prompt: string
  choices: string[]
  correctIndex: number
  conclusion: string
  points: string[]
  formal: string
  choiceFeedback?: string[]
  observation?: ObservationCheck
  flagId?: string
  diagram?: ScenarioDiagram
}

export const skillDefinitions: SkillDefinition[] = [
  {
    id: 'start-signals',
    shortName: 'スタート',
    name: 'スタート信号',
    description: '予告・準備・リコール・延期を、時系列で判断する。',
  },
  {
    id: 'course-signals',
    shortName: 'コース',
    name: 'コースと運営信号',
    description: '短縮・変更・中止と、ラインの位置を読み取る。',
  },
  {
    id: 'safety-signals',
    shortName: '安全',
    name: '安全信号',
    description: 'PFDと安全通信の指示へ、迷わず反応する。',
  },
  {
    id: 'right-of-way',
    shortName: '航路権',
    name: '艇が出会うとき',
    description: 'タック・重なり・前後から、避ける艇を判定する。',
  },
  {
    id: 'rule-limitations',
    shortName: '制限',
    name: '航路権艇の制限',
    description: '接触回避、航路権の取得、進路変更の限界を判断する。',
  },
  {
    id: 'mark-room',
    shortName: 'マーク',
    name: 'マークルーム',
    description: 'ゾーンへ入る瞬間の重なりと内側・外側から、回航の余地を判断する。',
  },
]

export const RULESET = {
  edition: 'RRS 2025–2028',
  currentThrough: 'JSAF正誤表-5（2026年5月30日）',
  checkedAt: '2026年8月23日',
  officialUrl: 'https://www.sailing.org/racingrules/',
  jsafUrl: 'https://www.jsaf.or.jp/hp/about/committee/rule/rule-reg',
} as const

// Source: World Sailing, RRS 2025–2028 “Race Signals” (current through 2026-04-20)
// https://www.sailing.org/wp-content/uploads/2026/04/2025-2028-RRS-with-Changes-and-Corrections.pdf
export const raceSignals: RaceSignal[] = [
  {
    id: 'ap',
    code: 'AP',
    name: '回答旗',
    artwork: 'ap',
    stage: 'スタート前',
    summary: 'スタートを延期する。',
    sailorAction: '新しい予告信号を待つ。ラインへ突っ込まない。',
    detail: '降下後、通常は1分で予告信号。別の延期・中止信号が続く場合もある。',
    reference: 'レース信号：延期信号',
  },
  {
    id: 'ap-h',
    code: 'AP + H',
    name: 'AP＋H旗',
    artwork: 'ap-h',
    stage: 'スタート前',
    summary: 'まだ始まっていないレースを延期。続きは陸上で知らせる。',
    sailorAction: '海上でスタートを待たず、帰着後に公式掲示と次の信号を確認する。',
    detail: '回答旗（AP）の下にH旗。単独のAPと違い、次の案内場所が「陸上」になる。',
    reference: 'レース信号：延期信号（AP over H）',
  },
  {
    id: 'ap-a',
    code: 'AP + A',
    name: 'AP＋A旗',
    artwork: 'ap-a',
    stage: 'スタート前',
    summary: 'まだ始まっていないレースを延期し、今日はもうレースを行わない。',
    sailorAction: '帰着する。今日の再スタートを待たず、次の日程を公式掲示で確認する。',
    detail: '回答旗（AP）の下にA旗。「陸上で続報」のH旗と、「今日は終了」のA旗を見分ける。',
    reference: 'レース信号：延期信号（AP over A）',
  },
  {
    id: 'ap-numeral',
    code: 'AP + 1–9',
    name: 'AP＋数字旗1–9',
    artwork: 'ap-numeral',
    stage: 'スタート前',
    summary: '予定されたスタート時刻から、数字旗と同じ時間だけ延期する。',
    sailorAction: '数字旗を読み、予定時刻へその時間を足して次の動きを組み立てる。',
    detail: '数字旗1なら1時間、9なら9時間の延期。数字は「今から」ではなく、予定されたスタート時刻から数える。',
    reference: 'レース信号：延期信号（AP over a Numeral Pennant 1–9）',
    variants: Array.from({ length: 9 }, (_, index) => ({
      code: `数字旗 ${index + 1}`,
      meaning: `${index + 1}時間延期`,
    })),
  },
  {
    id: 'p',
    code: 'P',
    name: 'P旗',
    artwork: 'p',
    stage: 'スタート前',
    summary: '通常の準備信号。',
    sailorAction: 'スタート時刻とラインへの進入を組み立てる。',
    detail: '特別なスタート・ペナルティを示すI・Z・U・黒旗とは区別する。',
    reference: 'レース信号：準備信号',
  },
  {
    id: 'i',
    code: 'I',
    name: 'I旗',
    artwork: 'i',
    stage: 'スタート前',
    summary: 'ラウンド・アン・エンド規則を適用する。',
    sailorAction: '早くラインを越えたら、延長線の外側を回って戻る。',
    detail: 'スタート前1分間のライン越えに関する規則。戻り方まで覚える。',
    reference: '規則30.1',
  },
  {
    id: 'z',
    code: 'Z',
    name: 'Z旗',
    artwork: 'z',
    stage: 'スタート前',
    summary: 'スタート前1分間、三角形に入ると20%得点ペナルティー。',
    sailorAction: '残り1分は、スタート両端と第1マークでできる三角形の外にいる。',
    detail: '違反艇には審問なしで20%得点ペナルティーが課される。U旗や黒旗の「失格」と区別する。',
    reference: '規則30.2 Z旗規則',
  },
  {
    id: 'u',
    code: 'U',
    name: 'U旗',
    artwork: 'u',
    stage: 'スタート前',
    summary: 'スタート前1分間、スタート・マークと第1マークでできる三角形に入らない。',
    sailorAction: '残り1分は三角形の外で待つ。',
    detail: '違反してスタートした艇は、原則としてそのレースを失格。一般リコールや中止時の扱いは黒旗と異なる。',
    reference: '規則30.3',
  },
  {
    id: 'black',
    code: 'BLACK',
    name: '黒旗',
    artwork: 'black',
    stage: 'スタート前',
    summary: '最も厳しいスタート・ペナルティを適用する。',
    sailorAction: '残り1分は三角形へ入らない。',
    detail: '違反艇は識別され、その後に一般リコールや中止となっても厳しい制限を受ける。',
    reference: '規則30.4',
  },
  {
    id: 'x',
    code: 'X',
    name: 'X旗',
    artwork: 'x',
    stage: 'スタート',
    summary: '個別リコール。',
    sailorAction: '自艇が早かった可能性を判断し、スタートし直す。',
    detail: '音響信号とともに掲揚される。旗が下りるまで待つ、という意味ではない。',
    reference: '規則29.1',
  },
  {
    id: 'first-sub',
    code: '1st SUB',
    name: '第一代表旗',
    artwork: 'first-sub',
    stage: 'スタート',
    summary: 'ゼネラル・リコール。',
    sailorAction: '全艇でスタートをやり直す。新しい予告信号を待つ。',
    detail: '降下後、通常は1分で次の予告信号。X旗の個別リコールと区別する。',
    reference: '規則29.2',
  },
  {
    id: 'n',
    code: 'N',
    name: 'N旗',
    artwork: 'n',
    stage: 'レース中',
    summary: '進行中のレースを中止する。',
    sailorAction: 'スタート・エリアへ戻り、次の信号を待つ。',
    detail: '追加の旗と組み合わせると、その日の予定全体に関する意味が加わる。',
    reference: 'レース信号：中止信号',
  },
  {
    id: 'n-h',
    code: 'N + H',
    name: 'N＋H旗',
    artwork: 'n-h',
    stage: 'レース中',
    summary: '進行中の全レースを中止。続きは陸上で知らせる。',
    sailorAction: 'フィニッシュを目指さず帰着し、陸上の公式掲示と次の信号を確認する。',
    detail: 'N旗の下にH旗。単独Nの「スタート・エリアへ戻る」ではなく、続報は陸上で出る。',
    reference: 'レース信号：中止信号（N over H）',
  },
  {
    id: 'n-a',
    code: 'N + A',
    name: 'N＋A旗',
    artwork: 'n-a',
    stage: 'レース中',
    summary: '進行中の全レースを中止し、今日はもうレースを行わない。',
    sailorAction: 'フィニッシュを目指さず帰着する。今日の再スタートは待たない。',
    detail: 'N旗の下にA旗。「中止して陸上で続報」のN＋Hと、「今日は終了」のN＋Aを見分ける。',
    reference: 'レース信号：中止信号（N over A）',
  },
  {
    id: 's',
    code: 'S',
    name: 'S旗',
    artwork: 's',
    stage: 'コース',
    summary: 'コースを短縮する。',
    sailorAction: 'フィニッシュ位置を確認し、そのラインへ向かう。',
    detail: '掲揚場所によって、どこがフィニッシュになるかが決まる。',
    reference: '規則32.2',
  },
  {
    id: 'c',
    code: 'C',
    name: 'C旗',
    artwork: 'c',
    stage: 'コース',
    summary: '次のレグの位置が変更された。',
    sailorAction: '反復音響信号を聞き、方位や距離の表示を読む。',
    detail: '変更された次のマークへ向かう。単に「コース短縮」ではない。',
    reference: '規則33',
  },
  {
    id: 'c-starboard',
    code: 'C + ▲',
    name: 'C旗＋緑三角（右へ）',
    artwork: 'c-starboard',
    stage: 'コース',
    summary: '次のマークが、元の位置より右舷側へ移った。',
    sailorAction: '反復音響信号を聞き、緑三角を確認して新しい右舷側の位置へ向かう。',
    detail: 'C旗は次のマーク位置の変更。緑の三角形は「右舷側へ」を示す。',
    reference: '規則33／レース信号：Changing the Next Leg',
  },
  {
    id: 'c-port',
    code: 'C + ■',
    name: 'C旗＋赤四角（左へ）',
    artwork: 'c-port',
    stage: 'コース',
    summary: '次のマークが、元の位置より左舷側へ移った。',
    sailorAction: '反復音響信号を聞き、赤四角を確認して新しい左舷側の位置へ向かう。',
    detail: 'C旗は次のマーク位置の変更。赤い長方形は「左舷側へ」を示す。',
    reference: '規則33／レース信号：Changing the Next Leg',
  },
  {
    id: 'c-shorter',
    code: 'C + −',
    name: 'C旗＋マイナス（短く）',
    artwork: 'c-shorter',
    stage: 'コース',
    summary: '次のレグの長さが短くなった。',
    sailorAction: '反復音響信号とマイナス表示を確認し、近くなった次のマークを探す。',
    detail: 'コース全体の短縮を示すS旗ではない。C旗とマイナスは「次のレグが短くなる」。',
    reference: '規則33／レース信号：Changing the Next Leg',
  },
  {
    id: 'c-longer',
    code: 'C + ＋',
    name: 'C旗＋プラス（長く）',
    artwork: 'c-longer',
    stage: 'コース',
    summary: '次のレグの長さが長くなった。',
    sailorAction: '反復音響信号とプラス表示を確認し、遠くなった次のマークを探す。',
    detail: 'C旗とプラスは「次のレグが長くなる」。方向変更の緑三角・赤四角と区別する。',
    reference: '規則33／レース信号：Changing the Next Leg',
  },
  {
    id: 'm',
    code: 'M',
    name: 'M旗',
    artwork: 'm',
    stage: 'コース',
    summary: 'この物体が、なくなったマークの代わり。',
    sailorAction: 'M旗を掲げる艇や物体を、指定された側で回る。',
    detail: '反復音響信号が伴う。C旗の「次のレグ変更」と混同しない。',
    reference: '規則34',
  },
  {
    id: 'l',
    code: 'L',
    name: 'L旗',
    artwork: 'l',
    stage: 'レース中',
    summary: '掲揚場所によって「通知あり」または「ついて来い」。',
    sailorAction: '陸上なら掲示を確認。海上なら近づくか、その艇について行く。',
    detail: '同じ旗でも陸上と海上で行動が変わるため、場所と状況をセットで読む。',
    reference: 'レース信号：その他の信号',
  },
  {
    id: 'y',
    code: 'Y',
    name: 'Y旗',
    artwork: 'y',
    stage: '安全',
    summary: '個人用浮揚用具を着用する。',
    sailorAction: 'ただちにPFDを正しく着用する。',
    detail: 'ウェットスーツやドライスーツだけでは個人用浮揚用具とみなされない。',
    reference: '規則40',
  },
  {
    id: 'v',
    code: 'V',
    name: 'V旗',
    artwork: 'v',
    stage: '安全',
    summary: '安全に関する指示のため、通信チャンネルを聴取する。',
    sailorAction: '指定された無線・通信チャンネルを確認する。',
    detail: '荒天や事故対応など、安全指示を受けるための信号。',
    reference: '規則37',
  },
  {
    id: 'orange',
    code: 'ORANGE',
    name: 'オレンジ旗',
    artwork: 'orange',
    stage: 'スタート',
    summary: 'スタート・ラインの一端を示す。',
    sailorAction: '反対側の端と結んで、スタート・ラインを読む。',
    detail: 'レース委員会艇上の旗ざおなどに掲げられる。',
    reference: 'レース信号：その他の信号',
  },
  {
    id: 'blue',
    code: 'BLUE',
    name: '青旗',
    artwork: 'blue',
    stage: 'レース中',
    summary: 'レース委員会艇がフィニッシュ位置にいる。',
    sailorAction: 'もう一方の端と結んで、フィニッシュ・ラインを読む。',
    detail: 'スタートのオレンジ旗と対で覚えると見分けやすい。',
    reference: 'レース信号：その他の信号',
  },
]

// These signals are not all part of the RRS inside-cover “Race Signals” table.
// Their meanings depend on Appendix P, another rule, class rules, or the sailing instructions.
// RRS source: https://www.sailing.org/wp-content/uploads/2026/04/2025-2028-RRS-with-Changes-and-Corrections.pdf
// Current JSAF SI guides: https://www.jsaf.or.jp/hp/about/committee/rule/rule-form
export const specialSignals: RaceSignal[] = [
  {
    id: 'o-rule42',
    code: 'O',
    name: 'O旗（規則42の緩和）',
    artwork: 'o',
    stage: '追加信号',
    summary: 'クラス規則で定めたパンピング、ロッキング、ウーチングを許可する。',
    sailorAction: '「何が許されるか」をクラス規則で確認する。O旗だけでスカリングまで許されるとは考えない。',
    detail: '付則P5が適用されるクラスだけで使用する。スタート後にマークで反復音響信号とともに出た場合は、そのマークを通過した後からクラス規則の緩和が適用される。',
    reference: '付則P5.1、P5.2、P5.3(a)',
  },
  {
    id: 'r-rule42',
    code: 'R',
    name: 'R旗（規則42へ戻る）',
    artwork: 'r',
    stage: '追加信号',
    summary: 'O旗による緩和を終え、クラス規則で変更された規則42へ戻す。',
    sailorAction: 'スタート後にマークで見たら、そのマーク通過後はO旗で許されていた動作をやめる。',
    detail: '付則P5が適用され、先にO旗が使われた場合の信号。スタート後は反復音響信号とともにマークで表示され、そのマーク通過後から適用される。',
    reference: '付則P5.2(b)、P5.3(b)',
  },
  {
    id: 'yellow-penalty',
    code: 'YELLOW',
    name: '黄旗（ペナルティー）',
    artwork: 'yellow',
    stage: '追加信号',
    summary: '誰がどう示したかで、得点ペナルティーまたは規則42の判定になる。',
    sailorAction: '艇が自ら掲げた旗か、ジャッジが音と声を伴って自艇へ向けた旗かを確認する。',
    detail: '帆走指示書等で得点ペナルティーを採用する場合、艇は黄旗を掲げてフィニッシュまで保持する。付則Pでは、ジャッジが音響信号、黄旗の指示、声で艇を特定すると規則42のペナルティーとなり、1回目は2回転が基本。',
    reference: '規則44.3／付則P1.2、P2',
  },
  {
    id: 'red-protest',
    code: 'RED',
    name: '赤旗（抗議の意思）',
    artwork: 'red',
    stage: '追加信号',
    summary: '艇体長が6mを超える艇が、抗議の意思を示すときに掲げる。',
    sailorAction: '最初の合理的な機会に「プロテスト」と声をかけ、必要なら赤旗を目立つように掲げる。',
    detail: '艇体長6m以下の艇には赤旗掲揚の要件がない。必要な場合は、レース中でなくなるまで掲げ続ける。危険、負傷、重大な損傷などには通知要件の例外がある。',
    reference: '規則60.2 抗議の意思',
  },
  {
    id: 'd-ashore',
    code: 'D',
    name: 'D旗（出艇開始・大会指定）',
    artwork: 'd',
    stage: '追加信号',
    summary: '出艇開始の合図としてよく使われるが、意味と待ち時間は帆走指示書で決まる。',
    sailorAction: '掲揚前に出艇してよいか、掲揚後何分以降に予告信号かを帆走指示書で確認する。',
    detail: 'RRS巻頭の共通信号ではない。World Sailingの帆走指示書ガイドでは、音響1声とともに掲揚し、艇が出艇できることや予告信号までの最短時間を大会ごとに定める例が示されている。',
    reference: '大会の帆走指示書（SI）',
  },
]

export const allSignals: RaceSignal[] = [...raceSignals, ...specialSignals]

export const coreRules: CoreRule[] = [
  {
    id: 'r10',
    number: '10',
    title: '反対タック',
    takeaway: '帆が右側にあるポート艇が、帆が左側にあるスターボード艇を避ける。',
    example: 'A艇の帆が右、B艇の帆が左なら、A艇が早めに進路を変えてB艇を避ける。',
    lookFor: ['両艇のブームがどちら側か', '風を受けている側が同じか違うか'],
    caution: '「右から来た艇」ではなく、タックで判断する。',
  },
  {
    id: 'r11',
    number: '11',
    title: '同一タックでオーバーラップ',
    takeaway: '同じタックで横に重なったら、風に近い風上艇が避ける。',
    example: '2艇が同じ向きで横に並んだら、風に近い艇が少し離れて衝突を避ける。',
    lookFor: ['両艇が同じタックか', '横に重なる位置関係か', 'どちらが風上側か'],
    caution: '風下艇が進路を変えるときは、規則16も関係する。',
  },
  {
    id: 'r12',
    number: '12',
    title: '同一タックでオーバーラップなし',
    takeaway: '同じタックで前後に離れていたら、後ろの艇が前の艇を避ける。',
    example: '追いついた艇は、前の艇のすぐ後ろへ入らず、進路を変えて間隔を保つ。',
    lookFor: ['同じタックか', '艇や装備の後端より完全に後ろか'],
    caution: 'オーバーラップが生じた瞬間から、規則11などへ判断が切り替わる。',
  },
  {
    id: 'r13',
    number: '13',
    title: 'タッキング中',
    takeaway: 'タックを始めた艇は、新しい向きで走れる状態になるまで他艇を避ける。',
    example: 'バウが風を横切っている途中は、タック前に優先だった艇でも避ける側になる。',
    lookFor: ['バウが風位を越えたか', '新しいタックのクローズホールドになったか'],
    caution: 'タック前に優先でも、タッキング中は避ける側になる。',
  },
  {
    id: 'r14',
    number: '14',
    title: '接触の回避',
    takeaway: '優先艇でも、合理的に可能なら接触を避ける。',
    example: '相手が避けないことが明らかなら、優先艇も衝突するまで直進せず回避する。',
    lookFor: ['相手が避けていないことが明らかになった時点', '避ける動作が可能だったか'],
    caution: '優先権は「ぶつかってよい権利」ではない。',
  },
  {
    id: 'r15',
    number: '15',
    title: '航路権を得るとき',
    takeaway: '新しく優先側になった艇は、相手が避ける時間と場所を最初に残す。',
    example: 'タックを終えて優先側になっても、すぐ相手の目前へ入ってはいけない。',
    lookFor: ['いつ航路権が入れ替わったか', '相手に対応時間と空間があったか'],
    caution: '相手の動作によって航路権を得た場合など、例外がある。',
  },
  {
    id: 'r16',
    number: '16',
    title: '航路変更',
    takeaway: '優先側が向きを変えるときも、相手の逃げ道を残す。',
    example: '避ける艇の進行方向へ急に曲がり、逃げ道をふさぐ進路変更はできない。',
    lookFor: ['航路権艇の進路が変わったか', '避ける艇の逃げ道が残っていたか'],
    caution: '航路権があることと、自由に進路変更できることは同じではない。',
  },
  {
    id: 'r17',
    number: '17',
    title: '同一タックでのプロパー・コース',
    takeaway: '後ろから風下側に重なった艇は、相手がいなくても選ぶ進路より上り過ぎない。',
    example: '追いついて風下側へ入った艇は、相手を押し上げるためだけに大きくラフできない場合がある。',
    lookFor: ['後ろからオーバーラップしたか', '2艇身以内だったか', 'オーバーラップが続いているか'],
    caution: '成立条件が多い。単に「風下艇はラフできない」と覚えない。',
  },
  {
    id: 'r18',
    number: '18',
    title: 'マークルーム',
    takeaway: 'ゾーンへ入る瞬間を見て、内側艇や先に入った艇へマークを回る余地を与える。',
    example: '同じタックで横に重なったまま一方がゾーンへ入ったら、外側艇が内側艇へ回航する場所を残す。',
    lookFor: ['どちらかが3艇身のゾーンへ入った瞬間', 'その瞬間に重なっていたか', '内側・外側のどちらか'],
    caution: '「内側なら必ず優先」と覚えない。反対タックやゾーン内のタックなど、規則18を使わない場面や追加制限がある。',
  },
]

const signalQuestion = (
  id: string,
  flagId: string,
  prompt: string,
  choices: string[],
  correctIndex: number,
  conclusion: string,
  points: string[],
  formal: string,
  difficulty: 1 | 2 | 3 = 1,
): QuizQuestion => ({
  id,
  category: 'signal',
  skill:
    flagId === 'y' || flagId === 'v'
      ? 'safety-signals'
      : [
          's',
          'c',
          'c-starboard',
          'c-port',
          'c-shorter',
          'c-longer',
          'n',
          'n-h',
          'n-a',
          'm',
          'l',
          'orange',
          'blue',
          'o-rule42',
          'r-rule42',
          'yellow-penalty',
          'red-protest',
        ].includes(flagId)
        ? 'course-signals'
        : 'start-signals',
  difficulty,
  flagId,
  prompt,
  choices,
  correctIndex,
  conclusion,
  points,
  formal,
})

export const quizQuestions: QuizQuestion[] = [
  signalQuestion(
    'q-ap-meaning',
    'ap',
    'この旗が掲揚されました。まず、どう判断する？',
    ['スタートが延期された', '全艇がスタートをやり直す', 'コースが短縮された'],
    0,
    'スタートは延期です。新しい信号を待ちます。',
    ['回答旗（AP）かを確認する', '降下後すぐではなく、通常は1分後に予告信号'],
    'レース信号「延期信号」',
  ),
  signalQuestion(
    'q-x-recall',
    'x',
    'スタート直後、この旗と音響信号。自艇はライン付近でした。どうする？',
    ['全艇で待機する', '自艇が早かったか判断し、必要なら戻る', 'そのまま第1マークへ向かう'],
    1,
    '個別リコールです。自艇が対象かを判断し、スタートし直します。',
    ['X旗は「個別」', '第一代表旗の「全艇やり直し」と区別する'],
    '規則29.1 個別リコール',
  ),
  signalQuestion(
    'q-first-sub',
    'first-sub',
    'この旗がスタート直後に掲揚されました。次の行動は？',
    ['全艇でスタートをやり直す', '早かった艇だけ戻る', '直ちに帰港する'],
    0,
    'ゼネラル・リコールです。全艇がスタートをやり直します。',
    ['三角形の第一代表旗を見分ける', '降下後、通常は1分で次の予告信号'],
    '規則29.2 ゼネラル・リコール',
  ),
  signalQuestion(
    'q-u-minute',
    'u',
    'U旗が準備信号です。スタート1分前から避ける場所は？',
    ['スタート・マークと第1マークでできる三角形', 'スタート・ラインの風下10艇身', 'コース全域'],
    0,
    '残り1分は、スタート両端と第1マークでできる三角形に入りません。',
    ['U旗の赤白4分割を確認', '「ラインだけ」ではなく三角形で考える'],
    '規則30.3 U旗規則',
  ),
  signalQuestion(
    'q-s-course',
    's',
    'この旗がコース上で掲揚されています。何が変わる？',
    ['フィニッシュ位置', '次のマークの方位だけ', 'スタート時刻'],
    0,
    'コース短縮です。掲揚場所に応じたラインでフィニッシュします。',
    ['白地に青い四角がS旗', 'C旗の「次のレグ変更」と区別する'],
    '規則32.2 短縮コース',
  ),
  signalQuestion(
    'q-c-change',
    'c',
    '反復音響信号とともにこの旗。何を探す？',
    ['変更された次のレグの表示', '帰港命令', '個別リコール艇の番号'],
    0,
    '次のレグが変更されています。方位や距離の表示を探します。',
    ['青・白・赤の横縞がC旗', '次のマークまでの方向・長さを確認'],
    '規則33 コースの次のレグの変更',
  ),
  signalQuestion(
    'q-y-pfd',
    'y',
    'この旗が掲揚されました。最優先の行動は？',
    ['PFDを正しく着用する', '艇を曳航する', 'レース委員会艇について行く'],
    0,
    '個人用浮揚用具（PFD）を着用します。',
    ['赤黄の斜め縞がY旗', '安全に直結する信号なので即時に行動'],
    '規則40 個人用浮揚用具',
  ),
  signalQuestion(
    'q-v-radio',
    'v',
    'この旗が掲揚されました。何を確認する？',
    ['安全指示の通信チャンネル', 'スタート順位', '次のレースのクラス旗'],
    0,
    '安全に関する指示を受けるため、指定チャンネルを聴取します。',
    ['白地に赤いXがV旗', 'PFDのY旗とは役割が違う'],
    '規則37 捜索および救助の指示',
  ),
  signalQuestion(
    'q-ap-h-ashore',
    'ap-h',
    '回答旗の下にH旗が掲揚されました。次の案内はどこで確認する？',
    ['陸上', '第1マーク', 'フィニッシュ艇'],
    0,
    'まだ始まっていないレースは延期され、続きの信号は陸上で出ます。',
    ['上の回答旗で「延期」を読む', '下のH旗で「続報は陸上」を読む'],
    'レース信号「AP over H」',
    2,
  ),
  signalQuestion(
    'q-ap-a-today',
    'ap-a',
    '回答旗の下にA旗が掲揚されました。今日のレースは？',
    ['すべて1時間だけ延期', 'まだ始まっていないレースは今日は行わない', '進行中の艇だけ続行'],
    1,
    '未スタートのレースは延期され、今日はもうレースを行いません。',
    ['APは未スタートのレースを延期', 'A旗の組み合わせは「今日は終了」'],
    'レース信号「AP over A」',
    2,
  ),
  signalQuestion(
    'q-ap-numeral-delay',
    'ap-numeral',
    '回答旗の下に数字旗3。延期時間はどう読む？',
    ['掲揚から3分', '予定スタート時刻から3時間', '現在時刻から30分'],
    1,
    '数字旗3なら、予定されたスタート時刻から3時間の延期です。',
    ['数字1〜9と延期時間1〜9時間が対応', '基準は「予定されたスタート時刻」'],
    'レース信号「AP over a Numeral Pennant 1–9」',
    2,
  ),
  signalQuestion(
    'q-z-penalty',
    'z',
    'Z旗の残り1分で、艇体がスタート両端と第1マークの三角形に入りました。基本のペナルティーは？',
    ['20%得点ペナルティー', '必ず失格', '警告だけ'],
    0,
    'Z旗規則では、審問なしに20%得点ペナルティーが課されます。',
    ['残り1分の三角形を見る', 'U旗・黒旗の失格と区別する'],
    '規則30.2 Z旗規則',
    2,
  ),
  signalQuestion(
    'q-n-h-ashore',
    'n-h',
    'レース中、N旗の下にH旗。まずどうする？',
    ['レースを続けてフィニッシュする', '帰着し、陸上で続報を確認する', 'スタート・エリアで必ず再スタートする'],
    1,
    '進行中の全レースは中止され、続きの信号は陸上で出ます。',
    ['N旗で「進行中の全レースを中止」', 'H旗で「続報は陸上」'],
    'レース信号「N over H」',
    2,
  ),
  signalQuestion(
    'q-n-a-today',
    'n-a',
    'レース中、N旗の下にA旗。今日の予定は？',
    ['中止後すぐ同じ海面で再スタート', '進行中の全レースを中止し、今日は終了', 'このクラスだけ1時間延期'],
    1,
    '進行中の全レースは中止され、今日はもうレースを行いません。',
    ['N旗で「中止」', 'A旗で「今日は終了」'],
    'レース信号「N over A」',
    2,
  ),
  signalQuestion(
    'q-c-starboard',
    'c-starboard',
    'C旗と緑の三角形が表示されています。次のマークはどちらへ移った？',
    ['元の位置より右舷側', '元の位置より左舷側', '距離だけ短くなった'],
    0,
    '緑の三角形は、次のマークが右舷側へ移ったことを示します。',
    ['C旗で次のマーク位置の変更', '緑三角＝右舷側'],
    '規則33／レース信号「Changing the Next Leg」',
    2,
  ),
  signalQuestion(
    'q-c-port',
    'c-port',
    'C旗と赤い長方形が表示されています。次のマークはどちらへ移った？',
    ['元の位置より右舷側', '元の位置より左舷側', '距離だけ長くなった'],
    1,
    '赤い長方形は、次のマークが左舷側へ移ったことを示します。',
    ['C旗で次のマーク位置の変更', '赤四角＝左舷側'],
    '規則33／レース信号「Changing the Next Leg」',
    2,
  ),
  signalQuestion(
    'q-c-shorter',
    'c-shorter',
    'C旗とマイナス記号が表示されています。何が変わる？',
    ['次のレグが短くなる', 'コース全体を短縮して直ちにフィニッシュ', '次のレグが長くなる'],
    0,
    'マイナス記号は、次のレグの長さが短くなったことを示します。',
    ['C＋マイナスは次のレグの距離変更', 'S旗のコース短縮と区別する'],
    '規則33／レース信号「Changing the Next Leg」',
    2,
  ),
  signalQuestion(
    'q-c-longer',
    'c-longer',
    'C旗とプラス記号が表示されています。何が変わる？',
    ['次のレグが短くなる', '次のレグが長くなる', '今日はレース終了'],
    1,
    'プラス記号は、次のレグの長さが長くなったことを示します。',
    ['C＋プラスは次のレグの距離変更', '方向変更の緑三角・赤四角と区別する'],
    '規則33／レース信号「Changing the Next Leg」',
    2,
  ),
  signalQuestion(
    'q-o-rule42',
    'o-rule42',
    '付則Pが適用されるレースでO旗。O旗だけでは自動的に許されない動作は？',
    ['クラス規則で指定されたパンピング', 'クラス規則で指定されたロッキング', 'スカリング'],
    2,
    'O旗で許されるのは、クラス規則に書かれたパンピング、ロッキング、ウーチングです。スカリングまで自動的に許されるわけではありません。',
    ['O旗だけで判断せずクラス規則を見る', 'スタート後はO旗を表示したマークの通過後から適用'],
    '付則P5 FLAGS O AND R',
    2,
  ),
  signalQuestion(
    'q-r-rule42',
    'r-rule42',
    'O旗が適用中です。マークでR旗と反復音響信号。通過後は？',
    ['O旗による緩和を終える', 'さらにすべての推進動作が自由になる', 'レースが中止になる'],
    0,
    'R旗を表示したマークの通過後は、O旗による緩和を終え、クラス規則で変更された規則42へ戻ります。',
    ['OとRを対で覚える', '切り替わるのは旗を見た瞬間ではなくマーク通過後'],
    '付則P5.3(b)',
    2,
  ),
  signalQuestion(
    'q-yellow-appendix-p',
    'yellow-penalty',
    '付則Pのジャッジが音を鳴らし、黄旗を自艇へ向け、艇を声で特定しました。イベントで1回目の判定です。基本の行動は？',
    ['2回転ペナルティーを行う', '黄旗が下がるまで停止する', 'そのまま走ってフィニッシュ後に確認する'],
    0,
    '付則Pで1回目の規則42ペナルティーを受けた艇は、2回転ペナルティーを行います。',
    ['艇が自ら掲げる得点ペナルティーの黄旗と区別', '2回目以降は処置が変わる'],
    '付則P1.2、P2.1',
    2,
  ),
  signalQuestion(
    'q-red-protest-six-metres',
    'red-protest',
    '艇体長がちょうど6mの艇が、水上で見た接触について抗議します。通常、赤旗の掲揚は？',
    ['必要', '不要。ただし声で抗議を伝える', 'フィニッシュ後だけ掲げる'],
    1,
    '赤旗が必要なのは艇体長が6mを超える艇です。ちょうど6mなら不要ですが、通常は最初の合理的な機会に「プロテスト」と伝えます。',
    ['「6m以上」ではなく「6mを超える」', '危険・負傷・重大損傷などには通知要件の例外がある'],
    '規則60.2 抗議の意思',
    2,
  ),
  signalQuestion(
    'q-d-check-si',
    'd-ashore',
    '陸上でD旗が掲揚されました。最初に確認するものは？',
    ['帆走指示書に書かれた出艇条件と予告信号までの時間', '規則10のタック関係', '黒旗違反艇の掲示番号'],
    0,
    'D旗は出艇開始に使われることが多い一方、具体的な意味と時間は大会の帆走指示書で決まります。',
    ['RRS巻頭の共通信号ではない', '大会ごとの帆走指示書を優先する'],
    '大会の帆走指示書（SI）',
    1,
  ),
  {
    id: 'q-r10-port-starboard',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 1,
    prompt: 'A艇はポートタック、B艇はスターボードタック。衝突コースです。避けるのは？',
    choices: ['A艇', 'B艇', '両艇が同じだけ避ける'],
    correctIndex: 0,
    conclusion: 'ポートタックのA艇が、スターボードタックのB艇を避けます。',
    points: ['まずタックを判定する', '右・左から来る見た目では決めない'],
    formal: '規則10 反対タックの場合',
    observation: {
      prompt: '規則を選ぶ前に、2艇の関係をどう分類する？',
      choices: ['反対タック', '同一タックでオーバーラップ', '同一タックで前後'],
      correctIndex: 0,
      feedback: [
        'A艇とB艇は異なるタックです。まず規則10から考えます。',
        '横に見えても、先にタックが同じか違うかを確認します。',
        '前後関係より先に、2艇のタックが異なることを押さえます。',
      ],
    },
    diagram: {
      windDirection: 'north',
      boats: [
        { id: 'A', label: 'ポート', x: 30, y: 62, heading: 42, tack: 'port' },
        { id: 'B', label: 'スターボード', x: 70, y: 62, heading: -42, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r11-windward',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 1,
    prompt: '同じタックで横に重なっています。A艇は風上、B艇は風下。避けるのは？',
    choices: ['A艇', 'B艇', '後から重なった艇'],
    correctIndex: 0,
    conclusion: '風上側のA艇が、風下側のB艇を避けます。',
    points: ['同一タックか確認', 'オーバーラップと風上・風下を確認'],
    formal: '規則11 同一タックでオーバーラップしている場合',
    observation: {
      prompt: 'この場面で、規則を分ける2つの材料は？',
      choices: ['同一タック＋オーバーラップ', '反対タック＋衝突コース', '同一タック＋前後に完全に分離'],
      correctIndex: 0,
      feedback: [
        '同じタックで横に重なっています。次に風上・風下を見ます。',
        '両艇は同じタックです。反対タックの規則10ではありません。',
        '横方向に重なっているため、規則12の前後関係ではありません。',
      ],
    },
    diagram: {
      windDirection: 'north',
      overlap: true,
      boats: [
        { id: 'A', label: '風上', x: 44, y: 36, heading: 0, tack: 'starboard' },
        { id: 'B', label: '風下', x: 60, y: 56, heading: 0, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r12-astern',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 1,
    prompt: '同じタックで、A艇はB艇の完全に後ろです。避けるのは？',
    choices: ['前のB艇', '後ろのA艇', '風上側に近い艇'],
    correctIndex: 1,
    conclusion: 'クリア・アスターンのA艇が、前のB艇を避けます。',
    points: ['艇と通常位置にある装備の後端を見る', '重なった時点で規則11などに切り替わる'],
    formal: '規則12 同一タックでオーバーラップしていない場合',
    observation: {
      prompt: 'A艇とB艇の位置関係をどう読む？',
      choices: ['同一タックで前後', '同一タックでオーバーラップ', 'A艇がタッキング中'],
      correctIndex: 0,
      feedback: [
        'A艇はB艇の装備を含む後端より完全に後ろです。規則12を考えます。',
        '2艇は横に重ならず、完全な前後関係です。',
        'A艇は直進中です。タッキング中を示す動きはありません。',
      ],
    },
    diagram: {
      windDirection: 'north',
      boats: [
        { id: 'A', label: '後ろ', x: 48, y: 70, heading: 0, tack: 'starboard' },
        { id: 'B', label: '前', x: 48, y: 30, heading: 0, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r13-tacking',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 2,
    prompt: 'A艇は風位を越えた直後で、まだクローズホールドではありません。この間、避けるのは？',
    choices: ['タッキング中のA艇', 'まっすぐ走るB艇', 'スターボード側の艇'],
    correctIndex: 0,
    conclusion: 'タッキング中のA艇が他艇を避けます。',
    points: ['風位を越えた瞬間から規則13', '新しいタックのクローズホールドまで続く'],
    formal: '規則13 タッキング中',
    observation: {
      prompt: 'A艇の動作は、いまどの段階？',
      choices: ['風位を越え、まだタック完了前', '新しいタックで直進済み', 'まだ風位を越える前'],
      correctIndex: 0,
      feedback: [
        '風位を越えてからクローズホールドになるまで、A艇はタッキング中です。',
        'まだ新しいタックのクローズホールドにはなっていません。',
        'すでに風位を越えています。ここから規則13が適用されます。',
      ],
    },
    diagram: {
      windDirection: 'north',
      boats: [
        { id: 'A', label: 'タック中', x: 42, y: 50, heading: 12, tack: 'port' },
        { id: 'B', label: '直進', x: 68, y: 50, heading: -35, tack: 'starboard' },
      ],
      path: { boat: 'A', d: 'M 26 70 Q 42 54 42 31' },
    },
  },
  {
    id: 'q-r14-contact',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 1,
    prompt: 'B艇が避けていないことが明らかです。A艇には航路権がありますが、今なら接触を避けられます。A艇は？',
    choices: ['接触を避ける動作をする', '航路を保ち必ず接触する', '抗議するまで進路を変えない'],
    correctIndex: 0,
    conclusion: '航路権艇でも、合理的に可能なら接触を避けます。',
    points: ['航路権は接触してよい権利ではない', '相手が避けていないと明らかになった時点を見る'],
    formal: '規則14 接触の回避',
    observation: {
      prompt: '航路権以外に、いま確認すべき事実は？',
      choices: ['A艇はまだ接触を避けられる', 'A艇は航路権を失った', 'B艇はすでに十分避けている'],
      correctIndex: 0,
      feedback: [
        '合理的に接触を避けられる段階なので、規則14も見ます。',
        'A艇の航路権は消えていません。ただし接触回避義務があります。',
        'B艇が避けていないことが明らかな場面です。',
      ],
    },
    diagram: {
      windDirection: 'north',
      boats: [
        { id: 'A', label: '航路権', x: 44, y: 56, heading: 28, tack: 'starboard' },
        { id: 'B', label: '避けていない', x: 63, y: 45, heading: -48, tack: 'port' },
      ],
    },
  },
  {
    id: 'q-r15-room',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 2,
    prompt: 'A艇が動作して新たに航路権を得ました。B艇にはすぐ避ける空間がありません。A艇は？',
    choices: ['最初にB艇へ避ける余地を与える', '航路権を得たのでそのまま押し出す', 'B艇が必ず失格になる'],
    correctIndex: 0,
    conclusion: '新たに航路権を得たA艇は、最初にB艇へ避ける余地を与えます。',
    points: ['航路権が切り替わった瞬間を見る', '相手が対応できる時間と空間を考える'],
    formal: '規則15 航路権を得る場合',
    observation: {
      prompt: '航路権が変わったきっかけは？',
      choices: ['A艇自身の動作', 'B艇自身の動作', '航路権は変わっていない'],
      correctIndex: 0,
      feedback: [
        'A艇の動作で新しく航路権を得たため、最初の余地を考えます。',
        'この場面では、B艇ではなくA艇の動作がきっかけです。',
        'A艇が新しく航路権を得た瞬間が示されています。',
      ],
    },
    diagram: {
      windDirection: 'north',
      overlap: true,
      boats: [
        { id: 'A', label: '航路権を得た', x: 48, y: 56, heading: -6, tack: 'starboard' },
        { id: 'B', label: '避ける艇', x: 63, y: 46, heading: 0, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r16-course-change',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 2,
    prompt: '航路権のあるA艇が進路を変えます。最も大切な条件は？',
    choices: ['B艇に避ける余地を与える', 'A艇が先に声を出す', '風上へだけ進路変更する'],
    correctIndex: 0,
    conclusion: '進路変更しても、相手艇に避ける余地を与えます。',
    points: ['航路権艇の進路変化を見る', '避ける艇の逃げ道が残っているか'],
    formal: '規則16 航路変更',
    observation: {
      prompt: '図で変化しているのは何？',
      choices: ['航路権艇Aの進路', '避ける艇Bのタック', '両艇のタック'],
      correctIndex: 0,
      feedback: [
        '曲線は航路権艇Aの進路変更です。B艇の逃げ道を確認します。',
        'B艇はタックしていません。変化しているのはA艇の進路です。',
        '両艇のタックではなく、A艇の進路が変化しています。',
      ],
    },
    diagram: {
      windDirection: 'north',
      boats: [
        { id: 'A', label: '進路変更', x: 40, y: 55, heading: -8, tack: 'starboard' },
        { id: 'B', label: '避ける艇', x: 64, y: 50, heading: 0, tack: 'starboard' },
      ],
      path: { boat: 'A', d: 'M 39 75 Q 40 54 58 36' },
    },
  },
  {
    id: 'q-r17-proper-course',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 3,
    prompt: 'B艇がクリア・アスターンから2艇身以内でA艇の風下に重なりました。重なりが続く間、B艇への主な制限は？',
    choices: ['プロパー・コースより風上を帆走しない', '必ずA艇の後ろへ戻る', 'タックしてはいけない'],
    correctIndex: 0,
    conclusion: '条件が続く間、風下のB艇はプロパー・コースより風上を帆走しません。',
    points: ['後ろから重なったか', '2艇身以内か', '同じタックで重なりが続くか'],
    formal: '規則17 同一タックでのプロパー・コース',
    observation: {
      prompt: '規則17につながる成立条件はどれ？',
      choices: ['B艇が後ろから2艇身以内で風下に重なった', 'A艇が後ろから追いついた', '2艇は反対タックで接近した'],
      correctIndex: 0,
      feedback: [
        '後ろから、2艇身以内で、風下に重なったという3点を押さえます。',
        '後ろから重なったのはB艇です。艇を取り違えないようにします。',
        '2艇は同一タックです。反対タックの場面ではありません。',
      ],
    },
    diagram: {
      windDirection: 'north',
      overlap: true,
      boats: [
        { id: 'A', label: '風上', x: 44, y: 38, heading: 0, tack: 'starboard' },
        { id: 'B', label: '風下・後方から', x: 61, y: 56, heading: 0, tack: 'starboard' },
      ],
    },
  },
  // Source: World Sailing, RRS 2025–2028, rule 18 and definition Mark-Room.
  // https://media.sailing.org/sailing/wp-content/uploads/2025/07/29083752/2025-2028-RRS-with-Changes-and-Corrections.pdf
  {
    id: 'q-r18-first-zone-clear',
    category: 'rule',
    skill: 'mark-room',
    difficulty: 1,
    prompt: 'A艇がB艇より先にゾーンへ入りました。2艇は重なっていません。マークルームを与えるのは？',
    choices: ['後からゾーンへ入るB艇', '先にゾーンへ入ったA艇', 'マークに近い運営艇'],
    correctIndex: 0,
    conclusion: '重なりがないときは、まだゾーンへ入っていないB艇が、先に入ったA艇へマークルームを与えます。',
    points: ['どちらかがゾーンへ入った瞬間を止めて見る', 'その瞬間に2艇が重なっていないことを確認する'],
    formal: '規則18.2(a) マークルームを与えること',
    observation: {
      prompt: 'A艇がゾーンへ入った瞬間、2艇の関係は？',
      choices: ['A艇が先・重なりなし', '横に重なり、A艇が外側', '反対タックで向かい合う'],
      correctIndex: 0,
      feedback: [
        '先に入った艇と、その瞬間の重なりを正しく見抜けました。',
        '2艇は横に重なっていません。まず前後関係を見ます。',
        '2艇は同じタックです。反対タックの例外ではありません。',
      ],
    },
    diagram: {
      windDirection: 'north',
      mark: { x: 50, y: 34, zone: true },
      boats: [
        { id: 'A', label: '先にゾーンへ', x: 50, y: 60, heading: 0, tack: 'starboard' },
        { id: 'B', label: '後ろ', x: 50, y: 83, heading: 0, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r18-inside-overlap',
    category: 'rule',
    skill: 'mark-room',
    difficulty: 1,
    prompt: '重なった2艇がゾーンへ入りました。A艇が内側、B艇が外側です。マークルームを与えるのは？',
    choices: ['外側のB艇', '内側のA艇', '先に声を出した艇'],
    correctIndex: 0,
    conclusion: 'ゾーンへ入る瞬間に重なっていれば、外側のB艇が内側のA艇へマークルームを与えます。',
    points: ['ゾーンへ入る瞬間の重なりを見る', 'マークに近い内側艇と、外側艇を見分ける'],
    formal: '規則18.2(a) マークルームを与えること',
    observation: {
      prompt: 'ゾーンへ入る瞬間の位置関係は？',
      choices: ['重なりあり・A艇が内側', '重なりなし・B艇が前', 'A艇がゾーンを出た後'],
      correctIndex: 0,
      feedback: [
        '重なりと内外の2点を正しく分類できました。',
        '横に並んでいるため、重なりがあります。',
        'いま見ているのはゾーンへ入る瞬間です。',
      ],
    },
    diagram: {
      windDirection: 'north',
      overlap: true,
      mark: { x: 66, y: 34, zone: true },
      boats: [
        { id: 'A', label: '内側', x: 60, y: 59, heading: 0, tack: 'starboard' },
        { id: 'B', label: '外側', x: 38, y: 63, heading: 0, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r18-overlap-changes',
    category: 'rule',
    skill: 'mark-room',
    difficulty: 2,
    prompt: 'ゾーンへ入った瞬間はA艇が内側で重なっていました。その後、重なりがなくなりました。B艇の義務は？',
    choices: ['A艇へマークルームを与え続ける', '重なりが消えた瞬間に終わる', 'A艇をマークの外へ押し出す'],
    correctIndex: 0,
    conclusion: 'ゾーンへ入った瞬間に決まったマークルームの義務は、後で重なりが変わっても続きます。',
    points: ['判定する瞬間は最初の艇がゾーンへ入ったとき', 'その後の重なりだけで権利関係をリセットしない'],
    formal: '規則18.2(a) マークルームを与えること',
    observation: {
      prompt: 'この問題で固定して覚える「判定の瞬間」は？',
      choices: ['最初の艇がゾーンへ入った瞬間', '重なりが消えた瞬間', '先頭艇がフィニッシュした瞬間'],
      correctIndex: 0,
      feedback: [
        '最初にゾーンへ入った瞬間の関係を基準にします。',
        '後の変化ではなく、ゾーンへ入った瞬間へ戻って判断します。',
        'フィニッシュは、この場面のマークルーム判定と関係しません。',
      ],
    },
    diagram: {
      windDirection: 'north',
      mark: { x: 66, y: 34, zone: true },
      path: { boat: 'B', d: 'M 37 82 Q 41 61 49 45' },
      boats: [
        { id: 'A', label: '内側・権利あり', x: 59, y: 59, heading: 0, tack: 'starboard' },
        { id: 'B', label: '外側', x: 37, y: 77, heading: 0, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r18-opposite-tacks-beat',
    category: 'rule',
    skill: 'mark-room',
    difficulty: 2,
    prompt: '風上マークへ向かうビートで、A艇はポート、B艇はスターボードです。規則18より先に使うのは？',
    choices: ['規則10。ポート艇Aが避ける', '規則18。内側艇が必ず優先', 'どちらも同じ権利'],
    correctIndex: 0,
    conclusion: 'ビートで反対タックの2艇には規則18を適用せず、規則10でポート艇が避けます。',
    points: ['反対タックかを最初に見る', '風上へ向かうビートでは規則18の適用外になる'],
    formal: '規則18.1(a) 規則18を適用する場合／規則10',
    observation: {
      prompt: 'マークの内外より先に、何を確認する？',
      choices: ['ビートで2艇が反対タック', 'A艇がマークに少し近い', 'どちらが先に声を出したか'],
      correctIndex: 0,
      feedback: [
        '反対タックかつビートという、規則18の例外を見抜けました。',
        'マークへの近さだけでは決めません。先にタックと帆走状態を見ます。',
        '声の順番では権利は決まりません。',
      ],
    },
    diagram: {
      windDirection: 'north',
      mark: { x: 50, y: 34, zone: true },
      boats: [
        { id: 'A', label: 'ポート', x: 28, y: 67, heading: 38, tack: 'port' },
        { id: 'B', label: 'スターボード', x: 72, y: 67, heading: -38, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r18-tack-in-zone',
    category: 'rule',
    skill: 'mark-room',
    difficulty: 3,
    prompt: 'ポート回りの風上マーク。A艇がゾーン内でポートからスターボードへタックし、スターボードで入ったB艇の前へ出ました。A艇は？',
    choices: ['B艇をクローズホールドより上へ押し上げず、必要ならマークルームを与える', 'タック完了と同時に自由にラフできる', '内側なら必ずB艇を押し出せる'],
    correctIndex: 0,
    conclusion: 'ゾーン内でタックしたA艇には、B艇を押し上げないことと、条件がそろえばマークルームを与える制限があります。',
    points: ['A艇がどこでポートからスターボードへタックしたか', 'B艇がスターボードでゾーンへ入ったか'],
    formal: '規則18.3 ゾーン内で風位を越える場合',
    observation: {
      prompt: '通常の内側・外側だけで決められない理由は？',
      choices: ['A艇がゾーン内でポートからスターボードへタックした', 'B艇の方が艇速が高い', '2艇ともゾーンの外にいる'],
      correctIndex: 0,
      feedback: [
        'ゾーン内のタックを見抜けました。規則18.3の追加制限を確認します。',
        '艇速ではなく、ゾーン内でのタックが分岐です。',
        '2艇はゾーン内にいます。位置をもう一度確認します。',
      ],
    },
    diagram: {
      windDirection: 'north',
      mark: { x: 50, y: 34, zone: true },
      path: { boat: 'A', d: 'M 20 83 Q 34 65 49 59' },
      boats: [
        { id: 'A', label: 'ゾーン内でタック', x: 46, y: 59, heading: -18, tack: 'starboard' },
        { id: 'B', label: 'スターボードで進入', x: 72, y: 69, heading: -34, tack: 'starboard' },
      ],
    },
  },
  {
    id: 'q-r18-room-given',
    category: 'rule',
    skill: 'mark-room',
    difficulty: 2,
    prompt: 'A艇へ必要なマークルームが与えられ、A艇はマークを回り終えました。2艇間の規則18は？',
    choices: ['適用が終わり、次の位置関係を判断する', 'フィニッシュまで続く', '次のマークまでA艇が必ず優先'],
    correctIndex: 0,
    conclusion: '必要なマークルームが与えられたら規則18は終わり、現在のタック・重なり・動きから判断し直します。',
    points: ['マークルームを与え終えたかを見る', '古い権利関係を次のレグまで引きずらない'],
    formal: '規則18.1 規則18を適用する場合',
    observation: {
      prompt: '規則18が終わる材料はどれ？',
      choices: ['必要なマークルームをすでに与えた', 'まだ最初の艇がゾーンへ入っていない', 'スタート信号が鳴った'],
      correctIndex: 0,
      feedback: [
        'マークルームを与え終えた時点を正しく捉えました。',
        'すでに回航まで終えています。時間の順序を確認します。',
        'スタート信号ではなく、マークルームを与えたかが分岐です。',
      ],
    },
    diagram: {
      windDirection: 'north',
      mark: { x: 50, y: 45, zone: true },
      path: { boat: 'A', d: 'M 25 68 Q 38 36 70 39' },
      boats: [
        { id: 'A', label: '回航済み', x: 72, y: 37, heading: 78, tack: 'starboard' },
        { id: 'B', label: '外側艇', x: 68, y: 68, heading: 45, tack: 'starboard' },
      ],
    },
  },
  signalQuestion(
    'q-p-preparatory',
    'p',
    'P旗が掲揚されました。スタート手順では何の信号？',
    ['予告信号', '準備信号', 'スタート信号'],
    1,
    'P旗は通常の準備信号です。スタート4分前が基準です。',
    ['クラス旗の予告信号と分ける', 'P旗は特別なスタート・ペナルティを追加しない'],
    '規則26／レース信号「準備信号」',
  ),
  signalQuestion(
    'q-i-return-route',
    'i',
    'I旗の残り1分でラインを越えました。正しい戻り方は？',
    ['その場でラインを横切って戻る', 'どちらかの端の外側を回って戻る', '第1マークを回ってから戻る'],
    1,
    'スタート・ラインの延長線の外側へ出て、端を回って戻ります。',
    ['I旗はラウンド・アン・エンド', '他艇を避けながら戻る'],
    '規則30.1 I旗規則',
    2,
  ),
  signalQuestion(
    'q-black-after-recall',
    'black',
    '黒旗の残り1分で三角形に入り、艇番号を識別されました。一般リコール後は？',
    ['次のスタートへ通常どおり参加する', '厳しい制限が続くので掲示と規則を確認する', 'X旗が出るまで待つ'],
    1,
    '黒旗違反は一般リコール後も重大です。艇番号の掲示を確認します。',
    ['U旗との違いを確認する', '「やり直しだからリセット」と考えない'],
    '規則30.4 黒旗規則',
    3,
  ),
  signalQuestion(
    'q-n-abandoned',
    'n',
    'レース中にN旗と3声。最初の行動は？',
    ['そのままフィニッシュする', 'スタート・エリアへ戻る', '最寄りのマークで待つ'],
    1,
    '進行中のレースは中止です。スタート・エリアへ戻ります。',
    ['N旗は中止信号', '追加旗があれば、その日の予定も合わせて読む'],
    'レース信号「中止信号」',
  ),
  signalQuestion(
    'q-m-replacement',
    'm',
    'M旗を掲げ、反復音響信号を出す艇がいます。この艇は？',
    ['なくなったマークの代わり', 'フィニッシュ・ラインの一端', '救助艇だけを示す'],
    0,
    'その艇または物体が、なくなったマークの代わりです。',
    ['青地に白いXがM旗', '指定された側で正しく回る'],
    '規則34 マークの消失',
    2,
  ),
  signalQuestion(
    'q-l-location',
    'l',
    'L旗は、どこに掲揚されたかで行動が変わります。正しい組み合わせは？',
    ['陸上＝通知を確認／海上＝近づく・ついて行く', '陸上＝帰港／海上＝PFD着用', '陸上＝延期／海上＝中止'],
    0,
    '陸上なら通知を確認し、海上なら近づくか、その艇について行きます。',
    ['旗だけでなく掲揚場所を見る', '同じL旗でも行動が二つある'],
    'レース信号「その他の信号」',
    2,
  ),
  signalQuestion(
    'q-orange-start-end',
    'orange',
    'レース委員会艇のオレンジ旗は、何の一端を示す？',
    ['スタート・ライン', 'フィニッシュ・ライン', 'ゾーンの境界'],
    0,
    'オレンジ旗はスタート・ラインの一端を示します。',
    ['反対側のスタート・マークと結ぶ', '青旗のフィニッシュ位置と対で覚える'],
    'レース信号「その他の信号」',
  ),
  signalQuestion(
    'q-blue-finish-end',
    'blue',
    'レース委員会艇の青旗が示すものは？',
    ['準備信号', 'フィニッシュ位置', 'コース変更'],
    1,
    '青旗はレース委員会艇がフィニッシュ位置にいることを示します。',
    ['もう一方の端とフィニッシュ・ラインを結ぶ', 'スタートのオレンジ旗と区別する'],
    'レース信号「その他の信号」',
  ),
  {
    id: 'q-r10-identify-tack',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 1,
    prompt: '艇のブームが左舷側に出ています。この艇のタックは？',
    choices: ['ポートタック', 'スターボードタック', 'ブームだけでは必ず不明'],
    correctIndex: 1,
    conclusion: '風を右舷側から受けているため、スターボードタックです。',
    points: ['ブームの反対側から風を受けている', '進行方向の左右だけで決めない'],
    formal: '定義「タック、スターボードまたはポート」',
    choiceFeedback: [
      'ブーム側とタックを同じだと考えています。風を受ける側を見ます。',
      '風を受ける側から正しく判断できています。',
      '通常の帆走状態なら、ブーム位置は有力な手がかりです。',
    ],
  },
  {
    id: 'q-r11-order',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 2,
    prompt: '風上艇・風下艇を判断する前に、最初に確認することは？',
    choices: ['両艇が同じタックか', 'どちらの艇速が高いか', 'どちらが先に声を出したか'],
    correctIndex: 0,
    conclusion: 'まず同一タックか確認し、その後に重なりと風上・風下を見ます。',
    points: ['判断順序を固定する', '反対タックなら規則10から考える'],
    formal: '規則10・11',
    choiceFeedback: [
      '正しい順序です。タックが違えば別の規則から判断します。',
      '艇速は航路権を直接決めません。',
      '声を出した順では航路権は決まりません。',
    ],
  },
  {
    id: 'q-r12-overlap-switch',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 2,
    prompt: '後ろのA艇が追いつき、B艇の風下でオーバーラップしました。判断はどう変わる？',
    choices: ['規則12のまま', '風上・風下の関係を確認する', '両艇とも航路権を失う'],
    correctIndex: 1,
    conclusion: 'オーバーラップした瞬間から、風上・風下などの関係を確認します。',
    points: ['関係が変わる瞬間を見る', '風下艇には規則17が関係する場合もある'],
    formal: '規則11・12・17',
    choiceFeedback: [
      '規則12はオーバーラップしていない間の規則です。',
      '位置関係の変化に合わせて規則を切り替えられています。',
      '航路権は消えず、適用規則が変わります。',
    ],
  },
  {
    id: 'q-r13-end',
    category: 'rule',
    skill: 'right-of-way',
    difficulty: 2,
    prompt: 'タッキング中として避け続ける義務は、いつ終わる？',
    choices: ['バウが風位を越えた瞬間', '新しいタックのクローズホールドになったとき', 'セールが反対側へ動いたとき'],
    correctIndex: 1,
    conclusion: '新しいタックのクローズホールドになるまで規則13が続きます。',
    points: ['開始は風位を越えたとき', '終了はクローズホールドになったとき'],
    formal: '規則13 タッキング中',
    choiceFeedback: [
      '風位を越えた瞬間は、規則13が始まる側です。',
      '開始と終了の二つの境目を正しく区別できています。',
      'セールの移動だけでは終了を決めません。',
    ],
  },
  {
    id: 'q-r14-right-not-contact',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 1,
    prompt: '「自艇に航路権がある」の正しい意味は？',
    choices: ['接触してもよい', '相手が避けるが、自艇にも接触回避義務がある', '進路を自由に変えてよい'],
    correctIndex: 1,
    conclusion: '相手は避けますが、航路権艇も合理的に可能なら接触を避けます。',
    points: ['航路権と接触回避を分ける', '規則14は両艇に関係する'],
    formal: '規則14 接触の回避',
    choiceFeedback: [
      '航路権は接触の許可ではありません。',
      '航路権と安全上の義務を分けて考えられています。',
      '進路変更には規則16の制限があります。',
    ],
  },
  {
    id: 'q-r15-exception',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 3,
    prompt: 'A艇が航路権を得た原因が、B艇自身の動作でした。規則15の「最初に避ける余地」は？',
    choices: ['常にA艇が与える', 'この場合は例外になり得る', 'スタート前だけ不要'],
    correctIndex: 1,
    conclusion: '相手艇の動作によって航路権を得た場合は、規則15の例外になり得ます。',
    points: ['誰の動作で航路権が変わったかを見る', '一つの回答だけで事実認定を決めない'],
    formal: '規則15 航路権を得る場合',
    choiceFeedback: [
      '規則15には、相手艇の動作で航路権を得た場合の例外があります。',
      '航路権が変わった原因まで見られています。',
      'スタート前後ではなく、航路権を得た原因が焦点です。',
    ],
  },
  {
    id: 'q-r16-escape',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 2,
    prompt: '航路権艇がラフするとき、「避ける余地」があるかは何で判断する？',
    choices: ['相手艇に対応する時間と空間が残るか', '航路権艇が声を出したか', '風が強いか'],
    correctIndex: 0,
    conclusion: '避ける艇がすぐ対応できる時間と空間が残るかを見ます。',
    points: ['進路変更の速さと距離を見る', 'コールだけでは余地を作れない'],
    formal: '規則16.1 航路変更',
    choiceFeedback: [
      '相手が実際に避けられるかを見られています。',
      'コールは注意喚起でも、余地そのものではありません。',
      '風は状況に影響しますが、中心は対応可能な時間と空間です。',
    ],
  },
  {
    id: 'q-r17-trigger',
    category: 'rule',
    skill: 'rule-limitations',
    difficulty: 3,
    prompt: '規則17の制限を考える重要な成立条件は？',
    choices: ['風下艇が後ろから2艇身以内で重なった', '風上艇が先にコールした', '両艇の艇種が違う'],
    correctIndex: 0,
    conclusion: '同一タックで、後ろから2艇身以内に風下オーバーラップを作ったかが重要です。',
    points: ['後ろから重なったか', '2艇身以内か', '重なりが続くか'],
    formal: '規則17 同一タックでのプロパー・コース',
    choiceFeedback: [
      '成立条件をまとめて確認できています。',
      'コールの順序は規則17の成立条件ではありません。',
      '艇種の違いは規則17の成立条件ではありません。',
    ],
  },
]

export const getSignal = (id: string) => allSignals.find((signal) => signal.id === id)
