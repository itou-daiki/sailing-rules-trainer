import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RuleLibrary } from './RuleLibrary'

describe('ルール解説', () => {
  it('ルール画面を離れずに変更点へ移動する', () => {
    render(<RuleLibrary onPractice={vi.fn()} />)
    const section = document.getElementById('rule-changes')
    const scrollIntoView = vi.fn()

    expect(section).not.toBeNull()
    if (!section) return
    section.scrollIntoView = scrollIntoView

    fireEvent.click(screen.getByRole('button', { name: '2025–2028の変更を見る' }))

    expect(scrollIntoView).toHaveBeenCalledOnce()
  })
})
