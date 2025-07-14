import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'
import commentsReducer from './slices/commentsSlice'
import postReducer from './slices/postsSlice'
import programmingLanguagesReducer from './slices/programmingLanguagesSlice'
import reactionsReducer from './slices/reactionsSlice'
import { updateCommentReactions } from './slices/commentsSlice'
import { editPost } from './slices/postsSlice'

// Middleware to sync reactions between slices
const reactionSyncMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)
  
  // If a comment reaction was added, sync it to the comments slice
  if (action.type === 'reactions/addCommentReaction/fulfilled') {
    const { commentId, reactions, userReactions } = action.payload
    store.dispatch(updateCommentReactions({
      commentId,
      reactions,
      userReactions
    }))
  }
  
  // If a post reaction was added, sync it to the posts slice
  if (action.type === 'reactions/addPostReaction/fulfilled') {
    const { postId, reactions, userReactions } = action.payload
    store.dispatch(editPost({
      id: postId,
      data: {
        reactions,
        userReactions
      }
    }))
  }
  
  return result
}

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    posts: postReducer,
    comments: commentsReducer,
    programmingLanguages: programmingLanguagesReducer,
    reactions: reactionsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reactionSyncMiddleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
