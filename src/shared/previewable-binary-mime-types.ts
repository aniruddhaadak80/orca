/**
 * The single list of binary extensions that have a real in-app preview: the
 * blob readers base64 these, and the diff viewer trusts that a preview exists
 * rather than deferring the row behind the large-diff prompt.
 */
export const PREVIEWABLE_BINARY_MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
}

export const PREVIEWABLE_BINARY_EXTENSIONS = Object.freeze(
  Object.keys(PREVIEWABLE_BINARY_MIME_TYPES)
)
