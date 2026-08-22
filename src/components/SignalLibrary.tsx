import { useState } from 'react'
import { raceSignals, type SignalStage } from '../data/content'
import { FlagArtwork } from './FlagArtwork'

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

  return (
    <section className="page-section" aria-labelledby="signals-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">SIGNAL BOARD</p>
          <h1 id="signals-title">信号旗を、行動とセットで覚える</h1>
          <p className="lead">
            色や形だけでなく、「見たら何をするか」まで確認します。
          </p>
        </div>
        <button className="button button--ink" type="button" onClick={onPractice}>
          信号旗の問題を始める
        </button>
      </div>

      <div className="filter-strip" aria-label="場面で絞り込む">
        {stages.map((item) => (
          <button
            type="button"
            key={item}
            className={item === stage ? 'filter-strip__button is-active' : 'filter-strip__button'}
            aria-pressed={item === stage}
            onClick={() => setStage(item)}
          >
            {item}
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
