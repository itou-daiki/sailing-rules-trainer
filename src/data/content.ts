export type FlagArtworkKind =
  | 'ap'
  | 'p'
  | 'i'
  | 'u'
  | 'black'
  | 'x'
  | 'first-sub'
  | 's'
  | 'c'
  | 'y'
  | 'v'
  | 'n'
  | 'l'
  | 'm'
  | 'orange'
  | 'blue'

export type SignalStage = 'スタート前' | 'スタート' | 'レース中' | 'コース' | '安全'

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
}

export interface CoreRule {
  id: string
  number: string
  title: string
  takeaway: string
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
  mark?: { x: number; y: number }
  path?: { boat: 'A' | 'B'; d: string }
}

export type QuestionCategory = 'signal' | 'rule'

export interface QuizQuestion {
  id: string
  category: QuestionCategory
  prompt: string
  choices: string[]
  correctIndex: number
  conclusion: string
  points: string[]
  formal: string
  flagId?: string
  diagram?: ScenarioDiagram
}

export const RULESET = {
  edition: 'RRS 2025–2028',
  currentThrough: '2026年4月20日版',
  checkedAt: '2026年8月22日',
  officialUrl: 'https://www.sailing.org/racingrules/',
  jsafUrl: 'https://www.jsaf.or.jp/hp/about/committee/rule/rule-reg',
} as const

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

