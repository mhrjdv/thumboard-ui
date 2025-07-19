'use client'

import * as React from 'react'
import { SearchWithSuggestions } from '@/components/ui/search-with-suggestions'
import { FilterPanel } from '@/components/ui/filter-panel'
import { ThumbnailGrid } from '@/components/ui/thumbnail-grid'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useFilters } from '@/hooks/use-filters'
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
  const [searchValue, setSearchValue] = React.useState('')

  const [isMobile, setIsMobile] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [filtersCollapsed, setFiltersCollapsed] = React.useState(false)
  const [viewLayout, setViewLayout] = React.useState<'grid-3' | 'grid-5'>('grid-3')

  // Additional debouncing for performance
  const debouncedFilters = useDebounce(filters, 300)
  const debouncedSearchValue = useDebounce(searchValue, 300)

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
    onSearch?.(debouncedSearchValue)
  }, [debouncedSearchValue, onSearch])

  const handleSearch = React.useCallback((query: string) => {
    setSearchValue(query)
    onSearch?.(query)
  }, [onSearch])

  const handleSearchChange = React.useCallback((query: string) => {
    setSearchValue(query)
  }, [])

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <SkipLinks />

      {/* Header with Search and Sidebar Toggle */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo - Aligned with sidebar */}
            <div className="flex-shrink-0 lg:-ml-8">
              <Link href="/" className="block">
                <Logo width={120} height={32} priority />
              </Link>
            </div>

            {/* Desktop Search - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto" id="search">
              <ErrorBoundary>
                <SearchWithSuggestions
                  placeholder="Search thumbnails, channels, keywords..."
                  value={searchValue}
                  onSearch={handleSearch}
                  onChange={handleSearchChange}
                  onSuggestionSelect={(suggestion) => handleSearch(suggestion.text)}
                  autoFocus={!isMobile}
                />
              </ErrorBoundary>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Know More Button - Hidden on mobile, shown on desktop */}
              <div className="hidden md:block">
                <Button asChild variant="ghost" size="sm" >
                  <Link href="/know-more">
                    Know More
                  </Link>
                </Button>
              </div>

              {/* Mobile Know More Button - Only shown on mobile */}
              <div className="md:hidden">
                <Button asChild variant="ghost" size="sm" className="px-2">
                  <Link href="/know-more" className="flex items-center gap-1">
                    <span className="text-sm">Know More</span>
                    <svg className="w-3 h-3 transform rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </Link>
                </Button>
              </div>

              {/* Theme Toggle */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar and Controls - Below header on mobile */}
      <div className="md:hidden sticky top-[73px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <ErrorBoundary>
            <SearchWithSuggestions
              placeholder="Search thumbnails, channels, keywords..."
              value={searchValue}
              onSearch={handleSearch}
              onChange={handleSearchChange}
              onSuggestionSelect={(suggestion) => handleSearch(suggestion.text)}
              autoFocus={false}
            />
          </ErrorBoundary>
        </div>

        {/* Mobile Filter Button */}
        <div className="px-4 pb-3">
          <ErrorBoundary>
            <FilterPanel
              filters={filters}
              onFiltersChange={updateFilters}
              filterGroups={filterGroupsWithCounts}
              isMobile={true}
              className="w-full"
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-[85px] left-0 z-30 h-[calc(100vh-85px)] bg-background border-r transition-all duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          filtersCollapsed ? 'w-16 lg:w-16' : 'w-80 lg:w-80',
          !sidebarOpen && 'lg:w-0 lg:border-r-0'
        )}>
          {sidebarOpen && (
            <div className="h-full overflow-y-auto">
              <div className={cn(
                'p-4 sm:p-6',
                filtersCollapsed && 'p-2'
              )}>
                <ErrorBoundary>
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={updateFilters}
                    filterGroups={filterGroupsWithCounts}
                    isMobile={false}
                    isCollapsed={filtersCollapsed}
                    onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
                  />
                </ErrorBoundary>
              </div>
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
          'p-6 lg:p-8 lg:pr-12',
          'lg:flex lg:flex-col lg:items-center'
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
              viewLayout={viewLayout}
              onViewLayoutChange={setViewLayout}
            />
          </ErrorBoundary>
        </main>
      </div>


    </div>
  )
}
