import { MeiliSearchThumbnail, MeiliSearchResponse, MeiliSearchParams, MeilisearchIndexConfig } from '@/types/database'
import { FilterState } from '@/types/filters'

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'https://api.thumboard.in'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'UQtp0G7rendEVtVzssxbGOwqP030IhXh3040m5HQQsCQMvaMlGVJ91l3bKjf9FlQmRUCxD9nelf6yOZ3aHrNAgU0Jg37FsS4xJ4ljC6iz3S3Gijb88MODkgmbhFsAhxe'

// Default configuration - can be overridden by fetching from the index
const DEFAULT_INDEX_CONFIG: MeilisearchIndexConfig = {
  sortableAttributes: ['title', 'channel_id', 'published_at', 'view_count'],
  filterableAttributes: ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette', 'primary_keywords'],
  searchableAttributes: ['title', 'description', 'channel_name', 'primary_keywords'],
  rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  facetableAttributes: ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette'],
  highlightableAttributes: ['title', 'description', 'channel_name', 'primary_keywords']
}

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
  private indexConfig: MeilisearchIndexConfig
  private configFetched: boolean = false

  constructor() {
    this.baseUrl = MEILISEARCH_URL
    this.apiKey = MEILISEARCH_API_KEY
    this.indexConfig = DEFAULT_INDEX_CONFIG
  }

  // Fetch the current index configuration from Meilisearch
  private async fetchIndexConfig(): Promise<void> {
    if (this.configFetched) return

    try {
      const isClient = typeof window !== 'undefined'

      if (isClient) {
        // Use API route from client
        const response = await fetch('/api/index-config')
        if (response.ok) {
          const config = await response.json()
          this.indexConfig = { ...DEFAULT_INDEX_CONFIG, ...config }
        }
      } else {
        // Direct Meilisearch calls from server
        const [sortable, filterable, searchable, ranking] = await Promise.all([
          this.makeRequest<string[]>('/indexes/thumbnails/settings/sortable-attributes').catch(() => DEFAULT_INDEX_CONFIG.sortableAttributes),
          this.makeRequest<string[]>('/indexes/thumbnails/settings/filterable-attributes').catch(() => DEFAULT_INDEX_CONFIG.filterableAttributes),
          this.makeRequest<string[]>('/indexes/thumbnails/settings/searchable-attributes').catch(() => DEFAULT_INDEX_CONFIG.searchableAttributes),
          this.makeRequest<string[]>('/indexes/thumbnails/settings/ranking-rules').catch(() => DEFAULT_INDEX_CONFIG.rankingRules),
        ])

        this.indexConfig = {
          sortableAttributes: sortable,
          filterableAttributes: filterable,
          searchableAttributes: searchable,
          rankingRules: ranking,
          facetableAttributes: filterable, // Facetable attributes are typically the same as filterable
          highlightableAttributes: searchable, // Highlightable attributes are typically the same as searchable
        }
      }

      this.configFetched = true
    } catch (error) {
      console.warn('Failed to fetch index configuration, using defaults:', error)
      this.indexConfig = DEFAULT_INDEX_CONFIG
      this.configFetched = true
    }
  }

  // Get the current index configuration
  public async getIndexConfig(): Promise<MeilisearchIndexConfig> {
    await this.fetchIndexConfig()
    return this.indexConfig
  }

  // Get available sort options based on current configuration
  public async getAvailableSortOptions(): Promise<Array<{id: string, label: string, field?: string, direction?: 'asc' | 'desc'}>> {
    const config = await this.getIndexConfig()
    const options: Array<{id: string, label: string, field?: string, direction?: 'asc' | 'desc'}> = [
      { id: 'relevance', label: 'Relevance' }
    ]

    if (config.sortableAttributes.includes('title')) {
      options.push(
        { id: 'title', label: 'Title A-Z', field: 'title', direction: 'asc' as const },
        { id: 'title-desc', label: 'Title Z-A', field: 'title', direction: 'desc' as const }
      )
    }

    if (config.sortableAttributes.includes('published_at')) {
      options.push(
        { id: 'newest', label: 'Newest First', field: 'published_at', direction: 'desc' as const },
        { id: 'oldest', label: 'Oldest First', field: 'published_at', direction: 'asc' as const }
      )
    }

    if (config.sortableAttributes.includes('view_count')) {
      options.push(
        { id: 'views', label: 'Most Views', field: 'view_count', direction: 'desc' as const },
        { id: 'views-asc', label: 'Least Views', field: 'view_count', direction: 'asc' as const }
      )
    }

    if (config.sortableAttributes.includes('channel_id')) {
      options.push(
        { id: 'channel', label: 'Channel', field: 'channel_id', direction: 'asc' as const }
      )
    }

    return options
  }

  // Get available filter options based on current configuration
  public async getAvailableFilterOptions(): Promise<Array<{id: string, label: string, field: string}>> {
    const config = await this.getIndexConfig()
    const options = []

    if (config.filterableAttributes.includes('type')) {
      options.push({ id: 'types', label: 'Content Type', field: 'type' })
    }

    if (config.filterableAttributes.includes('emotion')) {
      options.push({ id: 'emotions', label: 'Emotions & Mood', field: 'emotion' })
    }

    if (config.filterableAttributes.includes('face_presence')) {
      options.push({ id: 'face_presence', label: 'Face Presence', field: 'face_presence' })
    }

    if (config.filterableAttributes.includes('layout_style')) {
      options.push({ id: 'layout_style', label: 'Layout Style', field: 'layout_style' })
    }

    if (config.filterableAttributes.includes('color_palette')) {
      options.push({ id: 'colors', label: 'Color Palette', field: 'color_palette' })
    }

    if (config.filterableAttributes.includes('primary_keywords')) {
      options.push({ id: 'keywords', label: 'Keywords', field: 'primary_keywords' })
    }

    return options
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Use API routes for browser requests to avoid CORS issues
    const isClient = typeof window !== 'undefined'

    let url: string
    if (isClient) {
      // Use Next.js API routes from the client
      url = `/api${endpoint}`
    } else {
      // Direct MeiliSearch calls from server
      url = `${this.baseUrl}${endpoint}`
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(isClient ? {} : { 'Authorization': `Bearer ${this.apiKey}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  private async buildFilters(filters: FilterState): Promise<string[]> {
    const filterArray: string[] = []
    const config = await this.getIndexConfig()

    // Helper function to check if an attribute is filterable
    const isFilterable = (attribute: string) => config.filterableAttributes.includes(attribute)

    // Content type filter
    if (filters.types.length > 0 && isFilterable('type')) {
      const typeFilter = filters.types.map(type => `type = "${type}"`).join(' OR ')
      filterArray.push(`(${typeFilter})`)
    }

    // Emotion filter
    if (filters.emotions.length > 0 && isFilterable('emotion')) {
      const emotionFilter = filters.emotions.map(emotion => `emotion = "${emotion}"`).join(' OR ')
      filterArray.push(`(${emotionFilter})`)
    }

    // Face presence filter
    if (filters.face_presence.length > 0 && isFilterable('face_presence')) {
      const faceFilter = filters.face_presence.map(face => `face_presence = "${face}"`).join(' OR ')
      filterArray.push(`(${faceFilter})`)
    }

    // Layout style filter
    if (filters.layout_style.length > 0 && isFilterable('layout_style')) {
      const layoutFilter = filters.layout_style.map(layout => `layout_style = "${layout}"`).join(' OR ')
      filterArray.push(`(${layoutFilter})`)
    }

    // Color palette filter
    if (filters.colors.length > 0 && isFilterable('color_palette')) {
      const colorFilter = filters.colors.map(color => `color_palette = "${color}"`).join(' OR ')
      filterArray.push(`(${colorFilter})`)
    }

    // Keywords filter
    if (filters.keywords.length > 0 && isFilterable('primary_keywords')) {
      const keywordFilter = filters.keywords.map(keyword => `primary_keywords = "${keyword}"`).join(' OR ')
      filterArray.push(`(${keywordFilter})`)
    }

    return filterArray
  }

  private async buildSort(sortBy: string, sortDirection: 'asc' | 'desc'): Promise<string[]> {
    const config = await this.getIndexConfig()

    // Helper function to check if an attribute is sortable
    const isSortable = (attribute: string) => config.sortableAttributes.includes(attribute)

    switch (sortBy) {
      case 'title':
      case 'title-desc':
        if (isSortable('title')) {
          return [`title:${sortBy === 'title-desc' ? 'desc' : sortDirection}`]
        }
        break
      case 'channel':
        if (isSortable('channel_id')) {
          return [`channel_id:${sortDirection}`]
        }
        break
      case 'views':
      case 'views-asc':
        if (isSortable('view_count')) {
          return [`view_count:${sortBy === 'views-asc' ? 'asc' : sortDirection}`]
        }
        break
      case 'newest':
        if (isSortable('published_at')) {
          return [`published_at:desc`]
        }
        break
      case 'oldest':
        if (isSortable('published_at')) {
          return [`published_at:asc`]
        }
        break
      case 'relevance':
      default:
        // Relevance sorting is handled by Meilisearch's ranking rules
        return []
    }

    // If the requested sort field is not sortable, return empty array for client-side sorting
    return []
  }

  async searchThumbnails(params: SearchParams): Promise<ApiResponse<SearchResult>> {
    try {
      const page = params.page || 1
      const limit = params.limit || 20
      const offset = (page - 1) * limit

      // Get dynamic configuration
      const config = await this.getIndexConfig()

      const filters = await this.buildFilters(params.filters)
      const sort = await this.buildSort(params.filters.sortBy, params.filters.sortDirection)

      const searchParams: MeiliSearchParams = {
        q: params.query || '',
        limit,
        offset,
        facets: config.facetableAttributes,
        attributesToHighlight: config.highlightableAttributes,
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
        '/search',
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
      const config = await this.getIndexConfig()

      const response = await this.makeRequest<MeiliSearchResponse>(
        '/indexes/thumbnails/search',
        {
          method: 'POST',
          body: JSON.stringify({
            q: '',
            limit: 0,
            facets: config.facetableAttributes,
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
      const isClient = typeof window !== 'undefined'

      if (isClient) {
        // Use API route from client
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return {
          data: data.suggestions || [],
          error: null,
          loading: false,
        }
      } else {
        // Direct MeiliSearch call from server
        const config = await this.getIndexConfig()

        // Use only searchable attributes that exist in the configuration
        const retrieveAttributes = ['title', 'primary_keywords'].filter(attr =>
          config.searchableAttributes.includes(attr)
        )

        const response = await this.makeRequest<MeiliSearchResponse>(
          '/indexes/thumbnails/search',
          {
            method: 'POST',
            body: JSON.stringify({
              q: query,
              limit,
              attributesToRetrieve: retrieveAttributes.length > 0 ? retrieveAttributes : undefined,
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
