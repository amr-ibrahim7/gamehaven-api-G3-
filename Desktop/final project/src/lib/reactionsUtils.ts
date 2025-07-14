import { Reactions, UserReaction } from '../store/slices/reactionsSlice'

// Utility functions for managing reactions

/**
 * Get the total count of all reactions
 */
export const getTotalReactions = (reactions: Reactions): number => {
  return Object.values(reactions).reduce((sum, count) => sum + count, 0)
}

/**
 * Get the most popular reaction type
 */
export const getMostPopularReaction = (reactions: Reactions): string | null => {
  const entries = Object.entries(reactions)
  if (entries.length === 0) return null
  
  return entries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  )[0]
}

/**
 * Check if a user has reacted to a post/comment
 */
export const getUserReaction = (
  userReactions: UserReaction[], 
  userId: string
): UserReaction | null => {
  return userReactions.find(ur => ur.userId === userId) || null
}

/**
 * Get reaction count for a specific type
 */
export const getReactionCount = (reactions: Reactions, reactionType: string): number => {
  return reactions[reactionType as keyof Reactions] || 0
}

/**
 * Format reaction count for display (e.g., 1000 -> 1K)
 */
export const formatReactionCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Get reaction statistics
 */
export const getReactionStats = (reactions: Reactions) => {
  const total = getTotalReactions(reactions)
  const mostPopular = getMostPopularReaction(reactions)
  
  return {
    total,
    mostPopular,
    breakdown: Object.entries(reactions).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
  }
}

/**
 * Check if reactions are empty
 */
export const hasReactions = (reactions: Reactions): boolean => {
  return getTotalReactions(reactions) > 0
}

/**
 * Get reaction emoji by type
 */
export const getReactionEmoji = (reactionType: string): string => {
  const emojiMap: Record<string, string> = {
    like: '👍',
    love: '❤️',
    wow: '😮',
    funny: '😂',
    dislike: '👎'
  }
  return emojiMap[reactionType] || '👍'
}

/**
 * Get reaction color by type
 */
export const getReactionColor = (reactionType: string): string => {
  const colorMap: Record<string, string> = {
    like: '#3b82f6',
    love: '#ef4444',
    wow: '#f59e0b',
    funny: '#10b981',
    dislike: '#6b7280'
  }
  return colorMap[reactionType] || '#3b82f6'
}

/**
 * Sort reactions by count (descending)
 */
export const sortReactionsByCount = (reactions: Reactions): Array<[string, number]> => {
  return Object.entries(reactions)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
}

/**
 * Get reaction summary for display
 */
export const getReactionSummary = (reactions: Reactions): string => {
  const sorted = sortReactionsByCount(reactions)
  if (sorted.length === 0) return 'No reactions'
  
  const total = getTotalReactions(reactions)
  const topReaction = sorted[0]
  
  if (sorted.length === 1) {
    return `${getReactionEmoji(topReaction[0])} ${formatReactionCount(total)}`
  }
  
  return `${getReactionEmoji(topReaction[0])} ${formatReactionCount(total)}`
} 