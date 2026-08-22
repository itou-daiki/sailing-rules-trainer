const TackBoat = ({ side }: { side: 'left' | 'right' }) => {
  const isRight = side === 'right'
  const sailX = isRight ? 72 : 28
  const boomX = isRight ? 69 : 31
  const color = isRight ? '#c93627' : '#155b9a'
  const tack = isRight ? 'ポートタック' : 'スターボードタック'
  const sideLabel = isRight ? '右側（右舷）' : '左側（左舷）'

  return (
    <figure className="tack-boat">
      <svg role="img" aria-label={`帆が艇の${sideLabel}にある${tack}`} viewBox="0 0 100 118">
        <path d="M50 11 C65 24 66 83 50 104 C34 83 35 24 50 11Z" className="tack-boat__hull" />
        <path d={`M50 25 L50 88 L${sailX} 67 Z`} fill={color} className="tack-boat__sail" />
        <path d={`M50 57 L${boomX} 67`} className="tack-boat__boom" />
        <text x={isRight ? 76 : 24} y="61" textAnchor="middle" className="tack-boat__side-label">
          帆
        </text>
      </svg>
      <figcaption>
        <span>帆が{sideLabel}</span>
        <strong>→ {tack}</strong>
      </figcaption>
    </figure>
  )
}

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
        <div className="tack-reader__boats">
          <TackBoat side="right" />
          <TackBoat side="left" />
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
