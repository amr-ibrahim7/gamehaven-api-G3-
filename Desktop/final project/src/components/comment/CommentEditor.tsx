'use client'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Code, Send } from 'lucide-react'
import { CommentContent } from '@/types/comments'
import CodeEditor from '../code/CodeEditor'

interface CommentEditorProps {
  initialValue?: CommentContent
  onSubmit: (content: CommentContent) => void
  placeholder?: string
  showCodeToggle?: boolean
}

export default function CommentEditor({
  initialValue = { text: '' },
  onSubmit,
  placeholder = "Write a comment...",
  showCodeToggle = true
}: CommentEditorProps) {
  const [content, setContent] = useState<CommentContent>(initialValue)
  const [showCodeEditor, setShowCodeEditor] = useState(!!initialValue.code)
  const [codeLanguage, setCodeLanguage] = useState(initialValue.code?.language || 'javascript')

  const handleSubmit = () => {
    if (!content.text.trim() && !content.code?.code.trim()) return
    
    // Clean up empty code blocks
    const cleanContent = {
      text: content.text.trim(),
      code: content.code?.code.trim() ? content.code : undefined
    }
    
    onSubmit(cleanContent)
    setContent({ text: '' })
    setShowCodeEditor(false)
  }

  const handleAddCode = () => {
    setShowCodeEditor(true)
    setContent(prev => ({
      ...prev,
      code: { code: '', language: 'javascript' }
    }))
  }

  const handleRemoveCode = () => {
    setShowCodeEditor(false)
    setContent(prev => ({ ...prev, code: undefined }))
  }

  const updateCode = (code: string) => {
    setContent(prev => ({
      ...prev,
      code: { code, language: codeLanguage }
    }))
  }

  const updateLanguage = (language: string) => {
    setCodeLanguage(language)
    setContent(prev => ({
      ...prev,
      code: prev.code ? { ...prev.code, language } : undefined
    }))
  }

  return (
    <div className="border-0 shadow-none my-4">
        {/* Text Editor */}
        <div className="relative mb-3">
          <Textarea
            value={content.text}
            onChange={(e) => setContent(prev => ({ ...prev, text: e.target.value }))}
            placeholder={placeholder}
            className="resize-none pe-20 min-h-[80px]"
          />
          <div className="absolute bottom-3 end-3 flex gap-2">
            {showCodeToggle && !showCodeEditor && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddCode}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Code className="size-4" />
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              className="h-8 w-8 p-0"
              disabled={!content.text.trim() && !content.code?.code.trim()}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        {showCodeEditor && (
          <CodeEditor
            value={content.code?.code || ''}
            onChange={updateCode}
            language={codeLanguage}
            onLanguageChange={updateLanguage}
            onRemove={handleRemoveCode}
            rows={5}
          />
        )}
    </div>
  )
} 