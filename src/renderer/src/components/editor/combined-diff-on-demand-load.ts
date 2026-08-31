import { IMAGE_FILE_EXTENSIONS } from '../../../../shared/image-file-extensions'

export const MAX_AUTOMATIC_DIFF_CHANGED_LINES = 10_000

// Why: git never reports SVG as binary content, so an SVG diff always lands in
// Monaco as text and has to obey the size rule like any other text file.
const PREVIEW_IMAGE_EXTENSIONS = IMAGE_FILE_EXTENSIONS.filter((ext) => ext !== '.svg')

function isPreviewImagePath(path: string | undefined): boolean {
  const lowerPath = path?.toLowerCase()
  return lowerPath !== undefined && PREVIEW_IMAGE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext))
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
    // file — oversized, or a status scan that stopped at its entry cap. Only the
    // latter can be a huge text file, so it is the only one worth deferring.
    return binary !== true && !isPreviewImagePath(path)
  }
  return (added ?? 0) + (removed ?? 0) > MAX_AUTOMATIC_DIFF_CHANGED_LINES
}
