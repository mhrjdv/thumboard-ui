'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimpleThumbnailCard, ThumbnailModal } from './simple-thumbnail-card'
import { ThumbnailCardSkeleton } from './thumbnail-card-skeleton'
import { type ThumbnailData } from './thumbnail-card'
import { Button } from './button'

import { AlertCircle, RefreshCw, Grid3X3, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThumbnails, useThumbnailActions } from '@/hooks/use-thumbnails'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { type SearchParams, type Thumbnail } from '@/lib/db'
import { defaultFilterState } from '@/types/filters'

interface ThumbnailGridProps {
  searchParams?: SearchParams
  data?: ThumbnailData[]
  loading?: boolean
  hasMore?: boolean
  onItemClick?: (id: string) => void
  onItemLike?: (id: string) => void
  onItemDownload?: (id: string) => void
  onItemShare?: (id: string) => void
  className?: string
  layout?: 'grid-3' | 'grid-5'
  columns?: 2 | 3 | 4 | 5
  useRealData?: boolean
  onToggleFilters?: () => void
  viewLayout?: 'grid-3' | 'grid-5'
  onViewLayoutChange?: (layout: 'grid-3' | 'grid-5') => void
}

const mockData: ThumbnailData[] = [
  {
    id: '1',
    title: 'Beautiful Mountain Landscape',
    description: 'Stunning view of snow-capped mountains during golden hour',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    author: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    stats: { views: 1234, likes: 89, downloads: 45 },
    tags: ['landscape', 'mountains', 'nature'],
    aspectRatio: 4/3,
  },
  {
    id: '2',
    title: 'Modern Architecture Design',
    description: 'Clean lines and geometric patterns in contemporary building',
    imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=500&fit=crop',
    author: { name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
    stats: { views: 856, likes: 67, downloads: 23 },
    tags: ['architecture', 'modern', 'design'],
    aspectRatio: 4/5,
  },
  {
    id: '3',
    title: 'Abstract Digital Art',
    description: 'Colorful abstract composition with flowing shapes',
    imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    author: { name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    stats: { views: 2341, likes: 156, downloads: 78 },
    tags: ['abstract', 'digital', 'art', 'colorful'],
    aspectRatio: 1,
  },
  {
    id: '4',
    title: 'Vintage Typography Poster',
    description: 'Retro-style poster with classic typography elements',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=600&fit=crop',
    author: { name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    stats: { views: 567, likes: 34, downloads: 12 },
    tags: ['typography', 'vintage', 'poster'],
    aspectRatio: 2/3,
  },
  {
    id: '5',
    title: 'Minimalist Logo Design',
    description: 'Clean and simple logo concept for modern brands',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    author: { name: 'Mike Brown', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
    stats: { views: 1876, likes: 123, downloads: 89 },
    tags: ['logo', 'minimalist', 'branding'],
    aspectRatio: 4/3,
  },
  {
    id: '6',
    title: 'Nature Photography',
    description: 'Macro shot of dewdrops on green leaves',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop',
    author: { name: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
    stats: { views: 934, likes: 78, downloads: 34 },
    tags: ['nature', 'macro', 'photography'],
    aspectRatio: 4/5,
  },
]

export function ThumbnailGrid({
  searchParams,
  data = mockData,
  loading = false,
  hasMore = true,
  onItemClick,
  onItemLike: _onItemLike, // eslint-disable-line @typescript-eslint/no-unused-vars
  onItemDownload: _onItemDownload, // eslint-disable-line @typescript-eslint/no-unused-vars
  onItemShare: _onItemShare, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  layout = 'grid-3',
  columns: _columns = 3, // eslint-disable-line @typescript-eslint/no-unused-vars
  useRealData = false,
  onToggleFilters,
  viewLayout: externalViewLayout,
  onViewLayoutChange,
}: ThumbnailGridProps) {
  const [internalViewLayout, setInternalViewLayout] = React.useState<'grid-3' | 'grid-5'>(
    layout === 'grid-3' ? 'grid-3' :
    layout === 'grid-5' ? 'grid-5' :
    'grid-3' // default to grid-3 (3 columns)
  )

  // Use external layout state if provided, otherwise use internal state
  const viewLayout = externalViewLayout || internalViewLayout
  const setViewLayout = onViewLayoutChange || setInternalViewLayout
  const [selectedThumbnail, setSelectedThumbnail] = React.useState<Thumbnail | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Use real data if searchParams provided and useRealData is true
  const thumbnailsQuery = useThumbnails(useRealData ? (searchParams || { filters: defaultFilterState }) : { filters: defaultFilterState })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { likeThumbnail: _likeThumbnail, downloadThumbnail: _downloadThumbnail, incrementViews } = useThumbnailActions()

  // Use real data if available, otherwise fall back to mock data
  const displayData = React.useMemo(() => {
    if (useRealData && thumbnailsQuery.data) {
      return thumbnailsQuery.data.data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        imageUrl: item.image_url,
        author: {
          name: item.author_name,
          avatar: item.author_avatar || undefined,
        },
        stats: {
          views: item.views,
          likes: item.likes,
          downloads: item.downloads,
        },
        tags: item.tags,
        aspectRatio: item.aspect_ratio || undefined,
      }))
    }
    return data
  }, [useRealData, thumbnailsQuery.data, data])

  const isLoading = useRealData ? thumbnailsQuery.loading : loading
  const isLoadingMore = useRealData ? thumbnailsQuery.loadingMore : false
  const hasMoreData = useRealData ? thumbnailsQuery.hasMore : hasMore
  const error = useRealData ? thumbnailsQuery.error : null

  // Enhanced infinite scroll with new hook
  const sentinelRef = useInfiniteScroll({
    hasMore: hasMoreData,
    isLoading: isLoadingMore,
    onLoadMore: () => {
      if (useRealData && thumbnailsQuery.loadMore) {
        thumbnailsQuery.loadMore()
      }
    },
    threshold: 0.01, // Very low threshold for earlier triggering
    rootMargin: '500px', // Large margin for earlier loading
    enabled: useRealData,
  })

  // Modal handlers
  const handleThumbnailClick = (thumbnail: Thumbnail) => {
    setSelectedThumbnail(thumbnail)
    setIsModalOpen(true)
    if (useRealData) {
      incrementViews(thumbnail.id)
    }
    onItemClick?.(thumbnail.id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedThumbnail(null)
  }





  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const getGridClasses = () => {
    const baseClasses = 'gap-2 sm:gap-3 md:gap-4 lg:gap-6'

    switch (viewLayout) {
      case 'grid-3':
        return `grid-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:justify-items-center ${baseClasses}`
      case 'grid-5':
        return `grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:justify-items-center ${baseClasses}`
      default:
        return `grid-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:justify-items-center ${baseClasses}`
    }
  }

  return (
    <div className={cn('w-full max-w-7xl', className)}>
      {/* Layout Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {/* Filter Toggle Button (mobile) */}
          {onToggleFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFilters}
              className="h-9 px-3 lg:hidden"
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={viewLayout === 'grid-3' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewLayout('grid-3')}
            aria-label="Grid layout (3 columns)"
            className="h-9 px-3"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
            </svg>
          </Button>
          <Button
            variant={viewLayout === 'grid-5' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewLayout('grid-5')}
            aria-label="Grid layout (5 columns)"
            className="h-9 px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {useRealData && thumbnailsQuery.data ? (
            <>
              {thumbnailsQuery.data.total} {thumbnailsQuery.data.total === 1 ? 'item' : 'items'}
            </>
          ) : (
            `${displayData.length} ${displayData.length === 1 ? 'item' : 'items'}`
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {error.includes('Failed to fetch')
              ? 'Unable to connect to the search service. Please check your internet connection and try again.'
              : error
            }
          </p>
          <div className="flex gap-2">
            <Button onClick={() => thumbnailsQuery.refetch?.()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="sm"
            >
              Reload Page
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && displayData.length === 0 && (
        <div className={getGridClasses()}>
          {Array.from({ length: 20 }).map((_, i) => (
            <ThumbnailCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Grid Container */}
      {!error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={getGridClasses()}

        >
          <AnimatePresence>
            {displayData.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className="w-full"
              >
                <SimpleThumbnailCard
                  thumbnail={useRealData && thumbnailsQuery.data && thumbnailsQuery.data.data[index] ? thumbnailsQuery.data.data[index] : {
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    image_url: item.imageUrl,
                    author_id: item.author.name,
                    author_name: item.author.name,
                    author_avatar: item.author.avatar || null,
                    category: '',
                    emotion: '',
                    content_type: 'video',
                    tags: item.tags || [],
                    color_palette: [],
                    views: item.stats.views,
                    likes: item.stats.likes,
                    downloads: item.stats.downloads,
                    price: 0,
                    is_free: true,
                    created_at: '',
                    updated_at: '',
                    aspect_ratio: 16/9,
                  }}
                  onClick={handleThumbnailClick}
                  layout={viewLayout}
                  priority={index < 6} // Prioritize first 6 images
                />
            </motion.div>
          ))}
        </AnimatePresence>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && displayData.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <ThumbnailCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Seamless loading - no visible indicator for smooth UX */}

      {/* Infinite scroll sentinel */}
      {hasMoreData && (
        <div ref={sentinelRef} className="h-20 flex justify-center items-center">
          {/* This invisible element triggers loading when it comes into view */}
          <div className="w-1 h-1 opacity-0">Loading trigger</div>
        </div>
      )}



      {/* Empty State */}
      {displayData.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No items found</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Thumbnail Modal */}
      <ThumbnailModal
        thumbnail={selectedThumbnail}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
