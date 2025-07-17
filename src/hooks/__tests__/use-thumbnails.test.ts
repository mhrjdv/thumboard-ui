import { renderHook, waitFor } from '@testing-library/react'
import { useThumbnails, useThumbnail, useThumbnailActions } from '../use-thumbnails'
import { defaultFilterState } from '@/types/filters'

// Mock the database service
jest.mock('../../lib/db', () => ({
  dbService: {
    searchThumbnails: jest.fn(),
    getThumbnailById: jest.fn(),
    likeThumbnail: jest.fn(),
    downloadThumbnail: jest.fn(),
    incrementViews: jest.fn(),
  },
}))

import { dbService as mockDbService } from '../../lib/db'

describe('useThumbnails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches thumbnails on mount', async () => {
    const mockData = {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      hasMore: false,
    }

    mockDbService.searchThumbnails.mockResolvedValue({
      data: mockData,
      error: null,
      loading: false,
    })

    const { result } = renderHook(() =>
      useThumbnails({
        filters: defaultFilterState,
      })
    )

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(mockDbService.searchThumbnails).toHaveBeenCalledWith({
      filters: defaultFilterState,
    })
  })

  it('handles errors', async () => {
    const errorMessage = 'Failed to fetch thumbnails'
    mockDbService.searchThumbnails.mockResolvedValue({
      data: null,
      error: errorMessage,
      loading: false,
    })

    const { result } = renderHook(() =>
      useThumbnails({
        filters: defaultFilterState,
      })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe(errorMessage)
  })

  it('refetches data when called', async () => {
    mockDbService.searchThumbnails.mockResolvedValue({
      data: { data: [], total: 0, page: 1, limit: 20, hasMore: false },
      error: null,
      loading: false,
    })

    const { result } = renderHook(() =>
      useThumbnails({
        filters: defaultFilterState,
      })
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockDbService.searchThumbnails).toHaveBeenCalledTimes(1)

    result.current.refetch()

    await waitFor(() => {
      expect(mockDbService.searchThumbnails).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useThumbnail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches single thumbnail', async () => {
    const mockThumbnail = {
      id: '1',
      title: 'Test Thumbnail',
      description: 'Test description',
      image_url: 'https://example.com/image.jpg',
      author_id: 'author1',
      author_name: 'Test Author',
      author_avatar: null,
      category: 'photography',
      emotion: 'calm',
      content_type: 'image',
      tags: ['test'],
      color_palette: ['blue'],
      views: 100,
      likes: 10,
      downloads: 5,
      price: 0,
      is_free: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      aspect_ratio: 1,
    }

    mockDbService.getThumbnailById.mockResolvedValue({
      data: mockThumbnail,
      error: null,
      loading: false,
    })

    const { result } = renderHook(() => useThumbnail('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockThumbnail)
    expect(result.current.error).toBeNull()
    expect(mockDbService.getThumbnailById).toHaveBeenCalledWith('1')
  })
})

describe('useThumbnailActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('likes thumbnail successfully', async () => {
    mockDbService.likeThumbnail.mockResolvedValue({
      data: true,
      error: null,
      loading: false,
    })

    const { result } = renderHook(() => useThumbnailActions())

    const liked = await result.current.likeThumbnail('1', 'user1')

    expect(liked).toBe(true)
    expect(mockDbService.likeThumbnail).toHaveBeenCalledWith('1', 'user1')
  })

  it('downloads thumbnail successfully', async () => {
    mockDbService.downloadThumbnail.mockResolvedValue({
      data: true,
      error: null,
      loading: false,
    })

    const { result } = renderHook(() => useThumbnailActions())

    const downloaded = await result.current.downloadThumbnail('1', 'user1')

    expect(downloaded).toBe(true)
    expect(mockDbService.downloadThumbnail).toHaveBeenCalledWith('1', 'user1')
  })

  it('increments views successfully', async () => {
    mockDbService.incrementViews.mockResolvedValue({
      data: true,
      error: null,
      loading: false,
    })

    const { result } = renderHook(() => useThumbnailActions())

    const incremented = await result.current.incrementViews('1')

    expect(incremented).toBe(true)
    expect(mockDbService.incrementViews).toHaveBeenCalledWith('1')
  })
})
