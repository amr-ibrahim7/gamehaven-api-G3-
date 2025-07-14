import { Badge } from './ui/badge'
import { Hash } from 'lucide-react'

interface TagsProps {
  tags: string[]
  className?: string
}

export default function Tags({ tags, className = '' }: TagsProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-xs px-2 py-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          <Hash className="size-3" />
          {tag}
        </Badge>
      ))}
    </div>
  )
} 