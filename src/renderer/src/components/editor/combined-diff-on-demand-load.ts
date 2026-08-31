import { PREVIEWABLE_BINARY_EXTENSIONS } from '../../../../shared/previewable-binary-mime-types'

export const MAX_AUTOMATIC_DIFF_CHANGED_LINES = 10_000

// Why: git never reports SVG as binary content, so an SVG diff always lands in
// Monaco as text and has to obey the size rule like any other text file.
const PREVIEWED_EXTENSIONS = PREVIEWABLE_BINARY_EXTENSIONS.filter((ext) => ext !== '.svg')

function isPreviewedBinaryPath(path: string | undefined): boolean {
  const lowerPath = path?.toLowerCase()
  return lowerPath !== undefined && PREVIEWED_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))
}

export function shouldLoadCombinedDiffOnDemand({
  added,
  removed,
  binary,
  path
}: {
  added?: number
  removed?: number
  binary?: boolean
  path?: string
}): boolean {
  if (added === undefined && removed === undefined) {
    // Counts are missing either because the content is binary (cheap: a preview
    // or a one-line placeholder, never Monaco) or because the scan skipped the
    // file — oversized, a status scan that stopped at its entry cap, a failed
    // numstat, or an older remote host that predates the marker. Only those can
    // be a huge text file, so they are the only ones worth deferring.
    return binary !== true && !isPreviewedBinaryPath(path)
  }
  return (added ?? 0) + (removed ?? 0) > MAX_AUTOMATIC_DIFF_CHANGED_LINES
}
