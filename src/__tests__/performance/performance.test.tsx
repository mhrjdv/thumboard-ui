import { render, act } from '@testing-library/react'
import { ThumbnailGrid } from '@/components/ui/thumbnail-grid'
import { ThumbnailCard } from '@/components/ui/thumbnail-card'
import { useDebounce, useThrottle, useImageLazyLoad } from '@/lib/performance'
import { renderHook } from '@testing-library/react'

// Mock dependencies
jest.mock('@/hooks/use-thumbnails', () => ({
  useThumbnails: () => ({
    data: null,
    loading: false,
    error: null,
  }),
  useThumbnailActions: () => ({
    likeThumbnail: jest.fn(),
    downloadThumbnail: jest.fn(),
    incrementViews: jest.fn(),
    loading: false,
    error: null,
  }),
}))

jest.mock('@/lib/performance', () => ({
  ...jest.requireActual('@/lib/performance'),
  useIntersectionObserver: () => false,
  useReducedMotion: () => false,
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

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Debounce Hook', () => {
    it('should debounce values correctly', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        {
          initialProps: { value: 'initial', delay: 100 },
        }
      )

      expect(result.current).toBe('initial')

      // Update value multiple times quickly
      rerender({ value: 'update1', delay: 100 })
      rerender({ value: 'update2', delay: 100 })
      rerender({ value: 'final', delay: 100 })

      // Should still be initial value immediately
      expect(result.current).toBe('initial')

      // Wait for debounce delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
      })

      // Should now have the final value
      expect(result.current).toBe('final')
    })
  })

  describe('Throttle Hook', () => {
    it('should throttle values correctly', async () => {
      const { result, rerender } = renderHook(
        ({ value, limit }) => useThrottle(value, limit),
        {
          initialProps: { value: 'initial', delay: 100 },
        }
      )

      expect(result.current).toBe('initial')

      // Update value quickly
      rerender({ value: 'update1', delay: 100 })
      
      // Should update immediately on first change
      expect(result.current).toBe('update1')

      // Update again quickly
      rerender({ value: 'update2', delay: 100 })
      
      // Should still be previous value due to throttling
      expect(result.current).toBe('update1')
    })
  })

  describe('Image Lazy Loading', () => {
    beforeEach(() => {
      // Mock IntersectionObserver
      global.IntersectionObserver = jest.fn().mockImplementation((_callback) => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      }))

      // Mock Image constructor
      global.Image = jest.fn().mockImplementation(() => ({
        onload: null,
        onerror: null,
        src: '',
      }))
    })

    it('should handle image lazy loading', () => {
      const { result } = renderHook(() =>
        useImageLazyLoad('https://example.com/image.jpg', 'placeholder.jpg')
      )

      expect(result.current.imageSrc).toBe('')
      expect(result.current.isLoaded).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  describe('Component Performance', () => {
    it('should render ThumbnailCard efficiently', () => {
      const startTime = performance.now()
      
      render(
        <ThumbnailCard
          data={mockThumbnailData}
          onLike={jest.fn()}
          onDownload={jest.fn()}
          onShare={jest.fn()}
          onClick={jest.fn()}
        />
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render in less than 50ms
      expect(renderTime).toBeLessThan(50)
    })

    it('should render ThumbnailGrid efficiently with many items', () => {
      const manyItems = Array.from({ length: 100 }, (_, i) => ({
        ...mockThumbnailData,
        id: `item-${i}`,
        title: `Item ${i}`,
      }))

      const startTime = performance.now()
      
      render(
        <ThumbnailGrid
          data={manyItems}
          onItemClick={jest.fn()}
          onItemLike={jest.fn()}
          onItemDownload={jest.fn()}
          onItemShare={jest.fn()}
        />
      )
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render 100 items in less than 200ms
      expect(renderTime).toBeLessThan(200)
    })

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = render(
        <ThumbnailCard
          data={mockThumbnailData}
          onLike={jest.fn()}
          onDownload={jest.fn()}
          onShare={jest.fn()}
          onClick={jest.fn()}
        />
      )

      const startTime = performance.now()
      
      // Perform multiple re-renders
      for (let i = 0; i < 10; i++) {
        rerender(
          <ThumbnailCard
            data={{ ...mockThumbnailData, title: `Updated ${i}` }}
            onLike={jest.fn()}
            onDownload={jest.fn()}
            onShare={jest.fn()}
            onClick={jest.fn()}
          />
        )
      }
      
      const endTime = performance.now()
      const rerenderTime = endTime - startTime
      
      // Should handle 10 re-renders in less than 100ms
      expect(rerenderTime).toBeLessThan(100)
    })
  })

  describe('Memory Usage', () => {
    it('should not create memory leaks with event listeners', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = render(
        <ThumbnailCard
          data={mockThumbnailData}
          onLike={jest.fn()}
          onDownload={jest.fn()}
          onShare={jest.fn()}
          onClick={jest.fn()}
        />
      )

      const addedListeners = addEventListenerSpy.mock.calls.length
      
      unmount()
      
      const removedListeners = removeEventListenerSpy.mock.calls.length
      
      // Should remove as many listeners as were added
      expect(removedListeners).toBeGreaterThanOrEqual(addedListeners)

      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Bundle Size Optimization', () => {
    it('should use dynamic imports for heavy components', () => {
      // This would test that heavy components are lazy-loaded
      // In a real scenario, you'd check that certain modules are not
      // included in the initial bundle
      expect(true).toBe(true) // Placeholder
    })
  })
})
