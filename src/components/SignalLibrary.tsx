import { useState } from 'react'
import {
  allSignals,
  raceSignals,
  specialSignals,
  type RaceSignal,
  type SignalStage,
} from '../data/content'
import { FlagArtwork, NumeralPennantArtwork, type NumeralPennantNumber } from './FlagArtwork'

const stages: Array<'すべて' | SignalStage> = [
  'すべて',
  'スタート前',
  'スタート',
  'レース中',
  'コース',
  '安全',
  '追加信号',
]

const SignalRows = ({ signals }: { signals: RaceSignal[] }) => (
  <>
    {signals.map((signal) => (
      <article className="signal-row" key={signal.id}>
        <span className="signal-row__number">
          {String(allSignals.findIndex((item) => item.id === signal.id) + 1).padStart(2, '0')}
        </span>
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
  </>
)

export function SignalLibrary({ onPractice }: { onPractice: () => void }) {
  const [stage, setStage] = useState<(typeof stages)[number]>('すべて')
  const visibleSignals =
    stage === 'すべて' ? allSignals : allSignals.filter((signal) => signal.stage === stage)
  const visibleIds = new Set(visibleSignals.map((signal) => signal.id))
  const visibleRaceSignals = raceSignals.filter((signal) => visibleIds.has(signal.id))
  const visibleSpecialSignals = specialSignals.filter((signal) => visibleIds.has(signal.id))
  const countFor = (item: (typeof stages)[number]) =>
    item === 'すべて' ? allSignals.length : allSignals.filter((signal) => signal.stage === item).length

  return (
    <section className="page-section" aria-labelledby="signals-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">RACE SIGNALS / APPENDIX / SAILING INSTRUCTIONS</p>
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
          <strong>{allSignals.length}</strong>
          <span>収録信号パターン</span>
        </div>
        <p>
          RRS巻頭の共通信号26件に、O・R旗など付則や大会文書で使う5件を追加。
          <strong> 追加信号は適用条件と帆走指示書も一緒に</strong>確認します。
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
        {visibleRaceSignals.length > 0 ? (
          <>
            <div className="signal-ledger__section-title">
              <span>BASIC / 26</span>
              <strong>RRS巻頭の共通信号</strong>
              <small>フリートレースで最初に確認</small>
            </div>
            <SignalRows signals={visibleRaceSignals} />
          </>
        ) : null}

        {visibleSpecialSignals.length > 0 ? (
          <>
            <div className="signal-ledger__section-title signal-ledger__section-title--special">
              <span>APPENDIX / 05</span>
              <strong>付則・大会文書の追加信号</strong>
              <small>適用条件、クラス規則、帆走指示書も確認</small>
            </div>
            <SignalRows signals={visibleSpecialSignals} />
          </>
        ) : null}
      </div>
    </section>
  )
}
