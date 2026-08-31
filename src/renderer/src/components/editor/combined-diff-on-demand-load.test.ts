import { describe, expect, it } from 'vitest'
import {
  MAX_AUTOMATIC_DIFF_CHANGED_LINES,
  shouldLoadCombinedDiffOnDemand
} from './combined-diff-on-demand-load'

describe('combined diff on-demand loading', () => {
  it('defers diffs above the automatic changed-line limit', () => {
    expect(
      shouldLoadCombinedDiffOnDemand({
        added: MAX_AUTOMATIC_DIFF_CHANGED_LINES,
        removed: 1
      })
    ).toBe(true)
  })

  it('automatically loads diffs at the limit', () => {
    expect(
      shouldLoadCombinedDiffOnDemand({
        added: MAX_AUTOMATIC_DIFF_CHANGED_LINES - 500,
        removed: 500
      })
    ).toBe(false)
  })

  it('defers any file whose line counts were skipped as too large', () => {
    expect(shouldLoadCombinedDiffOnDemand({ path: 'data/dump.json' })).toBe(true)
  })

  it('automatically loads binary files that report no line counts', () => {
    expect(shouldLoadCombinedDiffOnDemand({ binary: true, path: 'docs/spec.pdf' })).toBe(false)
  })

  it('automatically loads images that report no line counts', () => {
    expect(shouldLoadCombinedDiffOnDemand({ path: 'docs/Shot.PNG' })).toBe(false)
  })

  it('defers uncounted SVGs, which git reports as text and Monaco renders', () => {
    expect(shouldLoadCombinedDiffOnDemand({ path: 'assets/map.svg' })).toBe(true)
  })

  it('defers untracked diffs when only additions are reported', () => {
    expect(shouldLoadCombinedDiffOnDemand({ added: MAX_AUTOMATIC_DIFF_CHANGED_LINES + 1 })).toBe(
      true
    )
  })

  it('defers diffs when only removals are reported', () => {
    expect(shouldLoadCombinedDiffOnDemand({ removed: MAX_AUTOMATIC_DIFF_CHANGED_LINES + 1 })).toBe(
      true
    )
  })
})
