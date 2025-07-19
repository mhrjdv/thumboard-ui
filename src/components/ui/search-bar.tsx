'use client'

import * as React from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebouncedSearch } from '@/hooks/use-debounced-value'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onChange?: (query: string) => void
  onClear?: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showClearButton?: boolean
  autoFocus?: boolean
}

export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  onChange,
  onClear,
  loading = false,
  disabled = false,
  className,
  size = 'md',
  showClearButton = true,
  autoFocus = false,
}: SearchBarProps) {
  const { searchValue, debouncedSearchValue, setSearchValue } = useDebouncedSearch()
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Call onChange when search value changes (immediate)
  React.useEffect(() => {
    onChange?.(searchValue)
  }, [searchValue, onChange])

  // Call onSearch when debounced value changes (including empty string for real-time)
  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchValue)
    }
  }, [debouncedSearchValue, onSearch])

  const handleClear = () => {
    setSearchValue('')
    onClear?.()
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch?.(searchValue)
    }
  }

  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <div className="relative flex-1">
        <Search 
          className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground',
            iconSizes[size]
          )} 
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoFocus={autoFocus}
          className={cn(
            'pl-10 pr-10 search-focus',
            sizeClasses[size],
            showClearButton && searchValue && 'pr-16'
          )}
          aria-label="Search input"
          role="searchbox"
        />
        
        {/* Loading indicator, clear button, or Command+K indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {loading && (
            <Loader2 className={cn('animate-spin text-muted-foreground', iconSizes[size])} />
          )}

          {showClearButton && searchValue && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className={cn('text-muted-foreground hover:text-foreground', iconSizes[size])} />
            </Button>
          )}

          {/* Command+K indicator */}
          {!loading && !searchValue && (
            <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded border">
              <span className="font-mono">⌘</span>
              <span>K</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
