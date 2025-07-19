'use client'

import * as React from 'react'
import Image from 'next/image'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Thumbnail } from '@/lib/db'

interface SimpleThumbnailCardProps {
  thumbnail: Thumbnail
  onClick?: (thumbnail: Thumbnail) => void
  className?: string
  layout?: 'grid-3' | 'grid-5' | 'masonry'
  priority?: boolean
}

export function SimpleThumbnailCard({
  thumbnail,
  onClick,
  className,
  layout = 'masonry', // eslint-disable-line @typescript-eslint/no-unused-vars
  priority = false
}: SimpleThumbnailCardProps) {
  const handleClick = () => {
    onClick?.(thumbnail)
  }





  return (
    <div
      className={cn(
        'group cursor-pointer transition-all duration-200 hover:scale-[1.02]',
        'rounded-lg overflow-hidden',
        className
      )}
      onClick={handleClick}
    >
      {/* Thumbnail Image with Channel Chip */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted rounded-lg">
        <Image
          src={thumbnail.image_url}
          alt={thumbnail.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={priority}
        />

        {/* Channel Name Chip - Bottom Left */}
        <div className="absolute bottom-2 left-2">
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-lg text-white text-xs font-medium rounded-full truncate max-w-[140px] shadow-lg border border-white/20">
            {thumbnail.author_name}
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal component for enlarged view
interface ThumbnailModalProps {
  thumbnail: Thumbnail | null
  isOpen: boolean
  onClose: () => void
}

export function ThumbnailModal({ thumbnail, isOpen, onClose }: ThumbnailModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !thumbnail) return null

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-background rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Large thumbnail image */}
        <div className="relative w-full aspect-video">
          <Image
            src={thumbnail.image_url}
            alt={thumbnail.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Modal details */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground">
            {thumbnail.title}
          </h2>

          {/* Channel Name */}
          <div className="text-lg font-medium text-foreground">
            {thumbnail.author_name}
          </div>

          {/* Views */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{formatViews(thumbnail.views)} views</span>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {thumbnail.tags.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Description if available */}
          {thumbnail.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {thumbnail.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
