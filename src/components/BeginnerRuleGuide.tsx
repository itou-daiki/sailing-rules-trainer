const TackBoat = ({ tack }: { tack: 'port' | 'starboard' }) => {
  const isPort = tack === 'port'
  const sailX = isPort ? 145 : 55
  const labelX = isPort ? 157 : 43
  const rotation = isPort ? 27 : -27
  const name = isPort ? 'ポートタック' : 'スターボードタック'
  const sideLabel = isPort ? '右舷側' : '左舷側'
  const windwardSide = isPort ? '左舷側' : '右舷側'

  return (
    <figure className="tack-boat">
      <svg
        role="img"
        aria-label={`風を${windwardSide}から受け、帆が${sideLabel}にある${name}艇`}
        viewBox="0 0 200 205"
      >
        <g transform={`rotate(${rotation} 100 108)`}>
          <path d="M100 190 V18" className="tack-boat__course-line" />
          <path d="m100 12-7 12h14Z" className="tack-boat__course-arrow" />
          <path
            d="M100 24 C122 42 124 142 100 174 C76 142 78 42 100 24Z"
            className="tack-boat__hull"
          />
          <path d="M100 31 V168" className="tack-boat__centerline" />
          <path d="M88 103 C88 89 112 89 112 103 V143 C112 156 88 156 88 143Z" className="tack-boat__cockpit" />
          <path d={`M100 48 L100 139 L${sailX} 116Z`} className={`tack-boat__sail is-${tack}`} />
          <path d={`M100 82 L${isPort ? 140 : 60} 116`} className="tack-boat__boom" />
          <circle cx="100" cy="82" r="4" className="tack-boat__mast" />
          <path d={`M${isPort ? 121 : 79} 111 H${isPort ? 151 : 49}`} className="tack-boat__sail-pointer" />
          <text x={labelX} y="108" textAnchor="middle" className="tack-boat__side-label">
            帆
          </text>
        </g>
      </svg>
      <figcaption>
        <span>帆は{sideLabel}</span>
        <strong>{name}</strong>
        <small>風を{windwardSide}から受ける</small>
      </figcaption>
    </figure>
  )
}

const TackWind = () => (
  <div className="tack-reader__wind">
    <span>WIND</span>
    <strong>風は上から</strong>
    <svg role="img" aria-label="上から下へ吹く風" viewBox="0 0 180 32">
      <path d="M24 2 V25 M18 18l6 7 6-7 M90 2 V25 M84 18l6 7 6-7 M156 2 V25 M150 18l6 7 6-7" />
    </svg>
  </div>
)

const beginnerTerms = [
  {
    term: '避ける（キープ・クリア）',
    meaning: '相手が進み続けても、衝突しない位置にいること。相手に急な回避をさせない。',
  },
  {
    term: '風上艇／風下艇',
    meaning: '同じタックで横に並んだとき、風に近い側が風上艇、遠い側が風下艇。風上艇が避ける。',
  },
  {
    term: 'オーバーラップ',
    meaning: '2艇が前後に完全には離れず、横方向に重なっている関係。単に真横でなくても成立する。',
  },
  {
    term: 'ゾーン',
    meaning: 'マークから3艇身の範囲。艇体の一部が入った瞬間の位置関係が大切。',
  },
  {
    term: 'プロパー・コース',
    meaning: 'その相手艇がいなければ、できるだけ早くコースを走るために選ぶ進路。スタート信号前にはない。',
  },
  {
    term: 'OCS',
    meaning:
      'スタート信号のとき、艇体の一部がラインよりコース側に出ている状態。通常は戻ってスタートし直すが、準備信号によっては失格になる。',
  },
]

export function BeginnerRuleGuide({ onPractice }: { onPractice: () => void }) {
  return (
    <section className="beginner-guide" id="beginner-guide" aria-labelledby="beginner-title">
      <header className="beginner-guide__header">
        <div>
          <p className="eyebrow">FIRST TIME / 3 CHECKS</p>
          <h2 id="beginner-title">規則番号より先に、3つだけ見る</h2>
        </div>
        <p>
          全部の言葉を覚えてから海へ出る必要はありません。
          迷ったら、この順番に戻ります。
        </p>
      </header>

      <ol className="beginner-checks">
        <li>
          <span>CHECK 1</span>
          <strong>帆は左右どちら側？</strong>
          <p>帆が右ならポート、左ならスターボード。まずタックを決めます。</p>
        </li>
        <li>
          <span>CHECK 2</span>
          <strong>横に重なる？ 前後に離れる？</strong>
          <p>同じタックなら、横の関係か前後の関係かで避ける艇が変わります。</p>
        </li>
        <li>
          <span>CHECK 3</span>
          <strong>どちらかが向きを変えた？</strong>
          <p>タック中、優先関係が変わった直後、進路変更中には追加の制限があります。</p>
        </li>
      </ol>

      <div className="tack-reader">
        <div className="tack-reader__copy">
          <span>最初のコツ</span>
          <h3>タック名は、帆がある側と反対</h3>
          <p>
            艇がどちらから来たかではなく、メインセールとブームが艇のどちら側にあるかを見ます。
          </p>
          <p className="tack-reader__memory">右の帆＝ポート ／ 左の帆＝スターボード</p>
        </div>
        <div className="tack-reader__diagram">
          <TackWind />
          <div className="tack-reader__boats">
            <TackBoat tack="port" />
            <TackBoat tack="starboard" />
          </div>
        </div>
      </div>

      <details className="term-drawer">
        <summary>
          <span>知らない言葉が出てきたら</span>
          <strong>6つの用語をやさしく確認</strong>
        </summary>
        <dl>
          {beginnerTerms.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </details>

      <div className="beginner-guide__next">
        <p>
          <span>NEXT</span>
          下の基本ルールは、結論だけ読めば大丈夫。詳しい条件は必要なときに開けます。
        </p>
        <button className="button button--ink" type="button" onClick={onPractice}>
          図を見て状況問題を解く
        </button>
      </div>
    </section>
  )
}
