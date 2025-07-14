'use client'

import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { createPost, updatePost } from '@/store/slices/postsSlice'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Code, 
  Image as ImageIcon, 
  Video, 
  X, 
  Send, 
  Hash,
  Plus,
  ArrowLeft,
  Save
} from 'lucide-react'
import CodeEditor from '../code/CodeEditor'
import UserAvatar from '../UserAvatar'
import { PostType } from '@/types/post'

interface PostFormProps {
  mode: 'create' | 'edit'
  post?: PostType // Only required for edit mode
  onCancel: () => void
  onSuccess: () => void
  className?: string
}

type PostContent = {
  text: string
  code?: {
    code: string
    language: string
  }
  image?: File | string
  video?: File | string
  tags: string[]
}

export default function PostForm({ mode, post, onCancel, onSuccess, className = '' }: PostFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  
  const [content, setContent] = useState<PostContent>({
    text: post?.text || '',
    code: post?.code ? { code: post.code, language: post.codeLang || 'javascript' } : undefined,
    image: post?.image,
    video: post?.video,
    tags: post?.tags || []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(!!post?.code)
  const [showImageUpload, setShowImageUpload] = useState(!!post?.image)
  const [showVideoUpload, setShowVideoUpload] = useState(!!post?.video)
  const [tagInput, setTagInput] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Reset form when post changes (for edit mode)
  useEffect(() => {
    if (post) {
      setContent({
        text: post.text || '',
        code: post.code ? { code: post.code, language: post.codeLang || 'javascript' } : undefined,
        image: post.image,
        video: post.video,
        tags: post.tags || []
      })
      setShowCodeEditor(!!post.code)
      setShowImageUpload(!!post.image)
      setShowVideoUpload(!!post.video)
    }
  }, [post])

  const handleTextChange = (text: string) => {
    setContent(prev => ({ ...prev, text }))
  }

  const handleAddCode = () => {
    setShowCodeEditor(true)
    setShowImageUpload(false)
    setShowVideoUpload(false)
    setContent(prev => ({
      ...prev,
      code: { code: '', language: 'javascript' }
    }))
  }

  const handleRemoveCode = () => {
    setShowCodeEditor(false)
    setContent(prev => ({ ...prev, code: undefined }))
  }

  const handleCodeChange = (code: string) => {
    setContent(prev => ({
      ...prev,
      code: { code, language: prev.code?.language || 'javascript' }
    }))
  }

  const handleLanguageChange = (language: string) => {
    setContent(prev => ({
      ...prev,
      code: prev.code ? { ...prev.code, language } : { code: '', language }
    }))
  }

  const handleAddImage = () => {
    setShowImageUpload(true)
    setShowCodeEditor(false)
    setShowVideoUpload(false)
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setShowImageUpload(false)
    setContent(prev => ({ ...prev, image: undefined }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setContent(prev => ({ ...prev, image: file }))
      setShowImageUpload(true)
    }
  }

  const handleAddVideo = () => {
    setShowVideoUpload(true)
    setShowCodeEditor(false)
    setShowImageUpload(false)
    videoInputRef.current?.click()
  }

  const handleRemoveVideo = () => {
    setShowVideoUpload(false)
    setContent(prev => ({ ...prev, video: undefined }))
  }

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setContent(prev => ({ ...prev, video: file }))
      setShowVideoUpload(true)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !content.tags.includes(tagInput.trim())) {
      setContent(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setContent(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async () => {
    if (!content.text.trim() && !content.code?.code.trim() && !content.image && !content.video) {
      return
    }

    setIsSubmitting(true)
    try {
      // Convert files to base64 for demo (in real app, upload to server)
      let imageUrl = undefined
      let videoUrl = undefined

      if (content.image instanceof File) {
        imageUrl = await fileToBase64(content.image)
      } else if (typeof content.image === 'string') {
        imageUrl = content.image
      }

      if (content.video instanceof File) {
        videoUrl = await fileToBase64(content.video)
      } else if (typeof content.video === 'string') {
        videoUrl = content.video
      }

      if (mode === 'create') {
        const newPost: Omit<PostType, 'id'> = {
          text: content.text.trim(),
          code: content.code?.code.trim(),
          codeLang: content.code?.language,
          image: imageUrl,
          video: videoUrl,
          tags: content.tags,
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reactions: { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 },
          userReactions: []
        }

        await dispatch(createPost(newPost))
        
        // Reset form for create mode
        setContent({
          text: '',
          tags: []
        })
        setShowCodeEditor(false)
        setShowImageUpload(false)
        setShowVideoUpload(false)
        setTagInput('')
      } else {
        // Edit mode
        if (!post) return

        const updatedPost: PostType = {
          ...post,
          text: content.text.trim(),
          code: content.code?.code.trim(),
          codeLang: content.code?.language,
          image: imageUrl,
          video: videoUrl,
          tags: content.tags,
          updatedAt: new Date().toISOString()
        }

        await dispatch(updatePost({ id: post.id, data: updatedPost }))
      }
      
      onSuccess()
    } catch (error) {
      console.error(`Failed to ${mode} post:`, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const hasContent = content.text.trim() || content.code?.code.trim() || content.image || content.video

  const isEditMode = mode === 'edit'
  const submitButtonText = isSubmitting 
    ? (isEditMode ? 'Saving...' : 'Creating...') 
    : (isEditMode ? 'Save Changes' : 'Create Post')
  const SubmitButtonIcon = isEditMode ? Save : Send

  return (
    <Card className={`w-full dark:border-none shadow-none gap-4 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <UserAvatar />
          <div className="flex-1">
            <h3 className="font-semibold">{isEditMode ? 'Edit Post' : 'Create Post'}</h3>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Update your post content' : 'Share your thoughts, code, or media'}
            </p>
          </div>
          {isEditMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="size-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Text Input */}
        <div className="relative">
          <Textarea
            value={content.text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="What's on your mind?"
            className="resize-none min-h-[100px]"
          />
        </div>

        {/* Content Type Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCode}
            className={`flex items-center gap-2 ${showCodeEditor ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Code className="size-4" />
            Code
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddImage}
            className={`flex items-center gap-2 ${showImageUpload ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <ImageIcon className="size-4" />
            Image
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddVideo}
            className={`flex items-center gap-2 ${showVideoUpload ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <Video className="size-4" />
            Video
          </Button>
        </div>

        {/* Code Editor */}
        {showCodeEditor && (
          <div className="border rounded-lg p-4 bg-accent">
            <CodeEditor
              value={content.code?.code || ''}
              onChange={handleCodeChange}
              language={content.code?.language || 'javascript'}
              onLanguageChange={handleLanguageChange}
              onRemove={handleRemoveCode}
              rows={6}
            />
          </div>
        )}

        {/* Image Upload */}
        {showImageUpload && (
          <div className="border rounded-lg p-4 bg-accent">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <ImageIcon className="size-4" />
                Image
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </div>
            {content.image ? (
              <div className="space-y-3">
                <img
                  src={content.image instanceof File ? URL.createObjectURL(content.image) : content.image}
                  alt="Preview"
                  className="max-w-full max-h-64 rounded-lg object-cover"
                />
                {content.image instanceof File && (
                  <p className="text-sm text-muted-foreground">
                    {content.image.name} ({(content.image.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <ImageIcon className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to select an image</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  Select Image
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}

        {/* Video Upload */}
        {showVideoUpload && (
          <div className="border rounded-lg p-4 bg-accent">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Video className="size-4" />
                Video
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveVideo}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              >
                <X className="size-4" />
              </Button>
            </div>
            {content.video ? (
              <div className="space-y-3">
                <video
                  src={content.video instanceof File ? URL.createObjectURL(content.video) : content.video}
                  controls
                  className="max-w-full max-h-64 rounded-lg"
                />
                {content.video instanceof File && (
                  <p className="text-sm text-muted-foreground">
                    {content.video.name} ({(content.video.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Video className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to select a video</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => videoInputRef.current?.click()}
                  className="mt-2"
                >
                  Select Video
                </Button>
              </div>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
          </div>
        )}

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tags</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {content.tags.map((tag) => (
              <Badge
                key={tag}
                className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleRemoveTag(tag)}
              >
                #{tag}
                <X className="size-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!hasContent || isSubmitting}
            className="flex items-center gap-2"
          >
            <SubmitButtonIcon className="size-4" />
            {submitButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 