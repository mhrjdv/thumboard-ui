'use client'

import * as React from 'react'
import { SearchWithSuggestions } from '@/components/ui/search-with-suggestions'
import { FilterPanel } from '@/components/ui/filter-panel'
import { ThumbnailGrid } from '@/components/ui/thumbnail-grid'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Logo } from '@/components/ui/logo'
import { useFilters } from '@/hooks/use-filters'
import { useDebouncedSearch } from '@/hooks/use-debounced-value'
import { useDebounce } from '@/lib/performance'
import { SkipLinks } from '@/lib/accessibility'
import { cn } from '@/lib/utils'

interface ContentBrowserProps {
  className?: string
  onSearch?: (query: string) => void
  onItemClick?: (id: string) => void
  onItemLike?: (id: string) => void
  onItemDownload?: (id: string) => void
  onItemShare?: (id: string) => void
}

export function ContentBrowser({
  className,
  onSearch,
  onItemClick,
  onItemLike,
  onItemDownload,
  onItemShare,
}: ContentBrowserProps) {
  const { filters, updateFilters, filterGroupsWithCounts } = useFilters()
  const { debouncedSearchValue, setSearchValue } = useDebouncedSearch()
  const [isMobile, setIsMobile] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  // Additional debouncing for performance
  const debouncedFilters = useDebounce(filters, 300)

  // Handle responsive design and sidebar management
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 // Use lg breakpoint for sidebar
      setIsMobile(mobile)
      // Auto-close sidebar on mobile, auto-open on desktop
      setSidebarOpen(!mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle search
  React.useEffect(() => {
    if (debouncedSearchValue) {
      onSearch?.(debouncedSearchValue)
    }
  }, [debouncedSearchValue, onSearch])

  const handleSearch = (query: string) => {
    setSearchValue(query)
    onSearch?.(query)
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <SkipLinks />

      {/* Header with Search and Sidebar Toggle */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo width={120} height={32} priority />
            </div>

            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"} />
              </svg>
            </button>

            {/* Search Section */}
            <div className="flex-1 max-w-2xl mx-auto" id="search">
              <ErrorBoundary>
                <SearchWithSuggestions
                  placeholder="Search thumbnails, channels, keywords..."
                  onSearch={handleSearch}
                  onSuggestionSelect={(suggestion) => handleSearch(suggestion.text)}
                />
              </ErrorBoundary>
            </div>

            {/* Theme Toggle */}
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-[73px] left-0 z-30 h-[calc(100vh-73px)] w-80 bg-background border-r transition-transform duration-300 ease-in-out overflow-y-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          !sidebarOpen && 'lg:w-0 lg:border-r-0'
        )}>
          {sidebarOpen && (
            <div className="p-6">
              <ErrorBoundary>
                <FilterPanel
                  filters={filters}
                  onFiltersChange={updateFilters}
                  filterGroups={filterGroupsWithCounts}
                  isMobile={isMobile}
                />
              </ErrorBoundary>
            </div>
          )}
        </aside>

        {/* Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          'flex-1 min-w-0 transition-all duration-300 ease-in-out',
          'p-6 lg:p-8'
        )} id="main-content">
          <ErrorBoundary>
            <ThumbnailGrid
              searchParams={{
                query: debouncedSearchValue,
                filters: debouncedFilters,
              }}
              useRealData={true}
              onItemClick={onItemClick}
              onItemLike={onItemLike}
              onItemDownload={onItemDownload}
              onItemShare={onItemShare}
            />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
