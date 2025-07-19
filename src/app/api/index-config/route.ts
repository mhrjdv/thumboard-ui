import { NextResponse } from 'next/server'

const MEILISEARCH_URL = process.env.MEILISEARCH_URL
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY

export async function GET() {
  try {
    // Validate environment variables
    if (!MEILISEARCH_URL || !MEILISEARCH_API_KEY) {
      return NextResponse.json(
        {
          error: 'MeiliSearch configuration missing',
          details: 'MEILISEARCH_URL and MEILISEARCH_API_KEY environment variables are required'
        },
        { status: 500 }
      )
    }
    // Fetch all index settings in parallel
    const [
      sortableResponse,
      filterableResponse,
      searchableResponse,
      rankingResponse
    ] = await Promise.allSettled([
      fetch(`${MEILISEARCH_URL}/indexes/thumbnails/settings/sortable-attributes`, {
        headers: {
          'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${MEILISEARCH_URL}/indexes/thumbnails/settings/filterable-attributes`, {
        headers: {
          'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${MEILISEARCH_URL}/indexes/thumbnails/settings/searchable-attributes`, {
        headers: {
          'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${MEILISEARCH_URL}/indexes/thumbnails/settings/ranking-rules`, {
        headers: {
          'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })
    ])

    // Parse responses with fallbacks
    const sortableAttributes = sortableResponse.status === 'fulfilled' && sortableResponse.value.ok
      ? await sortableResponse.value.json()
      : ['title', 'channel_id', 'published_at', 'view_count']

    const filterableAttributes = filterableResponse.status === 'fulfilled' && filterableResponse.value.ok
      ? await filterableResponse.value.json()
      : ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette', 'primary_keywords']

    const searchableAttributes = searchableResponse.status === 'fulfilled' && searchableResponse.value.ok
      ? await searchableResponse.value.json()
      : ['title', 'description', 'channel_name', 'primary_keywords']

    const rankingRules = rankingResponse.status === 'fulfilled' && rankingResponse.value.ok
      ? await rankingResponse.value.json()
      : ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness']

    const config = {
      sortableAttributes,
      filterableAttributes,
      searchableAttributes,
      rankingRules,
      facetableAttributes: filterableAttributes, // Facetable attributes are typically the same as filterable
      highlightableAttributes: searchableAttributes, // Highlightable attributes are typically the same as searchable
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to fetch index configuration:', error)
    
    // Return default configuration on error
    const defaultConfig = {
      sortableAttributes: ['title', 'channel_id', 'published_at', 'view_count'],
      filterableAttributes: ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette', 'primary_keywords'],
      searchableAttributes: ['title', 'description', 'channel_name', 'primary_keywords'],
      rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
      facetableAttributes: ['type', 'emotion', 'face_presence', 'layout_style', 'color_palette'],
      highlightableAttributes: ['title', 'description', 'channel_name', 'primary_keywords']
    }

    return NextResponse.json(defaultConfig)
  }
}
