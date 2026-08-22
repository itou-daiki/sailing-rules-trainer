import { useState } from 'react'
import { raceSignals, type SignalStage } from '../data/content'
import { FlagArtwork, NumeralPennantArtwork, type NumeralPennantNumber } from './FlagArtwork'

const stages: Array<'すべて' | SignalStage> = [
  'すべて',
  'スタート前',
  'スタート',
  'レース中',
  'コース',
  '安全',
]

export function SignalLibrary({ onPractice }: { onPractice: () => void }) {
  const [stage, setStage] = useState<(typeof stages)[number]>('すべて')
  const visibleSignals =
    stage === 'すべて' ? raceSignals : raceSignals.filter((signal) => signal.stage === stage)
  const countFor = (item: (typeof stages)[number]) =>
    item === 'すべて' ? raceSignals.length : raceSignals.filter((signal) => signal.stage === item).length

  return (
    <section className="page-section" aria-labelledby="signals-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">OFFICIAL RACE SIGNALS / 2025–2028</p>
          <h1 id="signals-title">組み合わせ旗まで、見落とさない</h1>
          <p className="lead">
            単独の旗だけでなく、上下に並ぶ旗とコース変更表示も収録。
            色や形を「見たら何をするか」とセットで確認します。
          </p>
        </div>
        <button className="button button--ink" type="button" onClick={onPractice}>
          信号旗の問題を始める
        </button>
      </div>

      <aside className="signal-scope" aria-label="収録範囲">
        <div>
          <strong>{raceSignals.length}</strong>
          <span>公式レース信号パターン</span>
        </div>
        <p>
          World SailingのRace Signals掲載分を、延期・準備・リコール・中止・コース・安全まで収録。
          <strong> 上の旗から下の旗へ</strong>読むのが、組み合わせ信号の基本です。
        </p>
      </aside>

      <div className="filter-strip" aria-label="場面で絞り込む">
        {stages.map((item) => (
          <button
            type="button"
            key={item}
            className={item === stage ? 'filter-strip__button is-active' : 'filter-strip__button'}
            aria-pressed={item === stage}
            onClick={() => setStage(item)}
          >
            <span>{item}</span>
            <small>{countFor(item)}</small>
          </button>
        ))}
      </div>

      <div className="signal-ledger">
        {visibleSignals.map((signal, index) => (
          <article className="signal-row" key={signal.id}>
            <span className="signal-row__number">{String(index + 1).padStart(2, '0')}</span>
            <FlagArtwork kind={signal.artwork} label={signal.name} compact />
            <div className="signal-row__body">
              <div className="signal-row__titleline">
                <h2>{signal.name}</h2>
                <span className="signal-code">{signal.code}</span>
                <span className="signal-stage">{signal.stage}</span>
              </div>
              <p className="signal-row__summary">{signal.summary}</p>
              <p className="signal-row__action">
                <span>艇上での行動</span>
                {signal.sailorAction}
              </p>
              {signal.variants ? (
                <div className="signal-variants" aria-label="数字旗ごとの延期時間">
                  <p>数字旗 1〜9 は、数字と延期時間が同じです。</p>
                  <ul>
                    {signal.variants.map((variant, index) => (
                      <li key={variant.code}>
                        <NumeralPennantArtwork number={(index + 1) as NumeralPennantNumber} />
                        <strong>{variant.code.replace('数字旗 ', '')}</strong>
                        <span>{variant.meaning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <details>
                <summary>補足と規則番号</summary>
                <p>{signal.detail}</p>
                <p className="formal-reference">{signal.reference}</p>
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
