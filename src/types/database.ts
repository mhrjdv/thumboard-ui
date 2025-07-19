// MeiliSearch Document Structure
export interface MeiliSearchThumbnail {
  id: string
  title: string
  description: string
  primary_keywords: string[]
  keyword_pool: string[]
  color_palette: string[]
  type: 'tutorial' | 'other' | 'documentary' | 'lifestyle' | 'vlog'
  face_presence: 'with_face' | 'faceless'
  emotion: 'neutral' | 'happy'
  layout_style: 'design_heavy' | 'balanced'
  text_tags: string[]
  channel_id: string
  channel_name: string
  view_count: number
  published_at: string
  video_description: string
  thumb_url: string
  indexed_at: string
}

// MeiliSearch API Response Types
export interface MeiliSearchResponse {
  hits: MeiliSearchThumbnail[]
  query: string
  processingTimeMs: number
  limit: number
  offset: number
  estimatedTotalHits: number
  facetDistribution?: Record<string, Record<string, number>>
  facetStats?: Record<string, Record<string, number>>
}

export interface MeiliSearchFilters {
  type?: string[]
  emotion?: string[]
  face_presence?: string[]
  layout_style?: string[]
  color_palette?: string[]
  primary_keywords?: string[]
}

export interface MeiliSearchParams {
  q?: string
  limit?: number
  offset?: number
  filter?: string[]
  sort?: string[]
  facets?: string[]
  attributesToHighlight?: string[]
  highlightPreTag?: string
  highlightPostTag?: string
  attributesToRetrieve?: string[]
}

// Meilisearch Index Configuration Interface
export interface MeilisearchIndexConfig {
  sortableAttributes: string[]
  filterableAttributes: string[]
  searchableAttributes: string[]
  rankingRules: string[]
  facetableAttributes: string[]
  highlightableAttributes: string[]
}

// Legacy types for backward compatibility
export type ContentType = 'image' | 'video' | 'vector' | 'template' | 'mockup'
export type Category = 'photography' | 'illustration' | 'design' | 'art' | 'logos' | 'icons'
export type Emotion = 'calm' | 'energetic' | 'professional' | 'playful' | 'elegant' | 'bold'
