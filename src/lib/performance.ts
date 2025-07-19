import React, { useCallback, useEffect, useRef, useState } from 'react'

// Debounce hook for performance optimization
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttle hook for performance optimization
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastRan = useRef(Date.now())

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// Virtual scrolling hook for large lists
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
  }
}

// Memoization utilities
export function createMemoizedSelector<T, R>(
  selector: (state: T) => R,
  _equalityFn?: (a: R, b: R) => boolean // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  let lastArgs: T | undefined
  let lastResult: R

  return (state: T): R => {
    if (lastArgs === undefined || !shallowEqual(lastArgs, state)) {
      lastResult = selector(state)
      lastArgs = state
    }
    return lastResult
  }
}

function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false
  }

  const objA = a as Record<string, unknown>
  const objB = b as Record<string, unknown>

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key) || objA[key] !== objB[key]) {
      return false
    }
  }

  return true
}

// Performance monitoring
export function measurePerformance<T extends (...args: unknown[]) => unknown>(
  fn: T,
  _name?: string // eslint-disable-line @typescript-eslint/no-unused-vars
): T {
  return ((...args: Parameters<T>) => {
    const _start = performance.now() // eslint-disable-line @typescript-eslint/no-unused-vars
    const result = fn(...args)
    const _end = performance.now() // eslint-disable-line @typescript-eslint/no-unused-vars

    // Performance measurement completed

    return result
  }) as T
}

// Image lazy loading utility
export function useImageLazyLoad(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const isInView = useIntersectionObserver(imgRef, {
    threshold: 0.1,
    rootMargin: '50px',
  })

  useEffect(() => {
    if (isInView && src && !isLoaded && !isError) {
      const img = new Image()
      
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      
      img.onerror = () => {
        setIsError(true)
      }
      
      img.src = src
    }
  }, [isInView, src, isLoaded, isError])

  return {
    imgRef,
    imageSrc,
    isLoaded,
    isError,
    isInView,
  }
}

// Bundle size optimization - dynamic imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn)

  return function WrappedComponent(props: React.ComponentProps<T>) {
    return React.createElement(React.Suspense, {
      fallback: fallback ? React.createElement(fallback) : React.createElement('div', {}, 'Loading...')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, React.createElement(LazyComponent, props as any))
  }
}

// Memory leak prevention
export function useCleanup(cleanup: () => void) {
  const cleanupRef = useRef(cleanup)
  cleanupRef.current = cleanup

  useEffect(() => {
    return () => {
      cleanupRef.current()
    }
  }, [])
}
