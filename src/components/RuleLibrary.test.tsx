import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RuleLibrary } from './RuleLibrary'

afterEach(cleanup)

describe('ルール解説', () => {
  it('初心者ガイドと変更点へルール画面内で移動する', () => {
    render(
      <RuleLibrary
        boatClass="420"
        onBoatClassChange={vi.fn()}
        onPractice={vi.fn()}
      />,
    )
    const beginnerSection = document.getElementById('beginner-guide')
    const changesSection = document.getElementById('rule-changes')
    const beginnerScroll = vi.fn()
    const changesScroll = vi.fn()

    expect(beginnerSection).not.toBeNull()
    expect(changesSection).not.toBeNull()
    if (!beginnerSection || !changesSection) return
    beginnerSection.scrollIntoView = beginnerScroll
    changesSection.scrollIntoView = changesScroll

    fireEvent.click(screen.getByRole('button', { name: '初心者ガイドから読む' }))
    fireEvent.click(screen.getByRole('button', { name: '変更点だけを見る' }))

    expect(beginnerScroll).toHaveBeenCalledOnce()
    expect(changesScroll).toHaveBeenCalledOnce()
  })

  it('専門用語と詳しい条件を最初は閉じておく', () => {
    render(
      <RuleLibrary
        boatClass="420"
        onBoatClassChange={vi.fn()}
        onPractice={vi.fn()}
      />,
    )

    expect(screen.getByText('規則番号より先に、3つだけ見る')).toBeInTheDocument()
    expect(screen.getByText('6つの用語をやさしく確認').closest('details')).not.toHaveAttribute('open')
    expect(screen.getByText('反対タック').closest('details')).not.toHaveAttribute('open')
    expect(screen.getByText('「自艇が当たらない」だけではない').closest('details')).not.toHaveAttribute('open')
    expect(screen.getByText('障害物を通過するルーム').closest('details')).not.toHaveAttribute('open')
    expect(screen.getByText('違反時のペナルティー').closest('details')).not.toHaveAttribute('open')
    expect(screen.getByText('推進方法').closest('details')).not.toHaveAttribute('open')
  })
})
