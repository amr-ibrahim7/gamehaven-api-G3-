'use client'

import { useState } from 'react'
import CommentEditor from './CommentEditor'
import { Button } from '../ui/button'
import { X } from 'lucide-react'

interface ReplyFormProps {
  initialValue: string
  onSubmit: (text: string) => void
  onCancel?: () => void
  placeholder?: string
  className?: string
}

export default function ReplyForm({ 
  initialValue, 
  onSubmit, 
  onCancel,
  placeholder = "Write a reply...",
  className = ''
}: ReplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [commentContent, setCommentContent] = useState<{ text: string; code?: { code: string; language: string } }>({ text: initialValue })

  const handleSubmit = async (content: { text: string; code?: { code: string; language: string } }) => {
    if (!content.text.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit(content.text)
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className={`mt-3 space-y-3 ${className}`}>
      <CommentEditor
        initialValue={{ text: initialValue }}
        onSubmit={handleSubmit}
        placeholder={placeholder}
        showCodeToggle={false}
      />
    </div>
  )
} 