export const coreRules: CoreRule[] = [
  {
    id: 'r10',
    number: '10',
    title: '反対タック',
    takeaway: 'ポート艇が、スターボード艇を避ける。',
    lookFor: ['両艇のブームがどちら側か', '風を受けている側が同じか違うか'],
    caution: '「右から来た艇」ではなく、タックで判断する。',
  },
  {
    id: 'r11',
    number: '11',
    title: '同一タックでオーバーラップ',
    takeaway: '風上艇が、風下艇を避ける。',
    lookFor: ['両艇が同じタックか', '横に重なる位置関係か', 'どちらが風上側か'],
    caution: '風下艇が進路を変えるときは、規則16も関係する。',
  },
  {
    id: 'r12',
    number: '12',
    title: '同一タックでオーバーラップなし',
    takeaway: 'クリア・アスターン艇が、前の艇を避ける。',
    lookFor: ['同じタックか', '艇や装備の後端より完全に後ろか'],
    caution: 'オーバーラップが生じた瞬間から、規則11などへ判断が切り替わる。',
  },
  {
    id: 'r13',
    number: '13',
    title: 'タッキング中',
    takeaway: '風位を越えてクローズホールドになるまで、他艇を避ける。',
    lookFor: ['バウが風位を越えたか', '新しいタックのクローズホールドになったか'],
    caution: 'タック前に優先でも、タッキング中は避ける側になる。',
  },
  {
    id: 'r14',
    number: '14',
    title: '接触の回避',
    takeaway: '優先艇でも、合理的に可能なら接触を避ける。',
    lookFor: ['相手が避けていないことが明らかになった時点', '避ける動作が可能だったか'],
    caution: '優先権は「ぶつかってよい権利」ではない。',
  },
  {
    id: 'r15',
    number: '15',
    title: '航路権を得るとき',
    takeaway: '航路権を得た艇は、最初に相手へ避ける余地を与える。',
    lookFor: ['いつ航路権が入れ替わったか', '相手に対応時間と空間があったか'],
    caution: '相手の動作によって航路権を得た場合など、例外がある。',
  },
  {
    id: 'r16',
    number: '16',
    title: '航路変更',
    takeaway: '航路権艇が進路を変えるときも、相手に避ける余地を与える。',
    lookFor: ['航路権艇の進路が変わったか', '避ける艇の逃げ道が残っていたか'],
    caution: '航路権があることと、自由に進路変更できることは同じではない。',
  },
  {
    id: 'r17',
    number: '17',
    title: '同一タックでのプロパー・コース',
    takeaway: '後ろから近くで風下に重なった艇には、風上へ上り過ぎない制限がかかる。',
    lookFor: ['後ろからオーバーラップしたか', '2艇身以内だったか', 'オーバーラップが続いているか'],
    caution: '成立条件が多い。単に「風下艇はラフできない」と覚えない。',
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
): QuizQuestion => ({
  id,
  category: 'signal',
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
  {
    id: 'q-r10-port-starboard',
    category: 'rule',
    prompt: 'A艇はポートタック、B艇はスターボードタック。衝突コースです。避けるのは？',
    choices: ['A艇', 'B艇', '両艇が同じだけ避ける'],
    correctIndex: 0,
    conclusion: 'ポートタックのA艇が、スターボードタックのB艇を避けます。',
    points: ['まずタックを判定する', '右・左から来る見た目では決めない'],
    formal: '規則10 反対タックの場合',
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
    prompt: '同じタックで横に重なっています。A艇は風上、B艇は風下。避けるのは？',
    choices: ['A艇', 'B艇', '後から重なった艇'],
    correctIndex: 0,
    conclusion: '風上側のA艇が、風下側のB艇を避けます。',
    points: ['同一タックか確認', 'オーバーラップと風上・風下を確認'],
    formal: '規則11 同一タックでオーバーラップしている場合',
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
    prompt: '同じタックで、A艇はB艇の完全に後ろです。避けるのは？',
    choices: ['前のB艇', '後ろのA艇', '風上側に近い艇'],
    correctIndex: 1,
    conclusion: 'クリア・アスターンのA艇が、前のB艇を避けます。',
    points: ['艇と通常位置にある装備の後端を見る', '重なった時点で規則11などに切り替わる'],
    formal: '規則12 同一タックでオーバーラップしていない場合',
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
    prompt: 'A艇は風位を越えた直後で、まだクローズホールドではありません。この間、避けるのは？',
    choices: ['タッキング中のA艇', 'まっすぐ走るB艇', 'スターボード側の艇'],
    correctIndex: 0,
    conclusion: 'タッキング中のA艇が他艇を避けます。',
    points: ['風位を越えた瞬間から規則13', '新しいタックのクローズホールドまで続く'],
    formal: '規則13 タッキング中',
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
    prompt: 'B艇が避けていないことが明らかです。A艇には航路権がありますが、今なら接触を避けられます。A艇は？',
    choices: ['接触を避ける動作をする', '航路を保ち必ず接触する', '抗議するまで進路を変えない'],
    correctIndex: 0,
    conclusion: '航路権艇でも、合理的に可能なら接触を避けます。',
    points: ['航路権は接触してよい権利ではない', '相手が避けていないと明らかになった時点を見る'],
    formal: '規則14 接触の回避',
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
    prompt: 'A艇が動作して新たに航路権を得ました。B艇にはすぐ避ける空間がありません。A艇は？',
    choices: ['最初にB艇へ避ける余地を与える', '航路権を得たのでそのまま押し出す', 'B艇が必ず失格になる'],
    correctIndex: 0,
    conclusion: '新たに航路権を得たA艇は、最初にB艇へ避ける余地を与えます。',
    points: ['航路権が切り替わった瞬間を見る', '相手が対応できる時間と空間を考える'],
    formal: '規則15 航路権を得る場合',
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
    prompt: '航路権のあるA艇が進路を変えます。最も大切な条件は？',
    choices: ['B艇に避ける余地を与える', 'A艇が先に声を出す', '風上へだけ進路変更する'],
    correctIndex: 0,
    conclusion: '進路変更しても、相手艇に避ける余地を与えます。',
    points: ['航路権艇の進路変化を見る', '避ける艇の逃げ道が残っているか'],
    formal: '規則16 航路変更',
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
    prompt: 'B艇がクリア・アスターンから2艇身以内でA艇の風下に重なりました。重なりが続く間、B艇への主な制限は？',
    choices: ['プロパー・コースより風上を帆走しない', '必ずA艇の後ろへ戻る', 'タックしてはいけない'],
    correctIndex: 0,
    conclusion: '条件が続く間、風下のB艇はプロパー・コースより風上を帆走しません。',
    points: ['後ろから重なったか', '2艇身以内か', '同じタックで重なりが続くか'],
    formal: '規則17 同一タックでのプロパー・コース',
    diagram: {
      windDirection: 'north',
      overlap: true,
      boats: [
        { id: 'A', label: '風上', x: 44, y: 38, heading: 0, tack: 'starboard' },
        { id: 'B', label: '風下・後方から', x: 61, y: 56, heading: 0, tack: 'starboard' },
      ],
    },
  },
]

export const getSignal = (id: string) => raceSignals.find((signal) => signal.id === id)
