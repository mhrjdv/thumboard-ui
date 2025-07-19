import { meiliSearchService } from './meilisearch'
import { MeiliSearchThumbnail } from '@/types/database'
import { FilterState } from '@/types/filters'

// Simplified Thumbnail type based on MeiliSearch data
export interface Thumbnail {
  id: string
  title: string
  description: string
  image_url: string
  author_id: string
  author_name: string
  author_avatar: string | null
  category: string
  emotion: string
  content_type: string
  tags: string[]
  color_palette: string[]
  views: number
  likes: number
  downloads: number
  price: number
  is_free: boolean
  created_at: string
  updated_at: string
  aspect_ratio: number | null
}

// Adapter to convert MeiliSearch data to Thumbnail format
export function adaptMeiliSearchToThumbnail(meiliData: MeiliSearchThumbnail): Thumbnail {
  return {
    id: meiliData.id,
    title: meiliData.title,
    description: meiliData.description,
    image_url: meiliData.thumb_url,
    author_id: meiliData.channel_id,
    author_name: meiliData.channel_name,
    author_avatar: null,
    category: meiliData.type,
    emotion: meiliData.emotion,
    content_type: 'video', // YouTube thumbnails are videos
    tags: meiliData.primary_keywords,
    color_palette: meiliData.color_palette,
    views: meiliData.view_count,
    likes: 0, // Not available in MeiliSearch
    downloads: 0, // Not available in MeiliSearch
    price: 0, // Free content
    is_free: true,
    created_at: meiliData.published_at,
    updated_at: meiliData.indexed_at,
    aspect_ratio: 16/9, // YouTube standard aspect ratio
  }
}

export interface SearchParams {
  query?: string
  filters: FilterState
  page?: number
  limit?: number
}

export interface SearchResult {
  data: Thumbnail[]
  total: number
  page: number
  limit: number
  hasMore: boolean
  facets?: Record<string, Record<string, number>>
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

class MeiliSearchDatabaseService {
  async searchThumbnails(params: SearchParams): Promise<ApiResponse<SearchResult>> {
    try {
      // Use MeiliSearch for search
      const meiliResult = await meiliSearchService.searchThumbnails(params)

      if (meiliResult.error) {
        return {
          data: null,
          error: meiliResult.error,
          loading: false,
        }
      }

      if (!meiliResult.data) {
        return {
          data: null,
          error: 'No data returned from search',
          loading: false,
        }
      }

      // Convert MeiliSearch results to Thumbnail format
      const adaptedData = meiliResult.data.data.map(adaptMeiliSearchToThumbnail)

      return {
        data: {
          data: adaptedData,
          total: meiliResult.data.total,
          page: meiliResult.data.page,
          limit: meiliResult.data.limit,
          hasMore: meiliResult.data.hasMore,
          facets: meiliResult.data.facets,
        },
        error: null,
        loading: false,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      }
    }
  }

  async getThumbnailById(id: string): Promise<ApiResponse<Thumbnail>> {
    try {
      // Use MeiliSearch for getting individual thumbnails
      const meiliResult = await meiliSearchService.getThumbnailById(id)

      if (meiliResult.error) {
        return {
          data: null,
          error: meiliResult.error,
          loading: false,
        }
      }

      if (!meiliResult.data) {
        return {
          data: null,
          error: 'Thumbnail not found',
          loading: false,
        }
      }

      // Convert MeiliSearch result to Thumbnail format
      const adaptedData = adaptMeiliSearchToThumbnail(meiliResult.data)

      return {
        data: adaptedData,
        error: null,
        loading: false,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      }
    }
  }

  async likeThumbnail(thumbnailId: string, _userId: string): Promise<ApiResponse<boolean>> { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      // Since we don't have a backend for likes, we'll simulate it
      // Debug log (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Liked thumbnail: ${thumbnailId}`)
      }
      return { data: true, error: null, loading: false }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      }
    }
  }

  async downloadThumbnail(thumbnailId: string, _userId: string): Promise<ApiResponse<boolean>> { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      // Since we don't have a backend for downloads, we'll simulate it
      // Debug log (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Downloaded thumbnail: ${thumbnailId}`)
      }
      return { data: true, error: null, loading: false }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      }
    }
  }

  async incrementViews(_thumbnailId: string): Promise<ApiResponse<boolean>> { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      // Since we don't have a backend for view tracking, we'll simulate it
      return { data: true, error: null, loading: false }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      }
    }
  }
}

export const db = new MeiliSearchDatabaseService()

// Use MeiliSearch service directly
export const dbService = db
