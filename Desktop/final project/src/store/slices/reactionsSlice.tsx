import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

// Types
export interface ReactionType {
  id: string
  name: string
  icon: string
  color: string
}

export interface UserReaction {
  userId: string
  username: string
  reaction: string
  createdAt: string
}

export interface Reactions {
  like: number
  love: number
  wow: number
  funny: number
  dislike: number
}

export interface ReactionState {
  reactionTypes: ReactionType[]
  loading: boolean
  error: string | null
  postReactions: Record<string, { reactions: Reactions; userReactions: UserReaction[] }>
  commentReactions: Record<string, { reactions: Reactions; userReactions: UserReaction[] }>
}

// Async thunks
export const fetchReactionTypes = createAsyncThunk(
  'reactions/fetchReactionTypes',
  async () => {
    const response = await axios.get('http://localhost:3001/reactionTypes')
    return response.data
  }
)

export const addPostReaction = createAsyncThunk(
  'reactions/addPostReaction',
  async ({ postId, userId, username, reaction }: {
    postId: string
    userId: string
    username: string
    reaction: string
  }) => {
    try {
      console.log('🔄 Starting addPostReaction:', { postId, userId, username, reaction })
      
      // Get current post
      console.log('📡 Fetching post from API:', `http://localhost:3001/posts/${postId}`)
      const postResponse = await axios.get(`http://localhost:3001/posts/${postId}`)
      const post = postResponse.data
      console.log('📦 Current post data:', post)
      
      // Check if user already reacted - handle duplicates properly
      const existingReactions = post.userReactions?.filter(
        (ur: UserReaction) => ur.userId === userId
      ) || []
      const existingReaction = existingReactions.length > 0 ? existingReactions[0] : null
      console.log('🔍 Existing reactions for user:', existingReactions)
      console.log('🔍 First existing reaction:', existingReaction)

      // Remove any duplicate reactions for this user (safety check)
      const uniqueUserReactions = (post.userReactions || []).filter((reaction: UserReaction, index: number, self: UserReaction[]) => 
        index === self.findIndex((r: UserReaction) => r.userId === reaction.userId)
      )
      
      let updatedUserReactions = [...uniqueUserReactions]
      let updatedReactions = { ...post.reactions }
      console.log('📊 Initial reactions:', updatedReactions)
      console.log('👥 Initial user reactions (cleaned):', updatedUserReactions)

      // Check if user already has this reaction type
      const userHasThisReaction = existingReactions.some((ur: UserReaction) => ur.reaction === reaction)
      const userHasAnyReaction = existingReactions.length > 0

      if (userHasAnyReaction) {
        // Remove ALL existing reactions for this user (clean up duplicates)
        console.log('🔄 Removing all existing reactions for user:', existingReactions)
        existingReactions.forEach((existingReaction: UserReaction) => {
          const previousReaction = existingReaction.reaction
          updatedReactions[previousReaction as keyof Reactions] = Math.max(0, updatedReactions[previousReaction as keyof Reactions] - 1)
        })
        
        // Remove all user reactions for this user
        updatedUserReactions = updatedUserReactions.filter(ur => ur.userId !== userId)
        
        // If user clicked the same reaction type, don't add it back (toggle off)
        if (!userHasThisReaction) {
          // Add new reaction type
          console.log('🔄 Adding new reaction type:', reaction)
          updatedUserReactions.push({
            userId,
            username,
            reaction,
            createdAt: new Date().toISOString()
          })
          updatedReactions[reaction as keyof Reactions] = (updatedReactions[reaction as keyof Reactions] || 0) + 1
        } else {
          console.log('❌ Toggling off reaction:', reaction)
        }
      } else {
        // Add new reaction
        console.log('➕ Adding new reaction:', reaction)
        updatedUserReactions.push({
          userId,
          username,
          reaction,
          createdAt: new Date().toISOString()
        })
        updatedReactions[reaction as keyof Reactions] = (updatedReactions[reaction as keyof Reactions] || 0) + 1
      }

      console.log('📊 Updated reactions:', updatedReactions)
      console.log('👥 Updated user reactions:', updatedUserReactions)

      // Update post
      console.log('📡 Updating post in API:', `http://localhost:3001/posts/${postId}`)
      const updateResponse = await axios.put(`http://localhost:3001/posts/${postId}`, {
        ...post,
        reactions: updatedReactions,
        userReactions: updatedUserReactions
      })
      console.log('✅ API update response:', updateResponse.data)

      const result = {
        postId,
        reactions: updatedReactions,
        userReactions: updatedUserReactions
      }
      console.log('🎯 Returning result:', result)
      return result
    } catch (error) {
      console.error('❌ Error in addPostReaction:', error)
      throw error
    }
  }
)

