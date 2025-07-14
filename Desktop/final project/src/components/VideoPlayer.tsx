'use client'

import { useEffect, useState, memo } from 'react'

interface VideoPlayerProps {
  source: string
  className?: string
}

const VideoPlayer = memo(function VideoPlayer({ source, className = '' }: VideoPlayerProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [PlyrComponent, setPlyrComponent] = useState<any>(null)

  useEffect(() => {
    const loadPlyr = async () => {
      // Dynamically import Plyr only on client side
      const Plyr = (await import('plyr-react')).default
      setPlyrComponent(() => Plyr)
      setIsMounted(true)
      }
    
    loadPlyr()
  }, [])

  const videoSource = {
    type: 'video' as const,
    sources: [
      {
        src: source,
        type: 'video/mp4' as const,
      },
    ],
  }

  if (!isMounted || !PlyrComponent) {
    return (
      <div className={`${className} bg-muted rounded-lg flex items-center justify-center`} style={{ aspectRatio: '16/9' }}>
        <div className="text-muted-foreground">Loading video player...</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <PlyrComponent
        source={videoSource}
        options={{
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen'
          ],
          ratio: '16:9',
        }}
      />
    </div>
  )
})

export default VideoPlayer 