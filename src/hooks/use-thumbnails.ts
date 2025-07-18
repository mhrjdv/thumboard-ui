'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { dbService, type SearchParams, type SearchResult, type Thumbnail } from '@/lib/db'
import { meiliSearchService } from '@/lib/meilisearch'

export function useThumbnails(searchParams: SearchParams) {
  const [data, setData] = useState<SearchResult | null>(null)
  const [allData, setAllData] = useState<Thumbnail[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Reset when search params change
  const paramsKey = JSON.stringify(searchParams)
  const prevParamsKey = useRef<string>('')

  const fetchThumbnails = useCallback(async (pageNum: number = 1, append: boolean = false, retryCount: number = 0) => {
    // Prevent infinite loops
    if (retryCount > 3) {
      setError('Failed to load thumbnails after multiple attempts')
      setLoading(false)
      setLoadingMore(false)
      return
    }

    if (pageNum === 1) {
      setLoading(true)
      setAllData([])
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      // Increased page size for better infinite scroll performance
      const dynamicLimit = pageNum === 1 ? 50 : 50 // Consistent page size for better UX

      const result = await dbService.searchThumbnails({
        ...searchParams,
        page: pageNum,
        limit: dynamicLimit,
      })

      if (result.error) {
        // Retry on error with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
          setTimeout(() => {
            fetchThumbnails(pageNum, append, retryCount + 1)
          }, delay)
          return
        }

        setError(result.error)
        if (pageNum === 1) {
          setData(null)
          setAllData([])
        }
      } else if (result.data) {

        setData(result.data)
        
        // Calculate hasMore based on total loaded vs total available
        const newTotalLoaded = append ? totalLoaded + result.data!.data.length : result.data!.data.length
        const newHasMore = newTotalLoaded < result.data!.total



        setHasMore(newHasMore)
        setTotalLoaded(newTotalLoaded)

        if (append && pageNum > 1) {
          setAllData(prev => {
            // Prevent duplicates by checking IDs
            const existingIds = new Set(prev.map(item => item.id))
            const newItems = result.data!.data.filter(item => !existingIds.has(item.id))
            const updatedData = [...prev, ...newItems]

            return updatedData
          })
        } else {
          setAllData(result.data.data)
          setIsInitialLoad(false)

        }
      }
    } catch (error) {
      console.error('Fetch thumbnails error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      if (pageNum === 1) {
        setData(null)
        setAllData([])
      }
    }

    setLoading(false)
    setLoadingMore(false)
  }, [searchParams, totalLoaded])

  // Reset and fetch when params change
  useEffect(() => {
    if (paramsKey !== prevParamsKey.current) {
      prevParamsKey.current = paramsKey
      setPage(1)
      setTotalLoaded(0)
      setIsInitialLoad(true)
      setHasMore(true)
      fetchThumbnails(1, false)
    }
  }, [paramsKey, fetchThumbnails])

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchThumbnails(nextPage, true)
    }
  }, [page, loadingMore, hasMore, loading, fetchThumbnails])

  const refetch = useCallback(() => {
    setPage(1)
    setTotalLoaded(0)
    setIsInitialLoad(true)
    setHasMore(true)
    fetchThumbnails(1, false)
  }, [fetchThumbnails])

  return {
    data: data ? { ...data, data: allData } : null,
    loading,
    loadingMore,
    error,
    refetch,
    hasMore,
    loadMore,
    totalLoaded,
    isInitialLoad,
  }
}

export function useThumbnail(id: string) {
  const [data, setData] = useState<Thumbnail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchThumbnail = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    const result = await dbService.getThumbnailById(id)
    
    if (result.error) {
      setError(result.error)
      setData(null)
    } else {
      setData(result.data)
    }
    
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchThumbnail()
  }, [fetchThumbnail])

  return {
    data,
    loading,
    error,
    refetch: fetchThumbnail,
  }
}

export function useThumbnailActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const likeThumbnail = useCallback(async (thumbnailId: string, userId: string = 'anonymous') => {
    setLoading(true)
    setError(null)

    const result = await dbService.likeThumbnail(thumbnailId, userId)
    
    if (result.error) {
      setError(result.error)
    }
    
    setLoading(false)
    return result.data
  }, [])

  const downloadThumbnail = useCallback(async (thumbnailId: string, userId: string = 'anonymous') => {
    setLoading(true)
    setError(null)

    const result = await dbService.downloadThumbnail(thumbnailId, userId)
    
    if (result.error) {
      setError(result.error)
    }
    
    setLoading(false)
    return result.data
  }, [])

  const incrementViews = useCallback(async (thumbnailId: string) => {
    // Don't show loading for view increments
    const result = await dbService.incrementViews(thumbnailId)
    return result.data
  }, [])

  return {
    likeThumbnail,
    downloadThumbnail,
    incrementViews,
    loading,
    error,
  }
}

export function useSuggestions(query: string, enabled: boolean = true) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSuggestions = useCallback(async () => {
    if (!query || query.length < 2 || !enabled) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError(null)

    const result = await meiliSearchService.getSuggestions(query, 5)

    if (result.error) {
      setError(result.error)
      setSuggestions([])
    } else {
      setSuggestions(result.data || [])
    }

    setLoading(false)
  }, [query, enabled])

  useEffect(() => {
    const timeoutId = setTimeout(fetchSuggestions, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [fetchSuggestions])

  return {
    suggestions,
    loading,
    error,
  }
}

export function useFilterStats() {
  const [stats, setStats] = useState<{ total: number; facets: Record<string, Record<string, number>> } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await meiliSearchService.getStats()

    if (result.error) {
      setError(result.error)
      setStats(null)
    } else {
      setStats(result.data)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
