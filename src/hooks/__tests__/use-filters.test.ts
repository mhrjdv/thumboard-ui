import { renderHook, act } from '@testing-library/react'
import { useFilters } from '../use-filters'
import { defaultFilterState } from '@/types/filters'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('useFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default filter state', () => {
    const { result } = renderHook(() => useFilters())
    
    expect(result.current.filters).toEqual(defaultFilterState)
    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.activeFilterCount).toBe(0)
  })

  it('updates filters and calls router.push', () => {
    const { result } = renderHook(() => useFilters())
    
    const newFilters = {
      ...defaultFilterState,
      categories: ['photography'],
    }

    act(() => {
      result.current.updateFilters(newFilters)
    })

    expect(result.current.filters).toEqual(newFilters)
    expect(result.current.hasActiveFilters).toBe(true)
    expect(result.current.activeFilterCount).toBe(1)
    expect(mockPush).toHaveBeenCalled()
  })

  it('updates specific filter', () => {
    const { result } = renderHook(() => useFilters())
    
    act(() => {
      result.current.updateFilter('categories', ['design', 'art'])
    })

    expect(result.current.filters.categories).toEqual(['design', 'art'])
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('clears all filters', () => {
    const { result } = renderHook(() => useFilters())
    
    // First set some filters
    act(() => {
      result.current.updateFilters({
        ...defaultFilterState,
        categories: ['photography'],
        emotions: ['calm'],
      })
    })

    expect(result.current.activeFilterCount).toBe(2)

    // Then clear them
    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.filters).toEqual(defaultFilterState)
    expect(result.current.hasActiveFilters).toBe(false)
    expect(result.current.activeFilterCount).toBe(0)
  })

  it('calculates active filter count correctly', () => {
    const { result } = renderHook(() => useFilters())
    
    act(() => {
      result.current.updateFilters({
        ...defaultFilterState,
        categories: ['photography', 'design'],
        emotions: ['calm'],
        colors: ['red', 'blue'],
        priceRange: { min: 10, max: 500 },
      })
    })

    // 2 categories + 1 emotion + 2 colors + 1 price range = 6
    expect(result.current.activeFilterCount).toBe(6)
  })

  it('detects active filters correctly', () => {
    const { result } = renderHook(() => useFilters())
    
    expect(result.current.hasActiveFilters).toBe(false)

    act(() => {
      result.current.updateFilter('sortBy', 'newest')
    })

    expect(result.current.hasActiveFilters).toBe(true)
  })
})
