import { NextRequest, NextResponse } from 'next/server'

const MEILISEARCH_URL = process.env.MEILISEARCH_URL || 'https://api.thumboard.in'
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || 'UQtp0G7rendEVtVzssxbGOwqP030IhXh3040m5HQQsCQMvaMlGVJ91l3bKjf9FlQmRUCxD9nelf6yOZ3aHrNAgU0Jg37FsS4xJ4ljC6iz3S3Gijb88MODkgmbhFsAhxe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${MEILISEARCH_URL}/indexes/thumbnails/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
