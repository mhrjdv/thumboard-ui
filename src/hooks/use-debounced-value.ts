import { useEffect, useState, useCallback } from 'react'

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
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

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 100 for real-time feel)
 * @returns Object with search value, debounced value, and setter
 */
export function useDebouncedSearch(initialValue = '', delay = 100) {
  const [searchValue, setSearchValue] = useState(initialValue)
  const debouncedSearchValue = useDebouncedValue(searchValue, delay)

  const stableSetSearchValue = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue: stableSetSearchValue,
  }
}
