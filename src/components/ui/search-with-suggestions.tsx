'use client'

import * as React from 'react'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { SearchBar } from './search-bar'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useSuggestions } from '@/hooks/use-thumbnails'

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'trending' | 'suggestion'
  count?: number
}

interface SearchWithSuggestionsProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onChange?: (query: string) => void
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  loading?: boolean
  disabled?: boolean
  className?: string
  showSuggestions?: boolean
  value?: string
  autoFocus?: boolean
}

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'nature photography', type: 'trending', count: 1234 },
  { id: '2', text: 'abstract art', type: 'trending', count: 856 },
  { id: '3', text: 'minimalist design', type: 'suggestion' },
  { id: '4', text: 'vintage posters', type: 'suggestion' },
]

const mockRecentSearches = [
  'landscape photos',
  'digital art',
  'logo designs',
]

export function SearchWithSuggestions({
  placeholder = 'Search for images, videos, and more...',
  onSearch,
  onChange,
  onSuggestionSelect,
  suggestions = mockSuggestions,
  recentSearches = mockRecentSearches,
  loading = false,
  disabled = false,
  className,
  showSuggestions = true,
  value = '',
  autoFocus = false,
}: SearchWithSuggestionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [searchQuery, setSearchQuery] = React.useState(value)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Sync internal state with external value
  React.useEffect(() => {
    setSearchQuery(value)
  }, [value])

  // Get real-time suggestions from MeiliSearch
  const { suggestions: meiliSuggestions, loading: suggestionsLoading } = useSuggestions(
    searchQuery,
    searchQuery.length >= 2 && isOpen
  )

  const allSuggestions = React.useMemo(() => {
    const recent = recentSearches.map((text, index) => ({
      id: `recent-${index}`,
      text,
      type: 'recent' as const,
    }))

    // Use MeiliSearch suggestions if available, otherwise fallback to mock suggestions
    const searchSuggestions = meiliSuggestions.length > 0
      ? meiliSuggestions.map((text, index) => ({
          id: `meili-${index}`,
          text,
          type: 'suggestion' as const,
        }))
      : suggestions

    return [...recent, ...searchSuggestions]
  }, [recentSearches, suggestions, meiliSuggestions])

  const handleSearch = React.useCallback((query: string) => {
    setIsOpen(false)
    setSelectedIndex(-1)
    onSearch?.(query)
  }, [onSearch])

  const handleSuggestionClick = React.useCallback((suggestion: SearchSuggestion) => {
    setIsOpen(false)
    setSelectedIndex(-1)
    onSuggestionSelect?.(suggestion)
    onSearch?.(suggestion.text)
  }, [onSearch, onSuggestionSelect])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSuggestionClick(allSuggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }, [isOpen, allSuggestions, selectedIndex, handleSuggestionClick])

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-2xl mx-auto', className)}>
      <div onKeyDown={handleKeyDown}>
        <SearchBar
          placeholder={placeholder}
          value={searchQuery}
          onSearch={handleSearch}
          onChange={(query) => {
            setSearchQuery(query)
            setIsOpen(query.length > 0)
            onChange?.(query)
          }}
          loading={loading || suggestionsLoading}
          disabled={disabled}
          size="lg"
          autoFocus={autoFocus}
          className="w-full"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && isOpen && allSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {recentSearches.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <Button
                    key={`recent-${index}`}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start h-auto p-3 text-left',
                      selectedIndex === index && 'bg-accent'
                    )}
                    onClick={() => handleSuggestionClick({
                      id: `recent-${index}`,
                      text: search,
                      type: 'recent'
                    })}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground mr-3" />
                    <span>{search}</span>
                  </Button>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Trending & Suggestions
                </div>
                {suggestions.map((suggestion, index) => {
                  const adjustedIndex = index + recentSearches.length
                  return (
                    <Button
                      key={suggestion.id}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start h-auto p-3 text-left',
                        selectedIndex === adjustedIndex && 'bg-accent'
                      )}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <span className="ml-3 flex-1">{suggestion.text}</span>
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground">
                          {suggestion.count.toLocaleString()}
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
