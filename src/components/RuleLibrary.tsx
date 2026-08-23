import { coreRules } from '../data/content'
import { BeginnerRuleGuide } from './BeginnerRuleGuide'
import { RuleEvolution } from './RuleEvolution'

const rulesWithIds = (ids: string[]) => coreRules.filter((rule) => ids.includes(rule.id))

const ruleGroups = [
  {
    label: 'まず覚える',
    title: 'タックと艇の位置',
    description: '規則10〜13。帆の左右と、横・前後・タック中を見ます。',
    rules: rulesWithIds(['r10', 'r11', 'r12', 'r13']),
  },
  {
    label: '安全のため',
    title: '優先側にも制限がある',
    description: '規則14〜16。優先でも、接触や急な進路変更はできません。',
    rules: rulesWithIds(['r14', 'r15', 'r16']),
  },
  {
    label: '慣れてから',
    title: '追いついた風下艇の制限',
    description: '規則17。成立条件が多いので、最初は結論だけで大丈夫です。',
    rules: rulesWithIds(['r17']),
  },
  {
    label: 'マークで使う',
    title: 'ゾーンへ入る瞬間を止めて見る',
    description: '規則18。重なり、内側・外側、タックの順に整理します。',
    rules: rulesWithIds(['r18']),
  },
  {
    label: '危険を避ける',
    title: '安全と障害物を先に処理する',
    description: '規則1、3、19〜23、40。防波堤、戻る艇、転覆艇、PFDへの行動です。',
    rules: rulesWithIds(['r1', 'r3', 'r19', 'r20', 'r21', 'r22', 'r23', 'r40']),
  },
  {
    label: '違反したら',
    title: '回転・リタイア・免罪を選ぶ',
    description: '規則31、43、44。接触の事実と、違反後の行動までを一組で覚えます。',
    rules: rulesWithIds(['r31', 'r43', 'r44']),
  },
  {
    label: '公正に走る',
    title: 'コース・推進・援助・抗議',
    description: '規則28、41、42、60。速く走るだけでなく、正しい方法と手続を確認します。',
    rules: rulesWithIds(['r28', 'r41', 'r42', 'r60']),
  },
]

export function RuleLibrary({ onPractice }: { onPractice: () => void }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView()
  }

  return (
    <section className="page-section" aria-labelledby="rules-title">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">FIRST RULES / WHEN BOATS MEET</p>
          <h1 id="rules-title">初めてでも、まず3つ見ればいい</h1>
          <p className="lead">
            規則番号はあとで大丈夫。帆の位置、艇どうしの位置、動きの変化を順番に見ます。
          </p>
        </div>
        <div className="section-heading__actions">
          <button
            aria-controls="beginner-guide"
            className="button button--ink"
            type="button"
            onClick={() => scrollTo('beginner-guide')}
          >
            初心者ガイドから読む
          </button>
          <button
            aria-controls="rule-changes"
            className="button button--line"
            type="button"
            onClick={() => scrollTo('rule-changes')}
          >
            変更点だけを見る
          </button>
        </div>
      </div>

      <BeginnerRuleGuide onPractice={onPractice} />

      <section className="rule-basics" aria-labelledby="rule-basics-title">
        <header className="rule-basics__header">
          <p className="eyebrow">BASIC RULES / SHORT VERSION</p>
          <h2 id="rule-basics-title">基本ルールは、まず結論だけ読む</h2>
          <p>詳しい条件や例は、気になるルールを押すと開きます。</p>
        </header>

        {ruleGroups.map((group) => (
          <div className="rule-group" key={group.title}>
            <div className="rule-group__heading">
              <span>{group.label}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </div>

            <div className="rule-ledger">
              {group.rules.map((rule) => (
                <details className="rule-entry" key={rule.id}>
                  <summary>
                    <span className="rule-entry__number">
                      <small>RULE</small>
                      {rule.number}
                    </span>
                    <span className="rule-entry__body">
                      <strong>{rule.title}</strong>
                      <span className="rule-entry__takeaway">{rule.takeaway}</span>
                    </span>
                    <span className="rule-entry__open" aria-hidden="true">条件と例</span>
                  </summary>
                  <div className="rule-entry__details">
                    <div className="rule-entry__example">
                      <h4>たとえば</h4>
                      <p>{rule.example}</p>
                    </div>
                    <div>
                      <h4>見るポイント</h4>
                      <ul>
                        {rule.lookFor.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>早合点しない</h4>
                      <p>{rule.caution}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>

      <RuleEvolution />
    </section>
  )
}
