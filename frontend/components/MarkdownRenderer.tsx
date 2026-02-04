'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3 mt-5 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-white mb-2 mt-4 first:mt-0">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-semibold text-white mb-2 mt-3">{children}</h4>,
          p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1 ml-2">{children}</ol>,
          li: ({ children }) => <li className="text-gray-300">{children}</li>,
          a: ({ href, children }) => <a href={href} className="text-violet-400 hover:text-violet-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
          code: ({ children, className }) => {
            const isInline = !className
            return isInline 
              ? <code className="px-1.5 py-0.5 bg-white/10 text-violet-300 rounded text-sm font-mono">{children}</code>
              : <code className={className}>{children}</code>
          },
          pre: ({ children }) => <pre className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 overflow-x-auto mb-4 text-sm">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-violet-500 pl-4 italic text-gray-400 my-4">{children}</blockquote>,
          hr: () => <hr className="border-white/[0.08] my-6" />,
          img: ({ src, alt }) => <img src={src} alt={alt || ''} className="rounded-xl max-w-full h-auto my-4" />,
          table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse">{children}</table></div>,
          th: ({ children }) => <th className="border border-white/[0.08] px-4 py-2 bg-white/[0.03] text-white font-semibold text-left">{children}</th>,
          td: ({ children }) => <td className="border border-white/[0.08] px-4 py-2 text-gray-300">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
