export interface RuleEra {
  id: string
  period: string
  title: string
  summary: string
}

export interface RuleChange {
  id: string
  reference: string
  title: string
  before: string
  now: string
  onWater: string
}

export interface RuleSource {
  id: string
  label: string
  description: string
  url: string
}

export const ruleEras: RuleEra[] = [
  {
    id: 'club-rules',
    period: '〜1860s',
    title: 'クラブごとの規則',
    summary:
      '遠征先が変わると、使う規則も変わる時代。艇どうしが出会ったときの共通判断が必要になった。',
  },
  {
    id: 'shared-rules',
    period: '1868–1881',
    title: '統一ルールへの試行',
    summary:
      '1868年の会議と翌年の案は定着しなかったが、1881年には英国のクラブが集まり、共有規則を整えた。',
  },
  {
    id: 'international-rules',
    period: '1907',
    title: '国際的な土台へ',
    summary:
      'パリで国際組織が設立され、国を越えて同じ基準で競うための仕組みが動き始めた。',
  },
  {
    id: 'four-year-cycle',
    period: 'NOW',
    title: '4年ごとに改訂',
    summary:
      'World Sailingが4年周期で発行。現在は2025–2028版で、期間中も必要な変更・修正が公表される。',
  },
]

export const ruleChanges: RuleChange[] = [
  {
    id: 'avoid-contact',
    reference: 'RULE 14',
    title: '「自艇が当たらない」だけではない',
    before: '自艇と他艇の接触を、合理的に可能なら避けることが中心だった。',
    now: '自艇の動作で、他の2艇を接触させたり、艇を避けるべき物体へ接触させたりしないことも明記された。',
    onWater: '航路権があっても、相手の逃げ場とその先まで見る。委員会艇などへ押し込むコースを取らない。',
  },
  {
    id: 'proper-course',
    reference: 'RULE 17',
    title: 'タッキング直後の重なりも確認する',
    before: '風上艇が規則13で避けている間に重なりが始まると、規則17を適用しない例外があった。',
    now: 'その例外が削除された。条件がそろえば、相手がタッキング中にできた重なりにも規則17が適用される。',
    onWater: '相手のタック完了だけで判断しない。重なりが始まった瞬間と距離を見て、プロパー・コースより上らない。',
  },
  {
    id: 'continuing-obstruction',
    reference: 'DEF. / 18.1 / 19',
    title: '「連続した障害物」に長さの目安',
    before: '用語は使われていたが、どの長さから該当するかの定義がなかった。',
    now: '関係する艇で最も短い艇が、3艇身以上にわたり横を通る障害物と定義された。航行中の船舶などは除かれる。',
    onWater: '長い防波堤や島なら、マークだからと即座に規則18を当てはめず、規則19の通過スペースを考える。',
  },
  {
    id: 'mark-room',
    reference: 'RULE 18.2 / 18.3',
    title: 'ゾーンへ入った順と、ゾーン内のタックが重要',
    before: '「重なりあり／クリア・アヘッド」の分岐が複数の条文に分かれ、タック後の関係も読み取りにくかった。',
    now: '重なりがなければ、先にゾーンへ達した艇がマークルームを得る形に整理。ポート回りの風上マークのゾーン内で、ポートからスターボードへタックした艇には新たな制限がかかる。',
    onWater: '3艇身の円へ入る瞬間を声に出して共有する。レイライン直前のポート・タック進入は、早めに安全な選択へ切り替える。',
  },
  {
    id: 'finish-course',
    reference: 'DEFINITIONS',
    title: '「スタート」と「フィニッシュ」の整理',
    before: 'フィニッシュの定義には「スタートした後」とあり、コースを帆走する条件の一部は規則28に置かれていた。',
    now: 'フィニッシュは「スタート信号の後」に変更。スタートとフィニッシュを含む糸のテストは「コースを帆走する」の定義へ集約された。',
    onWater: 'OCSでも、フィニッシュした記録自体が残る場合がある。ただし正しくスタートしたことにはならないので、信号と帆走指示書に従って戻る。',
  },
  {
    id: 'protest-intention',
    reference: 'RULE 60.2',
    title: '抗議の意思表示は、艇の長さも確認',
    before: '旧規則61.1では、6m未満の艇が赤旗掲揚の例外だったため、ちょうど6mの艇には赤旗が必要だった。',
    now: '手続は規則60へ再編。赤旗が必要なのは艇体長が6mを超える艇で、ちょうど6mなら不要になった。声が届かない距離なら通知方法にも例外がある。',
    onWater: '声が届くなら、最初の合理的な機会に「プロテスト」と声をかける。届かないときは、可能になった最初の機会に抗議の意思を知らせる。',
  },
]

export const ruleEvolutionSources: RuleSource[] = [
  {
    id: 'world-sailing-history',
    label: 'World Sailing / History',
    description: 'クラブ別規則から国際組織設立までの沿革',
    url: 'https://www.sailing.org/inside-world-sailing/organisation/world-sailing/history/',
  },
  {
    id: 'world-sailing-rrs',
    label: 'World Sailing / Racing Rules',
    description: '現行版、4年の改訂周期、期間中の変更・修正',
    url: 'https://www.sailing.org/inside-world-sailing/rules-regulations/racingrules/',
  },
  {
    id: 'world-sailing-study',
    label: 'World Sailing / 2025–2028 Study Version',
    description: '2021–2024版からの追加・削除を示す公式差分版',
    url: 'https://www.sailing.org/document/rrs-study-pack-2025-2028-study-version-of-the-racing-rules-of-sailing-for-2025-2028/',
  },
  {
    id: 'world-sailing-current',
    label: 'World Sailing / Current RRS',
    description: 'Changes and Correctionsを反映した2025–2028版',
    url: 'https://www.sailing.org/document/2025-2028-rrs-with-changes-and-corrections/',
  },
  {
    id: 'jsaf-rules',
    label: 'JSAF / 規則・規定',
    description: '日本語版、変更点・修正点、正誤表',
    url: 'https://www.jsaf.or.jp/hp/about/committee/rule/rule-reg',
  },
]
