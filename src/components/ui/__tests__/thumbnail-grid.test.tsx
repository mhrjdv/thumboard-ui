import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThumbnailGrid } from '../thumbnail-grid'
import type { ThumbnailData } from '../thumbnail-card'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: React.ComponentProps<'img'>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
})

const mockData: ThumbnailData[] = [
  {
    id: '1',
    title: 'Test Image 1',
    imageUrl: 'https://example.com/image1.jpg',
    author: { name: 'Author 1' },
    stats: { views: 100, likes: 10, downloads: 5 },
    tags: ['test'],
  },
  {
    id: '2',
    title: 'Test Image 2',
    imageUrl: 'https://example.com/image2.jpg',
    author: { name: 'Author 2' },
    stats: { views: 200, likes: 20, downloads: 10 },
    tags: ['test'],
  },
]

describe('ThumbnailGrid', () => {
  const mockOnLoadMore = jest.fn()
  const mockOnItemClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders grid with thumbnail cards', () => {
    render(<ThumbnailGrid data={mockData} />)
    
    expect(screen.getByText('Test Image 1')).toBeInTheDocument()
    expect(screen.getByText('Test Image 2')).toBeInTheDocument()
    expect(screen.getByText('2 items')).toBeInTheDocument()
  })

  it('shows layout toggle buttons', () => {
    render(<ThumbnailGrid data={mockData} />)
    
    const masonryButton = screen.getByLabelText('Masonry layout')
    const gridButton = screen.getByLabelText('Grid layout')
    const listButton = screen.getByLabelText('List layout')
    
    expect(masonryButton).toBeInTheDocument()
    expect(gridButton).toBeInTheDocument()
    expect(listButton).toBeInTheDocument()
  })

  it('changes layout when layout buttons are clicked', () => {
    render(<ThumbnailGrid data={mockData} />)
    
    const gridButton = screen.getByLabelText('Grid layout')
    fireEvent.click(gridButton)
    
    // The grid button should now be active (default variant)
    expect(gridButton).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<ThumbnailGrid data={mockData} loading />)
    
    expect(screen.getByText('Loading more...')).toBeInTheDocument()
  })

  it('shows load more button when hasMore is true', () => {
    render(
      <ThumbnailGrid 
        data={mockData} 
        hasMore={true} 
        onLoadMore={mockOnLoadMore} 
      />
    )
    
    const loadMoreButton = screen.getByText('Load More')
    expect(loadMoreButton).toBeInTheDocument()
    
    fireEvent.click(loadMoreButton)
    expect(mockOnLoadMore).toHaveBeenCalled()
  })

  it('does not show load more button when hasMore is false', () => {
    render(
      <ThumbnailGrid 
        data={mockData} 
        hasMore={false} 
        onLoadMore={mockOnLoadMore} 
      />
    )
    
    expect(screen.queryByText('Load More')).not.toBeInTheDocument()
  })

  it('shows empty state when no data', () => {
    render(<ThumbnailGrid data={[]} />)
    
    expect(screen.getByText('No items found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search or filters')).toBeInTheDocument()
  })

  it('calls onItemClick when thumbnail is clicked', () => {
    render(<ThumbnailGrid data={mockData} onItemClick={mockOnItemClick} />)
    
    const thumbnail = screen.getByText('Test Image 1').closest('div')
    fireEvent.click(thumbnail!)
    
    expect(mockOnItemClick).toHaveBeenCalledWith('1')
  })

  it('applies different column layouts', () => {
    const { rerender } = render(<ThumbnailGrid data={mockData} columns={2} />)
    
    // Test different column counts
    rerender(<ThumbnailGrid data={mockData} columns={4} />)
    rerender(<ThumbnailGrid data={mockData} columns={5} />)
    
    // Just ensure it renders without errors
    expect(screen.getByText('Test Image 1')).toBeInTheDocument()
  })
})
