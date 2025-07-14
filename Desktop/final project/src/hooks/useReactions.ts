import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { 
  addPostReaction, 
  addCommentReaction, 
  fetchReactionTypes,
  updatePostReactions,
  updateCommentReactions
} from '../store/slices/reactionsSlice'
import { 
  updateCommentReactionsAsync,
  updateReplyReactionsAsync,
  updateCommentReactions as updateCommentReactionsLocal,
  updateReplyReactions as updateReplyReactionsLocal
} from '../store/slices/commentsSlice'
import { editPost } from '../store/slices/postsSlice'
import { useCallback, useEffect, useRef } from 'react'
import { Reactions, UserReaction } from '@/types/comments'

export const useReactions = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reactionTypes, loading, error, postReactions, commentReactions } = useSelector((state: RootState) => state.reactions)
  const { comments } = useSelector((state: RootState) => state.comments)
  const { posts } = useSelector((state: RootState) => state.posts)
  const pendingReactionsRef = useRef<Set<string>>(new Set())

  // Fetch reaction types on mount
  useEffect(() => {
    if (reactionTypes.length === 0) {
      dispatch(fetchReactionTypes())
    }
  }, [dispatch, reactionTypes.length])

  // Add/remove post reaction
  const handlePostReaction = useCallback(async (
    postId: string,
    userId: string,
    username: string,
    reaction: string
  ) => {
    // Create a unique key for this reaction attempt
    const reactionKey = `${postId}-${userId}-${reaction}`
    
    // Check if this reaction is already pending
    if (pendingReactionsRef.current.has(reactionKey)) {
      console.log('🚫 Reaction already pending:', reactionKey)
      return { success: false, error: 'Reaction already pending' }
    }
    
    // Add to pending set
    pendingReactionsRef.current.add(reactionKey)
    
    try {
      console.log('🚀 handlePostReaction called:', { postId, userId, username, reaction })
      
      const result = await dispatch(addPostReaction({
        postId,
        userId,
        username,
        reaction
      })).unwrap()
      
      console.log('✅ addPostReaction result:', result)
      
      // Update reactions slice state immediately for better UX
      if (result) {
        console.log('🔄 Updating reactions slice with:', result)
        dispatch(updatePostReactions({
          postId,
          reactions: result.reactions,
          userReactions: result.userReactions
        }))
        
        // Also update the posts slice state to keep them in sync
        console.log('🔄 Updating posts slice with:', { id: postId, data: { reactions: result.reactions, userReactions: result.userReactions } })
        dispatch(editPost({
          id: postId,
          data: {
            reactions: result.reactions,
            userReactions: result.userReactions
          }
        }))
      }
      
      console.log('🎉 handlePostReaction completed successfully')
      return { success: true, data: result }
    } catch (error) {
      console.error('❌ Failed to add post reaction:', error)
      return { success: false, error }
    } finally {
      // Remove from pending set
      pendingReactionsRef.current.delete(reactionKey)
    }
  }, [dispatch])

  // Add/remove comment reaction
  const handleCommentReaction = useCallback(async (
    commentId: string,
    userId: string,
    username: string,
    reaction: string
  ) => {
    // Create a unique key for this reaction attempt
    const reactionKey = `comment-${commentId}-${userId}-${reaction}`
    
    // Check if this reaction is already pending
    if (pendingReactionsRef.current.has(reactionKey)) {
      console.log('🚫 Comment reaction already pending:', reactionKey)
      return { success: false, error: 'Reaction already pending' }
    }
    
    // Add to pending set
    pendingReactionsRef.current.add(reactionKey)
    
    try {
      const result = await dispatch(addCommentReaction({
        commentId,
        userId,
        username,
        reaction
      })).unwrap()
      
      // Update reactions slice state immediately for better UX
      if (result) {
        dispatch(updateCommentReactions({
          commentId,
          reactions: result.reactions,
          userReactions: result.userReactions
        }))
        
        // Also update the comments slice state to keep them in sync
        dispatch(updateCommentReactionsLocal({
          commentId: result.commentId,
          reactions: result.reactions,
          userReactions: result.userReactions
        }))
      }
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Failed to add comment reaction:', error)
      return { success: false, error }
    } finally {
      // Remove from pending set
      pendingReactionsRef.current.delete(reactionKey)
    }
  }, [dispatch])

  // Add/remove reply reaction
  const handleReplyReaction = useCallback(async (
    parentCommentId: number | string,
    replyId: number | string,
    userId: string,
    username: string,
    reaction: string
  ) => {
    try {
      // Find the current reply to get its reactions
      const parentComment = comments.find(c => c.id === parentCommentId)
      const reply = parentComment?.replies.find(r => r.id === replyId)
      
      if (!reply) {
        throw new Error('Reply not found')
      }

      const currentReactions = reply.reactions || { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 }
      const currentUserReactions = reply.userReactions || []
      
      // Check if user already reacted
      const existingReactionIndex = currentUserReactions.findIndex(
        ur => ur.userId === userId
      )

      let updatedUserReactions = [...currentUserReactions]
      let updatedReactions = { ...currentReactions }

      if (existingReactionIndex >= 0) {
        // Remove previous reaction
        const previousReaction = updatedUserReactions[existingReactionIndex].reaction
        updatedReactions[previousReaction as keyof Reactions] = Math.max(0, updatedReactions[previousReaction as keyof Reactions] - 1)
        
        // Update or remove reaction
        if (updatedUserReactions[existingReactionIndex].reaction === reaction) {
          // Remove reaction if same type
          updatedUserReactions.splice(existingReactionIndex, 1)
        } else {
          // Change reaction type
          updatedUserReactions[existingReactionIndex] = {
            userId,
            username,
            reaction,
            createdAt: new Date().toISOString()
          }
          updatedReactions[reaction as keyof Reactions] = (updatedReactions[reaction as keyof Reactions] || 0) + 1
        }
      } else {
        // Add new reaction
        updatedUserReactions.push({
          userId,
          username,
          reaction,
          createdAt: new Date().toISOString()
        })
        updatedReactions[reaction as keyof Reactions] = (updatedReactions[reaction as keyof Reactions] || 0) + 1
      }

      // Update in Redux store
      await dispatch(updateReplyReactionsAsync({
        parentCommentId,
        replyId,
        reactions: updatedReactions,
        userReactions: updatedUserReactions
      }))

      // Update local state immediately for better UX
      dispatch(updateReplyReactionsLocal({
        parentCommentId,
        replyId,
        reactions: updatedReactions,
        userReactions: updatedUserReactions
      }))

      return { 
        success: true, 
        data: { 
          replyId, 
          reactions: updatedReactions, 
          userReactions: updatedUserReactions 
        } 
      }
    } catch (error) {
      console.error('Failed to add reply reaction:', error)
      return { success: false, error }
    }
  }, [dispatch, comments])

  // Get current user's reaction
  const getCurrentUserReaction = useCallback((
    userReactions: Array<{ userId: string; reaction: string }>,
    currentUserId: string
  ) => {
    return userReactions.find(ur => ur.userId === currentUserId)?.reaction || null
  }, [])

  // Check if user has reacted
  const hasUserReacted = useCallback((
    userReactions: Array<{ userId: string; reaction: string }>,
    currentUserId: string,
    reactionType?: string
  ) => {
    const userReaction = userReactions.find(ur => ur.userId === currentUserId)
    if (!reactionType) return !!userReaction
    return userReaction?.reaction === reactionType
  }, [])

  // Get reactions for a post from Redux state
  const getPostReactions = useCallback((postId: string) => {
    return postReactions[postId] || { reactions: { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 }, userReactions: [] }
  }, [postReactions])

  // Get reactions for a comment from Redux state
  const getCommentReactions = useCallback((commentId: string) => {
    return commentReactions[commentId] || { reactions: { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 }, userReactions: [] }
  }, [commentReactions])

  return {
    reactionTypes,
    loading,
    error,
    handlePostReaction,
    handleCommentReaction,
    handleReplyReaction,
    getCurrentUserReaction,
    hasUserReacted,
    getPostReactions,
    getCommentReactions
  }
} 