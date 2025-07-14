import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { PostType } from '@/types/post'
import { addPostReaction } from './reactionsSlice'

const API_URL = 'http://localhost:3001/posts'

type PostsState = {
  posts: PostType[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
  limit: number
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  limit: 10
}

export const fetchPosts = createAsyncThunk<PostType[], { page?: number; limit?: number; refresh?: boolean }>(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10, refresh = false }) => {
    console.log('Fetching posts:', { page, limit, refresh })
    
    // Get all posts and sort them properly, then paginate manually
    const url = `${API_URL}?_sort=createdAt&_order=desc`
    console.log('API URL:', url)
    
    const response = await axios.get(url)
    console.log('API response:', response.data)
    
    // Extract posts from the data property
    const allPosts = response.data.data || response.data
    console.log('All posts from API:', allPosts.map((p: PostType) => ({ id: p.id, createdAt: p.createdAt })))
    
    // Sort all posts by createdAt DESC to ensure proper order
    const sortedAllPosts = allPosts.sort((a: PostType, b: PostType) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    
    // Manual pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPosts = sortedAllPosts.slice(startIndex, endIndex)
    
    console.log(`Page ${page}: posts ${startIndex}-${endIndex}:`, paginatedPosts.map((p: PostType) => ({ id: p.id, createdAt: p.createdAt })))
    return paginatedPosts
  }
)

export const createPost = createAsyncThunk<PostType, Omit<PostType, 'id'>>(
  'posts/createPost',
  async (postData) => {
    const response = await axios.post<PostType>(API_URL, postData)
    return response.data
  }
)

export const updatePost = createAsyncThunk<PostType, { id: string; data: Partial<PostType> }>(
  'posts/updatePost',
  async ({ id, data }) => {
    const response = await axios.put<PostType>(`${API_URL}/${id}`, data)
    return response.data
  }
)

export const deletePost = createAsyncThunk<string, string>(
  'posts/deletePost',
  async (id) => {
    await axios.delete(`${API_URL}/${id}`)
    return id
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<PostType>) => {
      // Add new post at the beginning since it's the newest
      state.posts.unshift(action.payload)
    },
    editPost: (state, action: PayloadAction<{ id: string; data: Partial<PostType> }>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload.data }
      }
    },
    resetPosts: (state) => {
      state.posts = []
      state.page = 1
      state.hasMore = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state, action) => {
        if (action.meta.arg.refresh) {
          state.loading = true
          state.error = null
        } else {
          // Don't show loading for pagination
          state.error = null
        }
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { refresh = false, page: requestedPage = 1 } = action.meta.arg
        const newPosts = action.payload
        
        console.log('fetchPosts.fulfilled:', { refresh, requestedPage, newPostsLength: newPosts.length })
        
        if (refresh) {
          // Refresh mode - replace all posts and ensure proper sorting
          state.posts = newPosts
          state.page = 1
          state.loading = false
          
          // Always sort posts by newest first for refresh
          state.posts.sort((a: PostType, b: PostType) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
          console.log('Refresh mode - posts updated:', state.posts.length)
        } else {
          // Pagination mode - append posts at the end without resorting
          // This maintains the scroll position and prevents posts from jumping around
          const existingIds = new Set(state.posts.map(post => post.id))
          const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id))
          
          // Simply append new posts at the end
          // The API should return posts in the correct order (newest first for page 1, older for page 2+)
          state.posts = [...state.posts, ...uniqueNewPosts]
          state.page = requestedPage + 1
          
          // Safety check: don't let page go too high
          if (state.page > 10) {
            console.warn('Page number too high, resetting to 1')
            state.page = 1
          }
          console.log('Pagination mode - posts updated:', state.posts.length)
        }
        
        // Check if we have more posts using pagination info
        const limit = action.meta.arg.limit || 10
        // If we got the full limit, there might be more
        state.hasMore = newPosts.length === limit
        console.log('hasMore updated:', state.hasMore)

      })
              .addCase(fetchPosts.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message || 'Failed to fetch posts'
        })
      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        // Add new post at the beginning since it's the newest
        state.posts.unshift(action.payload)
      })
      // Update Post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
      })
      // Delete Post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload)
      })
      // Update post reactions (from reactions slice)
      .addCase(addPostReaction.fulfilled, (state, action) => {
        const { postId, reactions, userReactions } = action.payload
        const postIndex = state.posts.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          // Create a new post object only if reactions changed
          const currentPost = state.posts[postIndex]
          const currentReactions = currentPost.reactions || { like: 0, love: 0, wow: 0, funny: 0, dislike: 0 }
          const currentUserReactions = currentPost.userReactions || []
          
          const reactionsChanged = 
            currentReactions.like !== reactions.like ||
            currentReactions.love !== reactions.love ||
            currentReactions.wow !== reactions.wow ||
            currentReactions.funny !== reactions.funny ||
            currentReactions.dislike !== reactions.dislike ||
            currentUserReactions.length !== userReactions.length ||
            JSON.stringify(currentUserReactions) !== JSON.stringify(userReactions)
          
          if (reactionsChanged) {
            state.posts[postIndex] = {
              ...currentPost,
              reactions,
              userReactions
            }
          }
        }
      })
  }
})

export const { addPost, editPost, resetPosts } = postsSlice.actions

export default postsSlice.reducer
