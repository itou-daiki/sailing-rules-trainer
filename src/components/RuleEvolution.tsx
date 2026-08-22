import { RULESET } from '../data/content'
import {
  ruleChanges,
  ruleEras,
  ruleEvolutionSources,
} from '../data/ruleEvolution'

export function RuleEvolution() {
  return (
    <section className="revision-dossier" id="rule-changes" aria-labelledby="revision-title">
      <header className="revision-dossier__header">
        <div>
          <p className="eyebrow">FOR RETURNING SAILORS / 2025–2028</p>
          <h2 id="revision-title">以前のルールを知っている人へ</h2>
          <p>
            初めて学ぶ人は、ここを今すぐ覚えなくても大丈夫です。
            2021–2024版との違いを知りたいときだけ、項目を開いてください。
          </p>
        </div>
        <div className="revision-stamp" aria-label="現在の規則版">
          <span>CURRENT EDITION</span>
          <strong>2025<br />— 2028</strong>
          <small>発効 2025.01.01</small>
        </div>
      </header>

      <details className="rule-history">
        <summary>
          <span>HISTORY</span>
          <strong id="history-title">ルールの歴史を4段階で見る</strong>
          <small>クラブの約束から世界共通へ</small>
        </summary>
        <ol aria-labelledby="history-title">
          {ruleEras.map((era) => (
            <li key={era.id}>
              <time>{era.period}</time>
              <h4>{era.title}</h4>
              <p>{era.summary}</p>
            </li>
          ))}
        </ol>
        <div className="edition-cycle" aria-label="2025年から2028年までの現行規則の期間">
          {['2025', '2026', '2027', '2028'].map((year, index) => (
            <span className={index === 1 ? 'is-current' : ''} key={year}>
              <small>{index === 0 ? 'START' : index === 3 ? 'END' : 'IN FORCE'}</small>
              {year}
            </span>
          ))}
        </div>
      </details>

      <div className="change-log" aria-labelledby="changes-title">
        <div className="revision-section-title revision-section-title--plain">
          <div>
            <p>2021–2024 → 2025–2028</p>
            <h3 id="changes-title">変更は6項目。題名を押すと詳しく読めます</h3>
          </div>
        </div>

        {ruleChanges.map((change, index) => (
          <details className="change-entry" key={change.id}>
            <summary>
              <span className="change-entry__reference">
                <small>{String(index + 1).padStart(2, '0')}</small>
                <strong>{change.reference}</strong>
              </span>
              <span className="change-entry__summary">
                <strong>{change.title}</strong>
                <small>{change.quick}</small>
              </span>
              <span className="change-entry__open" aria-hidden="true">詳しく</span>
            </summary>
            <div className="change-entry__content">
              <div className="change-entry__flow">
                <div>
                  <h5>BEFORE <span>以前</span></h5>
                  <p>{change.before}</p>
                </div>
                <div className="change-entry__now">
                  <h5>NOW <span>今回</span></h5>
                  <p>{change.now}</p>
                </div>
                <div className="change-entry__action">
                  <h5>ON WATER <span>艇上では</span></h5>
                  <p>{change.onWater}</p>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>

      <aside className="revision-notice" aria-labelledby="revision-notice-title">
        <div>
          <span>大会では</span>
          <h3 id="revision-notice-title">公式の文書を優先</h3>
        </div>
        <p>
          ここでは学習用に短く言い換えています。現行版は{RULESET.edition}、
          {RULESET.currentThrough}まで確認済みです。大会ではレース公示・帆走指示書で
          規則が変更される場合があるため、必ず大会文書と公式本文を優先してください。
        </p>
      </aside>

      <details className="revision-sources">
        <summary>
          <span>PRIMARY SOURCES</span>
          <strong id="sources-title">根拠にした公式資料</strong>
          <small>5件</small>
        </summary>
        <ul>
          {ruleEvolutionSources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                <span>{source.label}</span>
                <small>{source.description}</small>
                <b aria-hidden="true">↗</b>
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}
