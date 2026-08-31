import type { GitDiffResult } from '../../../../shared/git-diff-compare-types'
import type { GitStatusEntry } from '../../../../shared/git-status-types'
import type { LargeDiffRenderLimit } from './large-diff-render-limit'

export type DiffSection = {
  key: string
  path: string
  status: string
  area?: GitStatusEntry['area']
  oldPath?: string
  added?: number
  removed?: number
  // Mirrors GitStatusEntry.binary: absent counts explained by binary content.
  binary?: boolean
  originalContent: string
  modifiedContent: string
  collapsed: boolean
  loading: boolean
  loadOnDemand?: boolean
  error?: string
  dirty: boolean
  diffResult: GitDiffResult | null
  largeDiffRenderLimit: LargeDiffRenderLimit | null
  // Why: combined sections keep Monaco models by path; bump on reload so
  // refetched git content does not replay through keepCurrent* model reuse.
  contentGeneration?: number
}
