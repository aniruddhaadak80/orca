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

  it('automatically loads uncounted PDFs, which have a real preview', () => {
    expect(shouldLoadCombinedDiffOnDemand({ path: 'docs/spec.PDF' })).toBe(false)
  })

  it('defers every row when the numstat pass failed and left the scan uncounted', () => {
    // A failed numstat drops counts for a whole area at once. Rows with a real
    // preview still load; everything else degrades to the click-to-load prompt.
    const uncountedRows = [
      { path: 'src/app.ts' },
      { path: 'assets/logo.png' },
      { path: 'docs/spec.pdf' },
      { path: 'fonts/inter.woff2' },
      { path: 'archive.zip' }
    ]

    expect(uncountedRows.map((row) => shouldLoadCombinedDiffOnDemand(row))).toEqual([
      true,
      false,
      false,
      true,
      true
    ])
  })

  it('degrades gracefully when an older remote host omits the binary marker', () => {
    // Wire compatibility: an old relay simply leaves `binary` off the entry, so
    // the row must defer rather than throw or auto-load an unknown-size file.
    const legacyEntry = JSON.parse('{"path":"fonts/inter.woff2","status":"modified"}') as {
      path: string
    }

    expect(shouldLoadCombinedDiffOnDemand(legacyEntry)).toBe(true)
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
