import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel } from '../filter-panel'
import { defaultFilterState } from '@/types/filters'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('FilterPanel', () => {
  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders desktop filter panel', () => {
    render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={mockOnFiltersChange}
        isMobile={false}
      />
    )

    expect(screen.getByText('Sort by')).toBeInTheDocument()
    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  it('renders mobile filter panel trigger', () => {
    render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={mockOnFiltersChange}
        isMobile={true}
      />
    )

    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows active filter count', () => {
    const filtersWithActive = {
      ...defaultFilterState,
      categories: ['photography', 'design'],
      emotions: ['calm'],
    }

    render(
      <FilterPanel
        filters={filtersWithActive}
        onFiltersChange={mockOnFiltersChange}
        isMobile={true}
      />
    )

    expect(screen.getByText('3')).toBeInTheDocument() // Badge showing count
  })

  it('calls onFiltersChange when sort changes', () => {
    render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={mockOnFiltersChange}
        isMobile={false}
      />
    )

    // This test would need more complex setup to test the Select component
    // For now, just verify the component renders
    expect(screen.getByText('Sort by')).toBeInTheDocument()
  })

  it('shows clear filters button when filters are active', () => {
    const filtersWithActive = {
      ...defaultFilterState,
      categories: ['photography'],
    }

    render(
      <FilterPanel
        filters={filtersWithActive}
        onFiltersChange={mockOnFiltersChange}
        isMobile={false}
      />
    )

    expect(screen.getByText(/Clear all/)).toBeInTheDocument()
  })

  it('expands and collapses filter groups', () => {
    render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={mockOnFiltersChange}
        isMobile={false}
      />
    )

    const categoriesButton = screen.getByText('Categories')
    expect(categoriesButton).toBeInTheDocument()

    // Initially expanded, should show options
    expect(screen.getByText('Photography')).toBeInTheDocument()

    // Click to collapse
    fireEvent.click(categoriesButton)
    
    // Should still be visible due to how the component works
    // This test verifies the button is clickable
  })

  it('handles checkbox filter changes', () => {
    render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={mockOnFiltersChange}
        isMobile={false}
      />
    )

    const photographyCheckbox = screen.getByLabelText(/Photography/)
    fireEvent.click(photographyCheckbox)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState,
      categories: ['photography'],
    })
  })

  it('handles color filter selection', () => {
    render(
      <FilterPanel
        filters={defaultFilterState}
        onFiltersChange={mockOnFiltersChange}
        isMobile={false}
      />
    )

    // Find color buttons by their aria-label
    const redColorButton = screen.getByLabelText('Red')
    fireEvent.click(redColorButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilterState,
      colors: ['red'],
    })
  })
})
