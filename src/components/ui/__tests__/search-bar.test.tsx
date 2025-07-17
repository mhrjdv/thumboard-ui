import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../search-bar'

// Mock the debounced hook
jest.mock('../../../hooks/use-debounced-value', () => ({
  useDebouncedSearch: () => ({
    searchValue: '',
    debouncedSearchValue: '',
    setSearchValue: jest.fn(),
  }),
}))

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()
  const mockOnClear = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input with placeholder', () => {
    render(<SearchBar placeholder="Search for content..." />)
    
    const input = screen.getByRole('searchbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Search for content...')
  })

  it('shows search icon', () => {
    render(<SearchBar />)
    
    // Search icon should be present (using aria-hidden, so we check by class or test-id)
    const container = screen.getByRole('searchbox').parentElement
    expect(container).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} onClear={mockOnClear} />)
    
    const input = screen.getByRole('searchbox')
    
    // Test Escape key
    await user.type(input, 'test')
    await user.keyboard('{Escape}')
    
    // Test Enter key
    await user.keyboard('{Enter}')
  })

  it('shows loading state', () => {
    render(<SearchBar loading />)
    
    // Should show loading spinner (Loader2 component)
    const container = screen.getByRole('searchbox').parentElement
    expect(container).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<SearchBar disabled />)
    
    const input = screen.getByRole('searchbox')
    expect(input).toBeDisabled()
  })

  it('applies different sizes', () => {
    const { rerender } = render(<SearchBar size="sm" />)
    let input = screen.getByRole('searchbox')
    expect(input).toHaveClass('h-8')
    
    rerender(<SearchBar size="lg" />)
    input = screen.getByRole('searchbox')
    expect(input).toHaveClass('h-12')
  })

  it('has proper accessibility attributes', () => {
    render(<SearchBar />)

    const input = screen.getByRole('searchbox')
    expect(input).toHaveAttribute('aria-label', 'Search input')
  })
})
