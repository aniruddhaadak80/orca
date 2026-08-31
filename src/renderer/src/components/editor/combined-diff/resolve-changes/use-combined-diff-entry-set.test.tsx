// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it } from 'vitest'
import type { OpenFile } from '@/store/slices/editor'
import type { GitStatusEntry } from '../../../../../../shared/git-status-types'
import type { DiffSection } from '../../diff-section-types'
import { EMPTY_GIT_BRANCH_ENTRIES, useCombinedDiffEntrySet } from './use-combined-diff-entry-set'

const combinedDiffTab: OpenFile = {
  id: 'combined-uncommitted',
  filePath: '/repo',
  relativePath: '',
  worktreeId: 'wt-1',
  language: 'plaintext',
  isDirty: false,
  mode: 'diff',
  diffSource: 'combined-uncommitted'
}

function entrySignatureFor(gitStatusEntries: GitStatusEntry[]): string {
  const sectionsRef: React.RefObject<DiffSection[]> = { current: [] }
  const { result } = renderHook(() =>
    useCombinedDiffEntrySet({
      file: combinedDiffTab,
      gitStatusEntries,
      liveBranchEntries: EMPTY_GIT_BRANCH_ENTRIES,
      sectionsRef
    })
  )
  return result.current.entrySignature
}

describe('useCombinedDiffEntrySet', () => {
  it('changes the entry signature when a refresh only corrects the binary marker', () => {
    const uncounted: GitStatusEntry = {
      path: 'assets/doc.pdf',
      status: 'modified',
      area: 'unstaged'
    }

    // Why pinned: with counts absent, `binary` alone decides deferred vs.
    // auto-loaded, so a signature that ignores it leaves a wrongly-deferred row
    // behind the prompt for the life of the view.
    expect(entrySignatureFor([uncounted])).not.toBe(
      entrySignatureFor([{ ...uncounted, binary: true }])
    )
  })
})
