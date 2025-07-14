import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Comment, Reply, CommentContent, Reactions, UserReaction } from '@/types/comments'

const API_URL = 'http://localhost:3001/comments'

interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
}

// ✅ Fetch all comments
export const fetchComments = createAsyncThunk<Comment[]>(
  'comments/fetchComments',
  async () => {
    try {
      const response = await axios.get<Comment[]>(API_URL)
      console.log('Fetched comments:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }
)

// ✅ Add new comment
export const addCommentAsync = createAsyncThunk<Comment, Omit<Comment, 'id'>>(
    'comments/addCommentAsync',
    async (newComment) => {
    try {
      // Ensure the comment has the proper structure
      const commentToAdd = {
        ...newComment,
        content: newComment.content || { text: '' },
        replies: newComment.replies || [],
        createdAt: newComment.createdAt || new Date(),
        reactions: newComment.reactions || { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 },
        userReactions: newComment.userReactions || []
      }
      
      console.log('Adding comment:', commentToAdd)
      const response = await axios.post<Comment>(API_URL, commentToAdd)
      console.log('Comment added successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }
)

// ✅ Add reply to comment
export const addReplyAsync = createAsyncThunk<Comment, Reply>(
  'comments/addReplyAsync',
  async (newReply, { getState }) => {
    try {
      const state = getState() as { comments: CommentsState }
      const parent = state.comments.comments.find(c => c.id === newReply.parentCommentId)
      if (!parent) throw new Error('Parent comment not found')

      // Ensure the reply has the proper structure
      const replyToAdd = {
        ...newReply,
        content: newReply.content || { text: '' },
        createdAt: newReply.createdAt || new Date(),
        reactions: newReply.reactions || { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 },
        userReactions: newReply.userReactions || [],
        replies: newReply.replies || []
      }

      const updatedReplies = [replyToAdd, ...parent.replies]
      const updatedComment = { ...parent, replies: updatedReplies }

      console.log('Adding reply to comment:', parent.id, replyToAdd)
      const response = await axios.put<Comment>(`${API_URL}/${parent.id}`, updatedComment)
      console.log('Reply added successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error adding reply:', error)
      throw error
    }
  }
)

// ✅ Edit comment or reply
export const editCommentOrReplyAsync = createAsyncThunk<Comment, { id: number | string; content: CommentContent }>(
  'comments/editCommentOrReplyAsync',
  async ({ id, content }, { getState }) => {
    try {
      const state = getState() as { comments: CommentsState }
      const allComments = state.comments.comments

      // Check if it's a top-level comment
      const isComment = allComments.find(c => c.id === id)

      if (isComment) {
        // Edit top-level comment
        console.log('Editing comment:', id, content)
        const commentToEdit = allComments.find(c => c.id === id)
        if (!commentToEdit) throw new Error('Comment not found')
        
        const updatedComment = { ...commentToEdit, content }
        const response = await axios.put<Comment>(`${API_URL}/${id}`, updatedComment)
        console.log('Comment edited successfully:', response.data)
        return response.data
      }

      // If it's a reply, find the parent comment
      const parentComment = allComments.find(c => 
        c.replies && c.replies.some(r => r.id === id)
      )
      
      if (!parentComment) {
        throw new Error('Comment or reply not found')
      }

      // Update the reply within the parent comment
      const updatedReplies = parentComment.replies.map(r =>
        r.id === id ? { ...r, content } : r
      )

      const updatedComment = { ...parentComment, replies: updatedReplies }
      console.log('Editing reply in comment:', parentComment.id, id, content)
      const response = await axios.put<Comment>(`${API_URL}/${parentComment.id}`, updatedComment)
      console.log('Reply edited successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error editing comment/reply:', error)
      throw error
    }
  }
)

// ✅ Delete comment or reply
export const deleteCommentOrReplyAsync = createAsyncThunk<
  number | string,
  number | string,
  { state: { comments: CommentsState } }
>('comments/deleteCommentOrReplyAsync', async (idToDelete, { getState }) => {
  try {
    const state = getState()
    const allComments = state.comments.comments

    const isTopLevel = allComments.some((c) => c.id === idToDelete)

    if (isTopLevel) {
      // Delete top-level comment
      console.log('Deleting comment:', idToDelete)
      await axios.delete(`${API_URL}/${idToDelete}`)
      console.log('Comment deleted successfully')
      return idToDelete
    } else {
      // Delete a reply
      const parentComment = allComments.find((c) =>
        c.replies?.some((r) => r.id === idToDelete)
      )
      if (!parentComment) throw new Error('Parent comment not found')

      const updatedReplies = parentComment.replies.filter((r) => r.id !== idToDelete)
      const updatedComment = { ...parentComment, replies: updatedReplies }

      console.log('Deleting reply from comment:', parentComment.id, idToDelete)
      await axios.put(`${API_URL}/${parentComment.id}`, updatedComment)
      console.log('Reply deleted successfully')
      return idToDelete
    }
  } catch (error) {
    console.error('Error deleting comment/reply:', error)
    throw error
  }
})

// ✅ Update comment reactions
export const updateCommentReactionsAsync = createAsyncThunk<
  { commentId: number | string; reactions: Reactions; userReactions: UserReaction[] },
  { commentId: number | string; reactions: Reactions; userReactions: UserReaction[] }
>('comments/updateCommentReactionsAsync', async ({ commentId, reactions, userReactions }) => {
  try {
    console.log('Updating comment reactions:', commentId, reactions)
    
    // Get the current comment first
    const commentResponse = await axios.get<Comment>(`${API_URL}/${commentId}`)
    const currentComment = commentResponse.data
    
    // Update with full comment data
    const updatedComment = { ...currentComment, reactions, userReactions }
    const response = await axios.put<Comment>(`${API_URL}/${commentId}`, updatedComment)
    console.log('Comment reactions updated successfully:', response.data)
    return { commentId, reactions, userReactions }
  } catch (error) {
    console.error('Error updating comment reactions:', error)
    throw error
  }
})

// ✅ Update reply reactions
export const updateReplyReactionsAsync = createAsyncThunk<
  { parentCommentId: number | string; replyId: number | string; reactions: Reactions; userReactions: UserReaction[] },
  { parentCommentId: number | string; replyId: number | string; reactions: Reactions; userReactions: UserReaction[] }
>('comments/updateReplyReactionsAsync', async ({ parentCommentId, replyId, reactions, userReactions }) => {
  try {
    // Get the parent comment
    const parentResponse = await axios.get<Comment>(`${API_URL}/${parentCommentId}`)
    const parentComment = parentResponse.data

    // Update the specific reply
    const updatedReplies = parentComment.replies.map(reply =>
      reply.id === replyId
        ? { ...reply, reactions, userReactions }
        : reply
    )

    const updatedComment = { ...parentComment, replies: updatedReplies }

    console.log('Updating reply reactions:', parentCommentId, replyId, reactions)
    const response = await axios.put<Comment>(`${API_URL}/${parentCommentId}`, updatedComment)
    console.log('Reply reactions updated successfully:', response.data)
    
    return { parentCommentId, replyId, reactions, userReactions }
  } catch (error) {
    console.error('Error updating reply reactions:', error)
    throw error
  }
})

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Update comment reactions in local state
    updateCommentReactions: (state, action: PayloadAction<{
      commentId: number | string
      reactions: Reactions
      userReactions: UserReaction[]
    }>) => {
      const { commentId, reactions, userReactions } = action.payload
      const comment = state.comments.find(c => c.id === commentId)
      if (comment) {
        comment.reactions = reactions
        comment.userReactions = userReactions
        console.log('Comment reactions updated in local state:', commentId, reactions)
      } else {
        console.warn('Comment not found for reaction update:', commentId)
      }
    },
    // Update reply reactions in local state
    updateReplyReactions: (state, action: PayloadAction<{
      parentCommentId: number | string
      replyId: number | string
      reactions: Reactions
      userReactions: UserReaction[]
    }>) => {
      const { parentCommentId, replyId, reactions, userReactions } = action.payload
      const parentComment = state.comments.find(c => c.id === parentCommentId)
      if (parentComment) {
        const reply = parentComment.replies.find(r => r.id === replyId)
        if (reply) {
          reply.reactions = reactions
          reply.userReactions = userReactions
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload
        console.log('Comments loaded into state:', action.payload.length, 'comments')
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch comments'
        console.error('Failed to fetch comments:', action.error)
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.comments.unshift(action.payload)
        console.log('Comment added to state:', action.payload)
      })
      .addCase(addReplyAsync.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.comments.findIndex(c => c.id === updated.id)
        if (index !== -1) {
          state.comments[index] = updated
          console.log('Reply added to state in comment:', updated.id)
        }
      })
      .addCase(editCommentOrReplyAsync.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.comments.findIndex(c => c.id === updated.id)
        if (index !== -1) {
          state.comments[index] = updated
          console.log('Comment/reply edited in state:', updated.id)
        }
      })
      .addCase(deleteCommentOrReplyAsync.fulfilled, (state, action) => {
        const idToDelete = action.payload
        state.comments = state.comments.filter((c) => c.id !== idToDelete)
        for (const comment of state.comments) {
          if (comment.replies) {
            comment.replies = comment.replies.filter((r) => r.id !== idToDelete)
          }
        }
        console.log('Comment/reply deleted from state:', idToDelete)
      })
      .addCase(updateCommentReactionsAsync.fulfilled, (state, action) => {
        const { commentId, reactions, userReactions } = action.payload
        const comment = state.comments.find(c => c.id === commentId)
        if (comment) {
          comment.reactions = reactions
          comment.userReactions = userReactions
          console.log('Comment reactions updated in state:', commentId)
        }
      })
      .addCase(updateReplyReactionsAsync.fulfilled, (state, action) => {
        const { parentCommentId, replyId, reactions, userReactions } = action.payload
        const parentComment = state.comments.find(c => c.id === parentCommentId)
        if (parentComment) {
          const reply = parentComment.replies.find(r => r.id === replyId)
          if (reply) {
            reply.reactions = reactions
            reply.userReactions = userReactions
            console.log('Reply reactions updated in state:', parentCommentId, replyId)
          }
        }
      })
  }
})

export const { updateCommentReactions, updateReplyReactions } = commentsSlice.actions
export default commentsSlice.reducer
