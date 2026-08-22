import { coreRules } from '../data/content'

export function RuleLibrary({ onPractice }: { onPractice: () => void }) {
  return (
    <section className="page-section" aria-labelledby="rules-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">PART 2 / WHEN BOATS MEET</p>
          <h1 id="rules-title">出会う艇の、どこを見るか</h1>
          <p className="lead">
            最初に規則番号を暗記せず、タック・重なり・位置の順で整理します。
          </p>
        </div>
        <button className="button button--ink" type="button" onClick={onPractice}>
          状況問題を始める
        </button>
      </div>

      <div className="decision-line" aria-label="基本の判断順序">
        <span>01 タック</span>
        <span>02 重なり</span>
        <span>03 風上・風下／前・後</span>
        <span>04 動作の変化</span>
      </div>

      <div className="rule-ledger">
        {coreRules.map((rule) => (
          <article className="rule-entry" key={rule.id}>
            <div className="rule-entry__number">
              <span>RULE</span>
              {rule.number}
            </div>
            <div className="rule-entry__body">
              <h2>{rule.title}</h2>
              <p className="rule-entry__takeaway">{rule.takeaway}</p>
              <div className="rule-entry__grid">
                <div>
                  <h3>見るポイント</h3>
                  <ul>
                    {rule.lookFor.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>早合点しない</h3>
                  <p>{rule.caution}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
