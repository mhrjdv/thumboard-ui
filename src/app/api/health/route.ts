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
    const response = await fetch(`${MEILISEARCH_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${MEILISEARCH_API_KEY}`,
      },
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
    console.error('Health API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
