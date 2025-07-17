import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThumbnailCard, type ThumbnailData } from '../thumbnail-card'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}))

// Mock Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoad, ...props }: React.ComponentProps<'img'> & { onLoad?: () => void }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        {...props}
      />
    )
  }
})

const mockThumbnailData: ThumbnailData = {
  id: '1',
  title: 'Test Image',
  description: 'Test description',
  imageUrl: 'https://example.com/image.jpg',
  author: {
    name: 'Test Author',
    avatar: 'https://example.com/avatar.jpg',
  },
  stats: {
    views: 1000,
    likes: 50,
    downloads: 25,
  },
  tags: ['test', 'image', 'mock'],
  aspectRatio: 4/3,
}

describe('ThumbnailCard', () => {
  const mockOnLike = jest.fn()
  const mockOnDownload = jest.fn()
  const mockOnShare = jest.fn()
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders thumbnail card with data', () => {
    render(<ThumbnailCard data={mockThumbnailData} />)
    
    expect(screen.getByText('Test Image')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    expect(screen.getByText('1,000')).toBeInTheDocument() // views
  })

  it('displays tags correctly', () => {
    render(<ThumbnailCard data={mockThumbnailData} />)
    
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('image')).toBeInTheDocument()
    expect(screen.getByText('mock')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    render(<ThumbnailCard data={mockThumbnailData} onClick={mockOnClick} />)
    
    const card = screen.getByText('Test Image').closest('div')
    fireEvent.click(card!)
    
    expect(mockOnClick).toHaveBeenCalledWith('1')
  })

  it('calls onLike when like button is clicked', () => {
    render(<ThumbnailCard data={mockThumbnailData} onLike={mockOnLike} />)
    
    const likeButton = screen.getByLabelText('Like')
    fireEvent.click(likeButton)
    
    expect(mockOnLike).toHaveBeenCalledWith('1')
  })

  it('calls onDownload when download button is clicked', () => {
    render(<ThumbnailCard data={mockThumbnailData} onDownload={mockOnDownload} />)
    
    const downloadButton = screen.getByLabelText('Download')
    fireEvent.click(downloadButton)
    
    expect(mockOnDownload).toHaveBeenCalledWith('1')
  })

  it('calls onShare when share button is clicked', () => {
    render(<ThumbnailCard data={mockThumbnailData} onShare={mockOnShare} />)
    
    const shareButton = screen.getByLabelText('Share')
    fireEvent.click(shareButton)
    
    expect(mockOnShare).toHaveBeenCalledWith('1')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<ThumbnailCard data={mockThumbnailData} size="sm" />)
    expect(screen.getByText('Test Image')).toBeInTheDocument()

    rerender(<ThumbnailCard data={mockThumbnailData} size="lg" />)
    expect(screen.getByText('Test Image')).toBeInTheDocument()
  })

  it('shows limited tags with overflow indicator', () => {
    const dataWithManyTags = {
      ...mockThumbnailData,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    }
    
    render(<ThumbnailCard data={dataWithManyTags} />)
    
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('tag3')).toBeInTheDocument()
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })
})
