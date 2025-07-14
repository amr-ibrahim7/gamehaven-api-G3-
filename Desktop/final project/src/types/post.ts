export interface UserReaction {
  userId: string;
  username: string;
  reaction: string;
  createdAt: string;
}

export interface Reactions {
  like: number;
  love: number;
  wow: number;
  funny: number;
  dislike: number;
}

export interface PostType {
  id: string,
  text: string,
  code?: string,
  codeLang?: string,
  video?: string,
  image?: string,
  tags?: string[],
  createdBy: string,
  createdAt: string,
  updatedAt: string,
  reactions?: Reactions,
  userReactions?: UserReaction[],
}