'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Post from './Post'
import { PostType } from '../../types/post'
import { Button } from '../ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

interface PostsListProps {
  posts?: PostType[]
  loading?: boolean
  error?: string | null
  onRefresh?: () => void
  className?: string
}

export default function PostsList({
  posts: propPosts,
  loading = false,
  error = null,
  onRefresh,
  className = ''
}: PostsListProps) {
  const [localPosts, setLocalPosts] = useState<PostType[]>([])
  
  // Use Redux posts if no props provided - memoize to prevent unnecessary re-renders
  const reduxPosts = useSelector((state: RootState) => state.posts.posts)
  const posts = useMemo(() => propPosts || reduxPosts, [propPosts, reduxPosts])

  useEffect(() => {
    setLocalPosts(posts)
  }, [posts])

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-500 mb-4">{error}</p>
        {onRefresh && (
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="size-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    )
  }

  if (loading && localPosts.length === 0) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between my-4">
        <h2 className="text-2xl font-bold">Timeline</h2>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {localPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {localPosts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <RefreshCw className="size-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p>Be the first to share something amazing!</p>
          </div>
        </div>
      )}
    </div>
  )
} 