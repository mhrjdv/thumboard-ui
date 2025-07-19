'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

/**
 * Enhanced infinite scroll hook using Intersection Observer API
 * Follows Next.js best practices for performance and user experience
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '200px',
  enabled = true,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastCallTimeRef = useRef<number>(0)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      const now = Date.now()

      // Debounce calls to prevent rapid firing
      if (now - lastCallTimeRef.current < 200) {
        return
      }

      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        enabled
      ) {
        lastCallTimeRef.current = now
        onLoadMore()
      }
    },
    [hasMore, isLoading, onLoadMore, enabled]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !enabled) return

    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observerRef.current.observe(sentinel)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleIntersection, threshold, rootMargin, enabled])

  return sentinelRef
}
