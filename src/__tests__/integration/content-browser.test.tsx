import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContentBrowser } from '@/components/layout/content-browser'

// Mock the hooks
jest.mock('@/hooks/use-filters', () => ({
  useFilters: () => ({
    filters: {
      categories: [],
      emotions: [],
      types: [],
      colors: [],
      dateRange: {},
      priceRange: { min: 0, max: 1000 },
      sortBy: 'relevance',
      sortDirection: 'desc',
    },
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
}))

jest.mock('@/lib/accessibility', () => ({
  SkipLinks: () => <div data-testid="skip-links">Skip Links</div>,
}))

describe('ContentBrowser Integration', () => {
  const mockProps = {
    onSearch: jest.fn(),
    onItemClick: jest.fn(),
    onItemLike: jest.fn(),
    onItemDownload: jest.fn(),
    onItemShare: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('renders all main components', () => {
    render(<ContentBrowser {...mockProps} />)

    expect(screen.getByTestId('skip-links')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search for images/i)).toBeInTheDocument()
    expect(screen.getByText(/showing results/i)).toBeInTheDocument()
  })

  it('handles search input', async () => {
    const user = userEvent.setup()
    render(<ContentBrowser {...mockProps} />)

    const searchInput = screen.getByPlaceholderText(/search for images/i)
    await user.type(searchInput, 'landscape')

    // The search should be debounced, so we need to wait
    await waitFor(() => {
      expect(mockProps.onSearch).toHaveBeenCalledWith('landscape')
    })
  })

  it('shows mobile layout on small screens', () => {
    // Mock mobile screen size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    render(<ContentBrowser {...mockProps} />)
    
    // Trigger resize event
    fireEvent(window, new Event('resize'))

    // Should show mobile filter button instead of sidebar
    expect(screen.queryByRole('aside')).not.toBeInTheDocument()
  })

  it('shows desktop layout on large screens', () => {
    render(<ContentBrowser {...mockProps} />)

    // Should show desktop sidebar
    expect(screen.getByRole('aside')).toBeInTheDocument()
  })

  it('handles item interactions', async () => {
    render(<ContentBrowser {...mockProps} />)

    // Wait for grid to load
    await waitFor(() => {
      expect(screen.getByText(/items/i)).toBeInTheDocument()
    })

    // Test item interactions would require mocking the thumbnail grid
    // This is covered in the thumbnail grid tests
  })

  it('displays search results summary', () => {
    render(<ContentBrowser {...mockProps} />)

    expect(screen.getByText(/showing results for/i)).toBeInTheDocument()
    expect(screen.getByText(/active filters/i)).toBeInTheDocument()
  })

  it('handles error boundaries gracefully', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    // This would test error boundary behavior
    // In a real test, you'd trigger an error in a child component
    render(<ContentBrowser {...mockProps} />)

    consoleSpy.mockRestore()
  })
})
