'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store/store'
import { fetchPosts } from '../../store/slices/postsSlice'
import PostsList from './PostsList'
import { Loader2 } from 'lucide-react'

export default function PostsListContainer() {
  const dispatch = useDispatch<AppDispatch>()
  const { posts, loading, error, hasMore, page } = useSelector((state: RootState) => state.posts)


  // Initial load
  useEffect(() => {
    console.log('Initial load - dispatching fetchPosts')
    dispatch(fetchPosts({ page: 1, limit: 10, refresh: true }))
  }, [dispatch])



  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading) {
      console.log('Loading more posts, current page:', page, 'next page:', page + 1)
      dispatch(fetchPosts({ page: page + 1, limit: 10, refresh: false }))
    }
  }, [dispatch, hasMore, loading, page])

  // Working infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      console.log('Scroll check:', {
        scrollPosition,
        documentHeight,
        threshold: documentHeight - 1000,
        hasMore,
        loading,
        shouldLoad: scrollPosition > documentHeight - 1000 && hasMore && !loading
      })
      
      if (scrollPosition > documentHeight - 1000) {
        if (hasMore && !loading) {
          console.log('Triggering loadMorePosts from scroll')
          loadMorePosts()
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, loadMorePosts])

  const handleRefresh = () => {
    dispatch(fetchPosts({ page: 1, limit: 10, refresh: true }))
  }

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <PostsList
        posts={posts}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
      />
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-muted-foreground text-sm">Loading more posts...</span>
          </div>
        </div>
      )}
      
      {/* End of posts */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You've reached the end of the posts</p>
        </div>
      )}
    </>
  )
} 