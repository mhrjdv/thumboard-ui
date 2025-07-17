import { MeiliSearchThumbnail, MeiliSearchResponse, MeiliSearchParams, MeiliSearchFilters } from '@/types/database'
import { FilterState } from '@/types/filters'

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'http://13.126.237.51:7700'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'UQtp0G7rendEVtVzssxbGOwqP030IhXh3040m5HQQsCQMvaMlGVJ91l3bKjf9FlQmRUCxD9nelf6yOZ3aHrNAgU0Jg37FsS4xJ4ljC6iz3S3Gijb88MODkgmbhFsAhxe'

export interface SearchParams {
  query?: string
  filters: FilterState
  page?: number
  limit?: number
}

export interface SearchResult {
  data: MeiliSearchThumbnail[]
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

class MeiliSearchService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = MEILISEARCH_URL
    this.apiKey = MEILISEARCH_API_KEY
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  private buildFilters(filters: FilterState): string[] {
    const filterArray: string[] = []

    // Content type filter
    if (filters.types.length > 0) {
      const typeFilter = filters.types.map(type => `type = "${type}"`).join(' OR ')
      filterArray.push(`(${typeFilter})`)
    }

    // Emotion filter
    if (filters.emotions.length > 0) {
      const emotionFilter = filters.emotions.map(emotion => `emotion = "${emotion}"`).join(' OR ')
      filterArray.push(`(${emotionFilter})`)
    }

    // Face presence filter
    if (filters.face_presence.length > 0) {
      const faceFilter = filters.face_presence.map(face => `face_presence = "${face}"`).join(' OR ')
      filterArray.push(`(${faceFilter})`)
    }

    // Layout style filter
    if (filters.layout_style.length > 0) {
      const layoutFilter = filters.layout_style.map(layout => `layout_style = "${layout}"`).join(' OR ')
      filterArray.push(`(${layoutFilter})`)
    }

    // Color palette filter
    if (filters.colors.length > 0) {
      const colorFilter = filters.colors.map(color => `color_palette = "${color}"`).join(' OR ')
      filterArray.push(`(${colorFilter})`)
    }

    // Keywords filter
    if (filters.keywords.length > 0) {
      const keywordFilter = filters.keywords.map(keyword => `primary_keywords = "${keyword}"`).join(' OR ')
      filterArray.push(`(${keywordFilter})`)
    }

    return filterArray
  }

  private buildSort(sortBy: string, sortDirection: 'asc' | 'desc'): string[] {
    // Note: MeiliSearch only supports sorting by sortable attributes
    // Currently only 'channel_id' and 'title' are sortable
    switch (sortBy) {
      case 'title':
      case 'title-desc':
        return [`title:${sortBy === 'title-desc' ? 'desc' : sortDirection}`]
      case 'channel':
        return [`channel_id:${sortDirection}`]
      case 'views':
      case 'views-asc':
      case 'newest':
      case 'oldest':
      case 'relevance':
      default:
        // For non-sortable fields, we'll handle sorting client-side
        return []
    }
  }

  async searchThumbnails(params: SearchParams): Promise<ApiResponse<SearchResult>> {
    try {
      const page = params.page || 1
      const limit = params.limit || 20
      const offset = (page - 1) * limit

      const filters = this.buildFilters(params.filters)
      const sort = this.buildSort(params.filters.sortBy, params.filters.sortDirection)

      const searchParams: MeiliSearchParams = {
        q: params.query || '',
        limit,
        offset,
        facets: ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette'],
        attributesToHighlight: ['title', 'description', 'channel_name', 'primary_keywords'],
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      }

      if (filters.length > 0) {
        searchParams.filter = filters
      }

      if (sort.length > 0) {
        searchParams.sort = sort
      }

      const response = await this.makeRequest<MeiliSearchResponse>(
        '/indexes/thumbnails/search',
        {
          method: 'POST',
          body: JSON.stringify(searchParams),
        }
      )

      let sortedData = response.hits

      // Client-side sorting for non-sortable fields
      if (sort.length === 0) {
        switch (params.filters.sortBy) {
          case 'views':
            sortedData = sortedData.sort((a, b) => 
              params.filters.sortDirection === 'asc' 
                ? a.view_count - b.view_count 
                : b.view_count - a.view_count
            )
            break
          case 'views-asc':
            sortedData = sortedData.sort((a, b) => a.view_count - b.view_count)
            break
          case 'newest':
            sortedData = sortedData.sort((a, b) => 
              new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
            )
            break
          case 'oldest':
            sortedData = sortedData.sort((a, b) => 
              new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
            )
            break
          case 'relevance':
          default:
            // Keep MeiliSearch relevance order
            break
        }
      }

      const total = response.estimatedTotalHits
      const hasMore = offset + limit < total

      return {
        data: {
          data: sortedData,
          total,
          page,
          limit,
          hasMore,
          facets: response.facetDistribution,
        },
        error: null,
        loading: false,
      }
    } catch (error) {
      console.error('MeiliSearch error:', error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false,
      }
    }
  }

  async getThumbnailById(id: string): Promise<ApiResponse<MeiliSearchThumbnail>> {
    try {
      const response = await this.makeRequest<{ results: MeiliSearchThumbnail[] }>(
        `/indexes/thumbnails/documents/${id}`
      )

      // MeiliSearch returns a single document, not an array
      const thumbnail = response as unknown as MeiliSearchThumbnail

      return {
        data: thumbnail,
        error: null,
        loading: false,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Thumbnail not found',
        loading: false,
      }
    }
  }

  async getStats(): Promise<ApiResponse<{ total: number; facets: Record<string, Record<string, number>> }>> {
    try {
      const response = await this.makeRequest<MeiliSearchResponse>(
        '/indexes/thumbnails/search',
        {
          method: 'POST',
          body: JSON.stringify({
            q: '',
            limit: 0,
            facets: ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette'],
          }),
        }
      )

      return {
        data: {
          total: response.estimatedTotalHits,
          facets: response.facetDistribution || {},
        },
        error: null,
        loading: false,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get stats',
        loading: false,
      }
    }
  }

  async getSuggestions(query: string, limit: number = 5): Promise<ApiResponse<string[]>> {
    try {
      const response = await this.makeRequest<MeiliSearchResponse>(
        '/indexes/thumbnails/search',
        {
          method: 'POST',
          body: JSON.stringify({
            q: query,
            limit,
            attributesToRetrieve: ['title', 'primary_keywords'],
          }),
        }
      )

      // Extract suggestions from titles and keywords
      const suggestions = new Set<string>()
      
      response.hits.forEach(hit => {
        // Add title words that match the query
        const titleWords = hit.title.toLowerCase().split(' ')
        titleWords.forEach(word => {
          if (word.includes(query.toLowerCase()) && word.length > 2) {
            suggestions.add(word)
          }
        })

        // Add matching keywords
        hit.primary_keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(query.toLowerCase())) {
            suggestions.add(keyword)
          }
        })
      })

      return {
        data: Array.from(suggestions).slice(0, limit),
        error: null,
        loading: false,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get suggestions',
        loading: false,
      }
    }
  }
}

export const meiliSearchService = new MeiliSearchService()
