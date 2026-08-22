import { useState } from 'react'

const sequenceSteps = [
  {
    time: '5:00',
    signal: '予告',
    flag: 'クラス旗 ↑',
    sound: '音響1声',
    action: '自分のクラスを確認し、スタート・ラインと風を読む。',
  },
  {
    time: '4:00',
    signal: '準備',
    flag: 'P・I・Z・U・黒旗 ↑',
    sound: '音響1声',
    action: '準備旗の種類を見て、残り1分の制限を決める。',
  },
  {
    time: '1:00',
    signal: '1分',
    flag: '準備旗 ↓',
    sound: '長音1声',
    action: '適用されるスタート規則を守り、最終進入へ入る。',
  },
  {
    time: '0:00',
    signal: 'スタート',
    flag: 'クラス旗 ↓',
    sound: '音響1声',
    action: '信号を基準にスタートする。音が鳴らなくても視覚信号を確認する。',
  },
] as const

export function StartSequenceTrainer({ onPractice }: { onPractice: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = sequenceSteps[activeIndex] ?? sequenceSteps[0]!

  return (
    <section className="start-sequence" aria-labelledby="sequence-title">
      <div className="start-sequence__heading">
        <div>
          <p className="eyebrow">RULE 26 / START SEQUENCE</p>
          <h2 id="sequence-title">5分前から、何を見る？</h2>
        </div>
        <button type="button" className="button button--line" onClick={onPractice}>
          スタート信号を練習
        </button>
      </div>

      <div className="sequence-board">
        <div className="sequence-track" role="tablist" aria-label="スタート信号の時系列">
          {sequenceSteps.map((step, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? 'is-active' : ''}
              key={step.time}
              onClick={() => setActiveIndex(index)}
            >
              <strong>{step.time}</strong>
              <span>{step.signal}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="sequence-brief" role="tabpanel" aria-live="polite">
          <span className="sequence-brief__time">{active.time}</span>
          <div>
            <p>{active.flag}</p>
            <strong>{active.action}</strong>
            <small>{active.sound} ／ 視覚信号が時刻の基準</small>
          </div>
        </div>
      </div>
    </section>
  )
}
