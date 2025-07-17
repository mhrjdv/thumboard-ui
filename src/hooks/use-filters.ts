'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { FilterState, defaultFilterState, filterGroups } from '@/types/filters'
import { useFilterStats } from './use-thumbnails'

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>(defaultFilterState)
  const { stats } = useFilterStats()

  // Parse URL parameters into filter state
  const parseFiltersFromURL = useCallback(() => {
    const urlFilters: FilterState = { ...defaultFilterState }
    
    // Parse array parameters
    const categories = searchParams.get('categories')
    if (categories) urlFilters.categories = categories.split(',')
    
    const emotions = searchParams.get('emotions')
    if (emotions) urlFilters.emotions = emotions.split(',')
    
    const types = searchParams.get('types')
    if (types) urlFilters.types = types.split(',')
    
    const colors = searchParams.get('colors')
    if (colors) urlFilters.colors = colors.split(',')

    // Parse MeiliSearch specific filters
    const face_presence = searchParams.get('face_presence')
    if (face_presence) urlFilters.face_presence = face_presence.split(',')

    const layout_style = searchParams.get('layout_style')
    if (layout_style) urlFilters.layout_style = layout_style.split(',')

    const keywords = searchParams.get('keywords')
    if (keywords) urlFilters.keywords = keywords.split(',')

    // Parse price range
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      urlFilters.priceRange = {
        min: minPrice ? parseInt(minPrice) : defaultFilterState.priceRange.min,
        max: maxPrice ? parseInt(maxPrice) : defaultFilterState.priceRange.max,
      }
    }
    
    // Parse date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate || endDate) {
      urlFilters.dateRange = {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? new Date(endDate) : undefined,
      }
    }
    
    // Parse sort
    const sortBy = searchParams.get('sortBy')
    const sortDirection = searchParams.get('sortDirection')
    if (sortBy) urlFilters.sortBy = sortBy
    if (sortDirection && (sortDirection === 'asc' || sortDirection === 'desc')) {
      urlFilters.sortDirection = sortDirection
    }
    
    return urlFilters
  }, [searchParams])

  // Update URL with current filter state
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    // Add array parameters
    if (newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','))
    }
    if (newFilters.emotions.length > 0) {
      params.set('emotions', newFilters.emotions.join(','))
    }
    if (newFilters.types.length > 0) {
      params.set('types', newFilters.types.join(','))
    }
    if (newFilters.colors.length > 0) {
      params.set('colors', newFilters.colors.join(','))
    }

    // Add MeiliSearch specific filters
    if (newFilters.face_presence.length > 0) {
      params.set('face_presence', newFilters.face_presence.join(','))
    }
    if (newFilters.layout_style.length > 0) {
      params.set('layout_style', newFilters.layout_style.join(','))
    }
    if (newFilters.keywords.length > 0) {
      params.set('keywords', newFilters.keywords.join(','))
    }

    // Add price range
    if (newFilters.priceRange.min !== defaultFilterState.priceRange.min) {
      params.set('minPrice', newFilters.priceRange.min.toString())
    }
    if (newFilters.priceRange.max !== defaultFilterState.priceRange.max) {
      params.set('maxPrice', newFilters.priceRange.max.toString())
    }
    
    // Add date range
    if (newFilters.dateRange.start) {
      params.set('startDate', newFilters.dateRange.start.toISOString().split('T')[0])
    }
    if (newFilters.dateRange.end) {
      params.set('endDate', newFilters.dateRange.end.toISOString().split('T')[0])
    }
    
    // Add sort
    if (newFilters.sortBy !== defaultFilterState.sortBy) {
      params.set('sortBy', newFilters.sortBy)
    }
    if (newFilters.sortDirection !== defaultFilterState.sortDirection) {
      params.set('sortDirection', newFilters.sortDirection)
    }
    
    // Update URL
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newURL, { scroll: false })
  }, [pathname, router])

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters = parseFiltersFromURL()
    setFilters(urlFilters)
  }, [parseFiltersFromURL])

  // Update filters and URL
  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }, [updateURL])

  // Clear all filters
  const clearFilters = useCallback(() => {
    updateFilters(defaultFilterState)
  }, [updateFilters])

  // Update specific filter
  const updateFilter = useCallback((key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    const newFilters = { ...filters, [key]: value }
    updateFilters(newFilters)
  }, [filters, updateFilters])

  // Check if filters are active
  const hasActiveFilters = useCallback(() => {
    return (
      filters.categories.length > 0 ||
      filters.emotions.length > 0 ||
      filters.types.length > 0 ||
      filters.colors.length > 0 ||
      filters.priceRange.min !== defaultFilterState.priceRange.min ||
      filters.priceRange.max !== defaultFilterState.priceRange.max ||
      filters.dateRange.start !== undefined ||
      filters.dateRange.end !== undefined ||
      filters.sortBy !== defaultFilterState.sortBy ||
      filters.sortDirection !== defaultFilterState.sortDirection
    )
  }, [filters])

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    let count = 0
    count += filters.categories.length
    count += filters.emotions.length
    count += filters.types.length
    count += filters.colors.length
    count += filters.face_presence.length
    count += filters.layout_style.length
    count += filters.keywords.length
    if (filters.dateRange.start || filters.dateRange.end) count += 1
    if (filters.priceRange.min > defaultFilterState.priceRange.min ||
        filters.priceRange.max < defaultFilterState.priceRange.max) count += 1
    return count
  }, [filters])

  // Get filter groups with real counts from MeiliSearch
  const getFilterGroupsWithCounts = useCallback(() => {
    if (!stats?.facets) return filterGroups

    return filterGroups.map(group => ({
      ...group,
      options: group.options?.map(option => ({
        ...option,
        count: stats.facets[group.id]?.[option.id] || 0,
      })) || [],
    }))
  }, [stats])

  return {
    filters,
    updateFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
    activeFilterCount: getActiveFilterCount(),
    filterGroupsWithCounts: getFilterGroupsWithCounts(),
    stats,
  }
}
