import { sanitizeHtml } from '@/lib/xss'

/* ── TipTap types ─────────────────────────────────────────────── */

interface TipTapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

interface TipTapDoc extends TipTapNode {
  type: 'doc'
}

/* ── TipTap JSON → HTML renderer ──────────────────────────────── */

function renderTipTapNode(node: TipTapNode): string {
  switch (node.type) {
    case 'doc':
      return (node.content ?? []).map(renderTipTapNode).join('')

    case 'paragraph':
      return `<p>${(node.content ?? []).map(renderTipTapNode).join('')}</p>`

    case 'heading': {
      const level = (node.attrs?.level as number) ?? 2
      return `<h${level}>${(node.content ?? []).map(renderTipTapNode).join('')}</h${level}>`
    }

    case 'text': {
      let text = node.text ?? ''
      for (const mark of node.marks ?? []) {
        switch (mark.type) {
          case 'bold':
            text = `<strong>${text}</strong>`
            break
          case 'italic':
            text = `<em>${text}</em>`
            break
          case 'link': {
            const href = (mark.attrs?.href as string) ?? '#'
            text = `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`
            break
          }
          case 'code':
            text = `<code>${text}</code>`
            break
        }
      }
      return text
    }

    case 'bulletList':
      return `<ul>${(node.content ?? []).map(renderTipTapNode).join('')}</ul>`

    case 'orderedList':
      return `<ol>${(node.content ?? []).map(renderTipTapNode).join('')}</ol>`

    case 'listItem':
      return `<li>${(node.content ?? []).map(renderTipTapNode).join('')}</li>`

    case 'blockquote':
      return `<blockquote>${(node.content ?? []).map(renderTipTapNode).join('')}</blockquote>`

    case 'codeBlock': {
      const lang = (node.attrs?.language as string) ?? ''
      return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${(node.content ?? []).map(renderTipTapNode).join('')}</code></pre>`
    }

    case 'horizontalRule':
      return '<hr />'

    case 'hardBreak':
      return '<br />'

    default:
      return (node.content ?? []).map(renderTipTapNode).join('')
  }
}

function renderTipTapJson(doc: TipTapDoc): string {
  try {
    const html = renderTipTapNode(doc)
    return sanitizeHtml(html)
  } catch {
    return ''
  }
}

/* ── Public API ────────────────────────────────────────────────── */

/**
 * Render a page's `content` JSON field into a safe HTML string.
 *
 * Handles multiple storage formats:
 * - TipTap ProseMirror JSON → rendered to HTML
 * - Object with `body` field (HTML string)
 * - Object with `content` field (HTML string)
 * - Raw HTML string
 * - Fallback: excerpt wrapped in a `<p>`
 */
export function renderPageContent(page: {
  content: unknown
  excerpt: string | null
}): string {
  const content = page.content

  // TipTap JSON doc
  if (
    content &&
    typeof content === 'object' &&
    'type' in (content as Record<string, unknown>) &&
    (content as Record<string, unknown>).type === 'doc'
  ) {
    return renderTipTapJson(content as TipTapDoc)
  }

  // Object with body field (HTML)
  if (content && typeof content === 'object' && 'body' in (content as Record<string, unknown>)) {
    const body = (content as Record<string, string>).body
    if (body) return sanitizeHtml(body)
  }

  // Object with content field (HTML)
  if (content && typeof content === 'object' && 'content' in (content as Record<string, unknown>)) {
    const inner = (content as Record<string, string>).content
    if (inner) return sanitizeHtml(inner)
  }

  // Raw string (HTML)
  if (typeof content === 'string') {
    return sanitizeHtml(content)
  }

  // Fallback: excerpt as plain text
  return page.excerpt ? sanitizeHtml(`<p>${page.excerpt}</p>`) : ''
}
