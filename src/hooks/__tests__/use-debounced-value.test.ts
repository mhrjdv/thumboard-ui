import { renderHook, act } from '@testing-library/react'
import { useDebouncedValue, useDebouncedSearch } from '../use-debounced-value'

// Mock timers
jest.useFakeTimers()

describe('useDebouncedValue', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    expect(result.current).toBe('initial')

    // Change the value
    rerender({ value: 'updated', delay: 300 })
    expect(result.current).toBe('initial') // Should still be initial

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('updated')
  })

  it('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'first' })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    rerender({ value: 'second' })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    rerender({ value: 'final' })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('final')
  })
})

describe('useDebouncedSearch', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('returns search utilities', () => {
    const { result } = renderHook(() => useDebouncedSearch())
    
    expect(result.current).toHaveProperty('searchValue')
    expect(result.current).toHaveProperty('debouncedSearchValue')
    expect(result.current).toHaveProperty('setSearchValue')
    expect(typeof result.current.setSearchValue).toBe('function')
  })

  it('uses initial value', () => {
    const { result } = renderHook(() => useDebouncedSearch('initial search'))
    
    expect(result.current.searchValue).toBe('initial search')
    expect(result.current.debouncedSearchValue).toBe('initial search')
  })

  it('debounces search value', () => {
    const { result } = renderHook(() => useDebouncedSearch('', 300))

    act(() => {
      result.current.setSearchValue('test query')
    })

    expect(result.current.searchValue).toBe('test query')
    expect(result.current.debouncedSearchValue).toBe('')

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.debouncedSearchValue).toBe('test query')
  })
})
