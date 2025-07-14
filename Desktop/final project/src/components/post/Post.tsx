import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { EllipsisVerticalIcon, FlagIcon, MessageCircleMore, PencilIcon, SendIcon, ShieldCheck, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { useTranslations } from 'next-intl'
import ReactionMenu from '../ReactionsMenu'
import VideoPlayer from '../VideoPlayer'
import CodeBlock from '../code/CodeBlock'
import { PostType } from '@/types/post'
import Tags from '../Tags'
import UserAvatar from '../UserAvatar'
import CommentSection from '../comment/CommentSection'
import PostForm from './PostForm'
import { memo, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { deletePost } from '@/store/slices/postsSlice'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'

const Post = memo(function Post({ post }: { post: PostType }) {
  const { id, text, image, video, code, codeLang, tags, createdBy, createdAt, updatedAt, reactions, userReactions } = post;
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get comments count for this post
  const { comments } = useSelector((state: RootState) => state.comments)
  const commentsCount = useMemo(() => 
    comments.filter(comment => comment.postId === id).length, 
    [comments, id]
  )
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deletePost(id)).unwrap();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };
  
  // Show PostForm component when editing
  if (isEditing) {
    return (
      <PostForm
        mode="edit"
        post={post}
        onCancel={handleCancelEdit}
        onSuccess={handleSaveEdit}
      />
    );
  }
  
  return (
    <>
      <Card className='w-full  gap-4 shadow-none dark:border-transparent'>
          <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Link href="#">
                  <UserAvatar />
                </Link>
                <div>
                  <div className='align-middle'>
                    <Link href="#" className='text-xl font-medium me-1'>Shadcn</Link>
                    <HoverCard>
                      <HoverCardTrigger>
                        <ShieldCheck className='size-5 text-primary inline-flex mb-1' />
                      </HoverCardTrigger>
                      <HoverCardContent className='text-sm w-auto p-2 uppercase'>
                        { t('admin') }
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className='flex items-center font-light gap-2'>
                    <Link href="#" className='text-sm text-muted-foreground'>@shadcn</Link>
                    <div className='w-1 h-1 bg-primary rounded-full' />
                    <p className='text-sm text-primary'>1 hour ago</p>
                  </div>
                </div>
              </CardTitle>
              <CardAction>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className='cursor-pointer outline-none'>
                    <EllipsisVerticalIcon className='size-4 text-muted-foreground' />
                  </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem className='cursor-pointer' onClick={handleEdit}>
                        <PencilIcon className='size-4' />
                        { t('edit') }
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className='cursor-pointer' 
                        onClick={handleDelete}
                      >
                        <TrashIcon className='size-4' />
                        { t('delete') }
                      </DropdownMenuItem>
                      <DropdownMenuItem className='cursor-pointer'>
                        <FlagIcon className='size-4' />
                        { t('report') }
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            { text && <p>{ text }</p> }
            { image && <Image src="https://github.com/shadcn.png" alt="Shadcn" width={500} height={500} className='w-full max-h-96 rounded-lg object-cover' /> }
            { video && <VideoPlayer source={video} /> }
            { code && <CodeBlock
              code={ code }
              language={ codeLang }
            /> }
            { tags && <Tags tags={ tags } /> }
          </CardContent>
          <CardFooter className='flex flex-col items-start gap-3'>
            <div className='flex items-center gap-4'>
              <ReactionMenu 
                postId={id}
                reactions={{
                  like: 0,
                  love: 0,
                  wow: 0,
                  funny: 0,
                  dislike: 0,
                  happy: 0,
                  ...reactions
                }}
                userReactions={userReactions || []}
                currentUserId="user1"
                currentUsername="you"
              />
              <button 
                onClick={toggleComments}
                className='flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
              >
                <MessageCircleMore className='size-5' />
                {commentsCount > 0 && <span className="text-sm font-medium">{commentsCount}</span>}
              </button>
              <SendIcon className='size-5 text-muted-foreground' />
            </div>
            <div className={`w-full border-t border-border ${showComments ? 'block' : 'hidden'}`}>
              <CommentSection postId={id} />
            </div>
          </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post and all its comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

export default Post 