import { cn } from '@/lib/utils'

interface ThumbnailCardSkeletonProps {
  className?: string
}

export function ThumbnailCardSkeleton({ className }: ThumbnailCardSkeletonProps) {
  return (
    <div 
      className={cn(
        'bg-card rounded-lg overflow-hidden border border-border/50 animate-pulse',
        className
      )}
    >
      {/* Thumbnail Image Skeleton */}
      <div className="relative w-full aspect-video bg-muted" />

      {/* Card Details Skeleton */}
      <div className="p-3 space-y-3">
        {/* Channel Name Skeleton */}
        <div className="h-4 bg-muted rounded w-3/4" />

        {/* Keywords Skeleton */}
        <div className="flex flex-wrap gap-1.5">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-20" />
          <div className="h-6 bg-muted rounded w-12" />
        </div>

        {/* Views Skeleton */}
        <div className="h-3 bg-muted rounded w-20" />
      </div>
    </div>
  )
}