export const addCommentReaction = createAsyncThunk(
  'reactions/addCommentReaction',
  async ({ commentId, userId, username, reaction }: {
    commentId: string
    userId: string
    username: string
    reaction: string
  }) => {
    // Get current comment
    const commentResponse = await axios.get(`http://localhost:3001/comments/${commentId}`)
    const comment = commentResponse.data
    
    // Check if user already reacted - handle duplicates properly
    const existingReactions = comment.userReactions?.filter(
      (ur: UserReaction) => ur.userId === userId
    ) || []
    
    // Remove any duplicate reactions for this user (safety check)
    const uniqueUserReactions = (comment.userReactions || []).filter((reaction: UserReaction, index: number, self: UserReaction[]) => 
      index === self.findIndex((r: UserReaction) => r.userId === reaction.userId)
    )

    let updatedUserReactions = [...uniqueUserReactions]
    let updatedReactions = { ...comment.reactions }

    // Check if user already has this reaction type
    const userHasThisReaction = existingReactions.some((ur: UserReaction) => ur.reaction === reaction)
    const userHasAnyReaction = existingReactions.length > 0

    if (userHasAnyReaction) {
      // Remove ALL existing reactions for this user (clean up duplicates)
      existingReactions.forEach((existingReaction: UserReaction) => {
        const previousReaction = existingReaction.reaction
        updatedReactions[previousReaction as keyof Reactions] = Math.max(0, updatedReactions[previousReaction as keyof Reactions] - 1)
      })
      
      // Remove all user reactions for this user
      updatedUserReactions = updatedUserReactions.filter(ur => ur.userId !== userId)
      
      // If user clicked the same reaction type, don't add it back (toggle off)
      if (!userHasThisReaction) {
        // Add new reaction type
        updatedUserReactions.push({
          userId,
          username,
          reaction,
          createdAt: new Date().toISOString()
        })
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

    // Update comment
    const updateResponse = await axios.put(`http://localhost:3001/comments/${commentId}`, {
      ...comment,
      reactions: updatedReactions,
      userReactions: updatedUserReactions
    })

    return {
      commentId,
      reactions: updatedReactions,
      userReactions: updatedUserReactions
    }
  }
)

// Initial state
const initialState: ReactionState = {
  reactionTypes: [],
  loading: false,
  error: null,
  postReactions: {},
  commentReactions: {}
}

// Slice
const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    // Update post reactions in local state
    updatePostReactions: (state, action: PayloadAction<{
      postId: string
      reactions: Reactions
      userReactions: UserReaction[]
    }>) => {
      const { postId, reactions, userReactions } = action.payload
      state.postReactions[postId] = { reactions, userReactions }
    },
    // Update comment reactions in local state
    updateCommentReactions: (state, action: PayloadAction<{
      commentId: string
      reactions: Reactions
      userReactions: UserReaction[]
    }>) => {
      const { commentId, reactions, userReactions } = action.payload
      state.commentReactions[commentId] = { reactions, userReactions }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reaction types
      .addCase(fetchReactionTypes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReactionTypes.fulfilled, (state, action) => {
        state.loading = false
        state.reactionTypes = action.payload
      })
      .addCase(fetchReactionTypes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch reaction types'
      })
      
      // Add post reaction
      .addCase(addPostReaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addPostReaction.fulfilled, (state, action) => {
        state.loading = false
        const { postId, reactions, userReactions } = action.payload
        state.postReactions[postId] = { reactions, userReactions }
      })
      .addCase(addPostReaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add post reaction'
      })
      
      // Add comment reaction
      .addCase(addCommentReaction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addCommentReaction.fulfilled, (state, action) => {
        state.loading = false
        const { commentId, reactions, userReactions } = action.payload
        state.commentReactions[commentId] = { reactions, userReactions }
        console.log('Comment reactions updated in reactions slice:', commentId, reactions)
      })
      .addCase(addCommentReaction.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to add comment reaction'
      })
  }
})

export const { clearError, updatePostReactions, updateCommentReactions } = reactionsSlice.actions
export default reactionsSlice.reducer 