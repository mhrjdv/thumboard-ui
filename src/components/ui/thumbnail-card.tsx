'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Download, Share2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useImageLazyLoad } from '@/lib/performance'
import { useReducedMotion } from '@/lib/accessibility'

export interface ThumbnailData {
  id: string
  title: string
  description?: string
  imageUrl: string
  author: {
    name: string
    avatar?: string
  }
  stats: {
    views: number
    likes: number
    downloads: number
  }
  tags: string[]
  aspectRatio?: number
}

interface ThumbnailCardProps {
  data: ThumbnailData
  onLike?: (id: string) => void
  onDownload?: (id: string) => void
  onShare?: (id: string) => void
  onClick?: (id: string) => void
  className?: string
  priority?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ThumbnailCard({
  data,
  onLike,
  onDownload,
  onShare,
  onClick,
  className,
  priority = false,
  size = 'md',
}: ThumbnailCardProps) {
  const [isLiked, setIsLiked] = React.useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Lazy loading for images
  const { imgRef, imageSrc, isLoaded: isImageLoaded, isError } = useImageLazyLoad(
    data.imageUrl,
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'
  )

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    onLike?.(data.id)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload?.(data.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    onShare?.(data.id)
  }

  const handleClick = () => {
    onClick?.(data.id)
  }

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer',
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted">
        <motion.div
          ref={imgRef}
          initial={{ scale: 1 }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          <Image
            src={imageSrc || data.imageUrl}
            alt={data.title}
            width={400}
            height={data.aspectRatio ? 400 / data.aspectRatio : 300}
            className={cn(
              'w-full h-auto object-cover transition-opacity duration-300',
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => {/* Image loaded */}}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Loading placeholder */}
        {!isImageLoaded && !isError && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Error state */}
        {isError && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Failed to load</span>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={cn('h-4 w-4', isLiked && 'fill-red-500 text-red-500')} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              onClick={handleDownload}
              aria-label="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-black"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats overlay */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{data.stats.views.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{data.title}</h3>
        {data.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {data.description}
          </p>
        )}

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {data.author.avatar && (
              <Image
                src={data.author.avatar}
                alt={data.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-muted-foreground">{data.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{data.stats.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{data.stats.downloads}</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{data.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
