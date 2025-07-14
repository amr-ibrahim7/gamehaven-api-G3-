'use client'

import {
  ReplyIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  FlagIcon,
  CheckIcon,
  XIcon,
  ChevronDown,
} from 'lucide-react'
import ReplyForm from './ReplyForm'
import CommentEditor from './CommentEditor'
import UserAvatar from '../UserAvatar'
import ReactionMenu from '../ReactionsMenu'
import CodeBlock from '../code/CodeBlock'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import {
  addReplyAsync,
  deleteCommentOrReplyAsync,
  editCommentOrReplyAsync,
} from '@/store/slices/commentsSlice'
import { useState, useMemo } from 'react'
import { Comment, Reply, CommentContent } from '@/types/comments'

export default function CommentItem({
  comment,
  activeReplyId,
  setActiveReplyId,
  mentionUser,
  setMentionUser,
  rootId = null,
}: {
  comment: Comment | Reply
  activeReplyId: number | string | null
  setActiveReplyId: (id: number | string | null) => void
  mentionUser: string
  setMentionUser: (user: string) => void
  rootId?: number | string | null
}) {
  const t = useTranslations()
  const dispatch = useDispatch<AppDispatch>()
  const [openDelete, setOpenDelete] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState<CommentContent>(comment.content)
  const [showReplies, setShowReplies] = useState(false)
  const [visibleReplies, setVisibleReplies] = useState(2) // Show 2 replies initially

  const isReply = !!comment.parentCommentId
  const rootCommentId = rootId || comment.id

  // Get visible replies based on pagination
  const visibleRepliesList = useMemo(() => {
    if (!comment.replies || comment.replies.length === 0) return []
    return comment.replies.slice(0, visibleReplies)
  }, [comment.replies, visibleReplies])

  // Check if there are more replies to load
  const hasMoreReplies = comment.replies && comment.replies.length > visibleReplies

  const handleReplyClick = () => {
    setMentionUser(comment.user.username)
    setActiveReplyId(rootCommentId)
  }

  const shouldShowReplyForm = activeReplyId === comment.id && !isReply

  const handleReplySubmit = async (text: string) => {
    const newReply: Reply = {
      postId: comment.postId,
      parentCommentId: rootCommentId,
      user: { name: 'You', username: 'you' },
      content: { text },
      createdAt: new Date(),
      replies: [],
      id: Date.now(),
      reactions: { like: 0, love: 0, wow: 0, funny: 0, dislike: 0, happy: 0 },
      userReactions: []
    }

    await dispatch(addReplyAsync(newReply))
    setActiveReplyId(null)
    setMentionUser('')
  }

  const handleEditSubmit = async (content: CommentContent) => {
    if (content.text !== comment.content.text || content.code !== comment.content.code) {
      try {
        console.log('Editing comment:', comment.id, 'with content:', content)
        await dispatch(editCommentOrReplyAsync({ id: comment.id, content }))
        console.log('Edit successful')
      } catch (error) {
        console.error('Edit failed:', error)
      }
    }
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setEditValue(comment.content)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    await dispatch(deleteCommentOrReplyAsync(comment.id))
    setOpenDelete(false)
  }

  const handleViewReplies = () => {
    setShowReplies(true)
  }

  const handleLoadMoreReplies = () => {
    setVisibleReplies(prev => prev + 2) // Load 2 more replies
  }

  return (
    <div className="flex gap-3 items-start">
      <UserAvatar />

      <div className="flex-1 overflow-hidden">
        <div className="bg-accent p-3 rounded-xl relative">
          {!isEditing && (
            <div className="absolute top-2 end-2">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="cursor-pointer outline-none">
                  <EllipsisVerticalIcon className="size-4 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <PencilIcon className="size-4" />
                    {t('edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                    <TrashIcon className="size-4" />
                    {t('delete')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FlagIcon className="size-4" />
                    {t('report')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <p className="font-semibold text-sm">{comment.user.name}</p>
          
          {isEditing ? (
            <div className="mt-2">
              <CommentEditor
                initialValue={editValue}
                onSubmit={handleEditSubmit}
                placeholder="Edit your comment..."
              />
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={handleEditCancel}>
                  <XIcon className="size-4" />
                  {t('cancel')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1 space-y-2">
              {comment.content.text && (
                <p className="text-sm">{comment.content.text}</p>
              )}
              {comment.content.code && (
                <CodeBlock 
                  code={comment.content.code.code} 
                  language={comment.content.code.language} 
                />
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-3 text-xs text-muted-foreground mt-2 items-center">
            <ReactionMenu 
              size="sm"
              commentId={isReply ? undefined : comment.id.toString()}
              parentCommentId={isReply ? rootCommentId : undefined}
              replyId={isReply ? comment.id : undefined}
              reactions={{
                like: 0,
                love: 0,
                wow: 0,
                funny: 0,
                dislike: 0,
                happy: 0,
                ...comment.reactions
              }}
              userReactions={comment.userReactions}
              currentUserId="user1"
              currentUsername="you"
            />
            <button onClick={handleReplyClick} className="cursor-pointer">
              <ReplyIcon className="size-4" />
            </button>
            <span>1h ago</span>
          </div>
        )}

        {!isReply && shouldShowReplyForm && (
          <ReplyForm
            key={mentionUser}
            initialValue={`@${mentionUser} `}
            onSubmit={handleReplySubmit}
          />
        )}

        {/* View Replies Button (Facebook-style) */}
        {!isReply && comment.replies && comment.replies.length > 0 && !showReplies && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewReplies}
              className="text-muted-foreground hover:text-foreground text-xs px-2 py-1 h-auto"
            >
              View {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </Button>
          </div>
        )}

        {/* Replies Section */}
        {!isReply && showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-2 ms-5">
            {visibleRepliesList.map((reply, index) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                activeReplyId={activeReplyId}
                setActiveReplyId={setActiveReplyId}
                mentionUser={mentionUser}
                setMentionUser={setMentionUser}
                rootId={rootCommentId}
              />
            ))}
            
            {/* Load More Replies Button */}
            {hasMoreReplies && (
              <div className="flex justify-start pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadMoreReplies}
                  className="text-muted-foreground hover:text-foreground text-xs px-2 py-1 h-auto"
                >
                  <ChevronDown className="size-3 mr-1" />
                  Load More Replies ({comment.replies!.length - visibleReplies} more)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Delete Dialog */}
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
