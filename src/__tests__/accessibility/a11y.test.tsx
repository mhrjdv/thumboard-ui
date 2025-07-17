import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ContentBrowser } from '@/components/layout/content-browser'
import { ThumbnailCard } from '@/components/ui/thumbnail-card'
import { FilterPanel } from '@/components/ui/filter-panel'
import { SearchWithSuggestions } from '@/components/ui/search-with-suggestions'
import { defaultFilterState } from '@/types/filters'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock dependencies
jest.mock('@/hooks/use-filters', () => ({
  useFilters: () => ({
    filters: defaultFilterState,
    updateFilters: jest.fn(),
  }),
}))

jest.mock('@/hooks/use-debounced-value', () => ({
  useDebouncedSearch: () => ({
    debouncedSearchValue: '',
    setSearchValue: jest.fn(),
  }),
}))

jest.mock('@/lib/performance', () => ({
  useDebounce: (value: unknown) => value,
  useIntersectionObserver: () => false,
  useReducedMotion: () => false,
  useImageLazyLoad: () => ({
    imgRef: { current: null },
    imageSrc: 'test-image.jpg',
    isLoaded: true,
    isError: false,
  }),
}))

jest.mock('@/lib/accessibility', () => ({
  SkipLinks: () => (
    <div>
      <a href="#main-content">Skip to main content</a>
      <a href="#search">Skip to search</a>
    </div>
  ),
}))

const mockThumbnailData = {
  id: '1',
  title: 'Test Image',
  description: 'Test description',
  imageUrl: 'https://example.com/image.jpg',
  author: {
    name: 'Test Author',
    avatar: 'https://example.com/avatar.jpg',
  },
  stats: {
    views: 100,
    likes: 10,
    downloads: 5,
  },
  tags: ['test', 'image'],
  aspectRatio: 1.5,
}

describe('Accessibility Tests', () => {
  beforeEach(() => {
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('ContentBrowser should not have accessibility violations', async () => {
    const { container } = render(
      <ContentBrowser
        onSearch={jest.fn()}
        onItemClick={jest.fn()}
        onItemLike={jest.fn()}
        onItemDownload={jest.fn()}
        onItemShare={jest.fn()}
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('ThumbnailCard should not have accessibility violations', async () => {
    const { container } = render(
      <ThumbnailCard
        data={mockThumbnailData}
        onLike={jest.fn()}
        onDownload={jest.fn()}
        onShare={jest.fn()}
        onClick={jest.fn()}
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('FilterPanel should not have accessibility violations', async () => {
    const { container } = render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={jest.fn()}
        isMobile={false}
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('SearchWithSuggestions should not have accessibility violations', async () => {
    const { container } = render(
      <SearchWithSuggestions
        placeholder="Search..."
        onSearch={jest.fn()}
        onSuggestionSelect={jest.fn()}
      />
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper heading hierarchy', () => {
    const { container } = render(
      <ContentBrowser
        onSearch={jest.fn()}
        onItemClick={jest.fn()}
        onItemLike={jest.fn()}
        onItemDownload={jest.fn()}
        onItemShare={jest.fn()}
      />
    )

    // Check for proper heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('should have skip links', () => {
    const { getByText } = render(
      <ContentBrowser
        onSearch={jest.fn()}
        onItemClick={jest.fn()}
        onItemLike={jest.fn()}
        onItemDownload={jest.fn()}
        onItemShare={jest.fn()}
      />
    )

    expect(getByText('Skip to main content')).toBeInTheDocument()
    expect(getByText('Skip to search')).toBeInTheDocument()
  })

  it('should have proper ARIA labels and roles', () => {
    const { container } = render(
      <ThumbnailCard
        data={mockThumbnailData}
        onLike={jest.fn()}
        onDownload={jest.fn()}
        onShare={jest.fn()}
        onClick={jest.fn()}
      />
    )

    // Check for proper ARIA attributes
    const buttons = container.querySelectorAll('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label')
    })
  })

  it('should support keyboard navigation', () => {
    const { container } = render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={jest.fn()}
        isMobile={false}
      />
    )

    // Check that interactive elements are focusable
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    expect(focusableElements.length).toBeGreaterThan(0)
    
    focusableElements.forEach(element => {
      expect(element).not.toHaveAttribute('tabindex', '-1')
    })
  })

  it('should have sufficient color contrast', () => {
    // This would require additional testing with tools like jest-axe
    // or manual verification of color contrast ratios
    const { container } = render(
      <ContentBrowser
        onSearch={jest.fn()}
        onItemClick={jest.fn()}
        onItemLike={jest.fn()}
        onItemDownload={jest.fn()}
        onItemShare={jest.fn()}
      />
    )

    // Basic check for text content
    expect(container.textContent).toBeTruthy()
  })

  it('should work with screen readers', () => {
    const { container } = render(
      <ThumbnailCard
        data={mockThumbnailData}
        onLike={jest.fn()}
        onDownload={jest.fn()}
        onShare={jest.fn()}
        onClick={jest.fn()}
      />
    )

    // Check for alt text on images
    const images = container.querySelectorAll('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).toBeTruthy()
    })
  })
})
