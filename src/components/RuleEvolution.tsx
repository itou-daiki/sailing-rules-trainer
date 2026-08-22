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
          <p className="eyebrow">EDITION LOG / WHAT CHANGED</p>
          <h2 id="revision-title">ルールは、なぜ今の形になった？</h2>
          <p>
            昔はクラブごとに違った規則が、国際的な共通ルールへ育ちました。
            今回は2021–2024版から、艇上の判断に関係する変更を抜き出します。
          </p>
        </div>
        <div className="revision-stamp" aria-label="現在の規則版">
          <span>CURRENT EDITION</span>
          <strong>2025<br />— 2028</strong>
          <small>発効 2025.01.01</small>
        </div>
      </header>

      <div className="rule-history" aria-labelledby="history-title">
        <div className="revision-section-title">
          <span>01</span>
          <div>
            <p>HISTORY</p>
            <h3 id="history-title">クラブの約束から、世界の共通語へ</h3>
          </div>
        </div>
        <ol>
          {ruleEras.map((era) => (
            <li key={era.id}>
              <time>{era.period}</time>
              <h4>{era.title}</h4>
              <p>{era.summary}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="edition-cycle" aria-label="2025年から2028年までの現行規則の期間">
        {['2025', '2026', '2027', '2028'].map((year, index) => (
          <span className={index === 1 ? 'is-current' : ''} key={year}>
            <small>{index === 0 ? 'START' : index === 3 ? 'END' : 'IN FORCE'}</small>
            {year}
          </span>
        ))}
      </div>

      <div className="change-log" aria-labelledby="changes-title">
        <div className="revision-section-title">
          <span>02</span>
          <div>
            <p>2021–2024 → 2025–2028</p>
            <h3 id="changes-title">今回、艇上で押さえたい6つの変更</h3>
          </div>
        </div>

        <div className="change-log__labels" aria-hidden="true">
          <span>REFERENCE</span>
          <span>BEFORE / 以前</span>
          <span>NOW / 今回</span>
          <span>ON WATER / 艇上では</span>
        </div>

        {ruleChanges.map((change, index) => (
          <article className="change-entry" key={change.id}>
            <div className="change-entry__reference">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{change.reference}</strong>
            </div>
            <div className="change-entry__content">
              <h4>{change.title}</h4>
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
          </article>
        ))}
      </div>

      <aside className="revision-notice" aria-labelledby="revision-notice-title">
        <div>
          <span>READ THIS FIRST</span>
          <h3 id="revision-notice-title">この解説だけで、抗議を判断しない</h3>
        </div>
        <p>
          ここでは学習用に短く言い換えています。現行版は{RULESET.edition}、
          {RULESET.currentThrough}まで確認済みです。大会ではレース公示・帆走指示書で
          規則が変更される場合があるため、必ず大会文書と公式本文を優先してください。
        </p>
      </aside>

      <div className="revision-sources" aria-labelledby="sources-title">
        <div className="revision-section-title">
          <span>03</span>
          <div>
            <p>PRIMARY SOURCES</p>
            <h3 id="sources-title">公式資料で確かめる</h3>
          </div>
        </div>
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
      </div>
    </section>
  )
}
