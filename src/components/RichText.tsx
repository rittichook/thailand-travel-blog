import React from 'react'

type Props = {
  content: Record<string, unknown>
  className?: string
}

// Simple Lexical rich text renderer
function renderNode(node: Record<string, unknown>, index: number): React.ReactNode {
  const type = node.type as string

  if (type === 'text') {
    let text: React.ReactNode = node.text as string
    const format = node.format as number
    if (format & 1) text = <strong key={index}>{text}</strong>
    if (format & 2) text = <em key={index}>{text}</em>
    if (format & 8) text = <u key={index}>{text}</u>
    return text
  }

  const children = node.children as Record<string, unknown>[] | undefined
  const renderedChildren = children?.map((child, i) => renderNode(child, i))

  switch (type) {
    case 'paragraph':
      return <p key={index}>{renderedChildren}</p>
    case 'heading': {
      const Tag = (node.tag as string) as React.ElementType
      return <Tag key={index}>{renderedChildren}</Tag>
    }
    case 'list': {
      const listType = node.listType as string
      if (listType === 'bullet') return <ul key={index}>{renderedChildren}</ul>
      return <ol key={index}>{renderedChildren}</ol>
    }
    case 'listitem':
      return <li key={index}>{renderedChildren}</li>
    case 'quote':
      return <blockquote key={index}>{renderedChildren}</blockquote>
    case 'link': {
      const url = node.url as string
      return <a key={index} href={url} target="_blank" rel="noopener noreferrer">{renderedChildren}</a>
    }
    default:
      return <React.Fragment key={index}>{renderedChildren}</React.Fragment>
  }
}

export function RichText({ content, className }: Props) {
  if (!content?.root) return null

  const root = content.root as Record<string, unknown>
  const children = root.children as Record<string, unknown>[] | undefined

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#0D9488] dark:prose-a:text-teal-400 ${className ?? ''}`}>
      {children?.map((node, i) => renderNode(node, i))}
    </div>
  )
}
