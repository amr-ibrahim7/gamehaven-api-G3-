export type User = {
  name: string
  username: string
}

export type CodeBlock = {
  code: string
  language: string
}

export type CommentContent = {
  text: string
  code?: CodeBlock
}

export type UserReaction = {
  userId: string
  username: string
  reaction: string
  createdAt: string
}

export type Reactions = {
  like: number
  love: number
  wow: number
  funny: number
  dislike: number
  happy: number
}

export type Reply = {
  id: number | string
  parentCommentId: number | string
  user: User
  content: CommentContent
  createdAt: Date
  postId: string
  replies: Reply[]
  reactions?: Reactions
  userReactions?: UserReaction[]
}

export type Comment = {
  id: number | string
  user: User
  content: CommentContent
  parentCommentId?: number | string
  createdAt: Date
  postId: string
  reactions: Reactions
  userReactions: UserReaction[]
  replies: Reply[]
}
  