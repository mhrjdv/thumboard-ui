import { NextRequest, NextResponse } from 'next/server'

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'https://api.thumboard.in'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'UQtp0G7rendEVtVzssxbGOwqP030IhXh3040m5HQQsCQMvaMlGVJ91l3bKjf9FlQmRUCxD9nelf6yOZ3aHrNAgU0Jg37FsS4xJ4ljC6iz3S3Gijb88MODkgmbhFsAhxe'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const response = await fetch(`${MEILISEARCH_URL}/indexes/thumbnails/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        q: query,
        limit,
        attributesToRetrieve: ['title', 'primary_keywords'],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract suggestions from titles and keywords
    const suggestions = new Set<string>()
    
    data.hits.forEach((hit: { title: string; primary_keywords: string[] }) => {
      // Add title words that match the query
      const titleWords = hit.title.toLowerCase().split(' ')
      titleWords.forEach((word: string) => {
        if (word.includes(query.toLowerCase()) && word.length > 2) {
          suggestions.add(word)
        }
      })

      // Add matching keywords
      hit.primary_keywords.forEach((keyword: string) => {
        if (keyword.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(keyword)
        }
      })
    })

    return NextResponse.json({
      suggestions: Array.from(suggestions).slice(0, limit)
    })
  } catch (error) {
    console.error('Suggestions API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
