'use client'

import { useState, useRef, useCallback } from 'react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { 
  Bold, Italic, Strikethrough, List, ListOrdered, Link2, Image, 
  Code, Quote, Heading1, Heading2, Heading3, Eye, Edit3, Columns
} from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

type ViewMode = 'edit' | 'preview' | 'split'

export default function MarkdownEditor({ value, onChange, placeholder = 'İçerik yazın...', minHeight = '300px' }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || placeholder
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const toolbarButtons: Array<{ icon?: any; action?: () => void; title?: string; type?: string }> = [
    { icon: Heading1, action: () => insertText('# ', '', 'Başlık'), title: 'Başlık 1' },
    { icon: Heading2, action: () => insertText('## ', '', 'Başlık'), title: 'Başlık 2' },
    { icon: Heading3, action: () => insertText('### ', '', 'Başlık'), title: 'Başlık 3' },
    { type: 'divider' },
    { icon: Bold, action: () => insertText('**', '**', 'kalın'), title: 'Kalın' },
    { icon: Italic, action: () => insertText('*', '*', 'italik'), title: 'İtalik' },
    { icon: Strikethrough, action: () => insertText('~~', '~~', 'üstü çizili'), title: 'Üstü Çizili' },
    { type: 'divider' },
    { icon: List, action: () => insertText('- ', '', 'liste öğesi'), title: 'Liste' },
    { icon: ListOrdered, action: () => insertText('1. ', '', 'liste öğesi'), title: 'Numaralı Liste' },
    { icon: Quote, action: () => insertText('> ', '', 'alıntı'), title: 'Alıntı' },
    { type: 'divider' },
    { icon: Link2, action: () => insertText('[', '](url)', 'link metni'), title: 'Link' },
    { icon: Image, action: () => insertText('![', '](url)', 'alt metin'), title: 'Resim' },
    { icon: Code, action: () => insertText('`', '`', 'kod'), title: 'Kod' },
  ]

  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.02]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((btn, i) => 
            btn.type === 'divider' ? (
              <div key={i} className="w-px h-5 bg-white/[0.08] mx-1" />
            ) : btn.icon ? (
              <button
                key={i}
                type="button"
                onClick={btn.action}
                title={btn.title}
                className="p-1.5 hover:bg-white/[0.08] rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <btn.icon className="w-4 h-4" />
              </button>
            ) : null
          )}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'edit' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Düzenle"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'split' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Bölünmüş"
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
            title="Önizleme"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div 
        className={`${viewMode === 'split' ? 'grid grid-cols-2' : 'flex'}`} 
        style={{ minHeight }}
      >
        {/* Edit Panel */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'border-r border-white/[0.08]' : 'flex-1'}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full p-4 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none font-mono text-sm"
              style={{ minHeight }}
            />
          </div>
        )}

        {/* Preview Panel */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div 
            className={`p-4 overflow-auto ${viewMode === 'split' ? 'bg-white/[0.01]' : 'flex-1'}`} 
            style={{ minHeight }}
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-gray-500 italic">Önizleme burada görünecek...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
