import { MockDatabaseService } from '../db'
import { defaultFilterState } from '@/types/filters'

describe('MockDatabaseService', () => {
  let mockDb: MockDatabaseService

  beforeEach(() => {
    mockDb = new MockDatabaseService()
  })

  describe('searchThumbnails', () => {
    it('returns all thumbnails when no filters applied', async () => {
      const result = await mockDb.searchThumbnails({
        filters: defaultFilterState,
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data!.data.length).toBeGreaterThan(0)
      expect(result.data!.total).toBeGreaterThan(0)
    })

    it('filters by search query', async () => {
      const result = await mockDb.searchThumbnails({
        query: 'mountain',
        filters: defaultFilterState,
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data!.data.length).toBeGreaterThan(0)
      expect(result.data!.data[0].title.toLowerCase()).toContain('mountain')
    })

    it('filters by category', async () => {
      const result = await mockDb.searchThumbnails({
        filters: {
          ...defaultFilterState,
          categories: ['photography'],
        },
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      result.data!.data.forEach(item => {
        expect(item.category).toBe('photography')
      })
    })

    it('filters by emotion', async () => {
      const result = await mockDb.searchThumbnails({
        filters: {
          ...defaultFilterState,
          emotions: ['calm'],
        },
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      result.data!.data.forEach(item => {
        expect(item.emotion).toBe('calm')
      })
    })

    it('filters by price range', async () => {
      const result = await mockDb.searchThumbnails({
        filters: {
          ...defaultFilterState,
          priceRange: { min: 0, max: 10 },
        },
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      result.data!.data.forEach(item => {
        expect(item.price).toBeGreaterThanOrEqual(0)
        expect(item.price).toBeLessThanOrEqual(10)
      })
    })

    it('sorts by newest', async () => {
      const result = await mockDb.searchThumbnails({
        filters: {
          ...defaultFilterState,
          sortBy: 'newest',
          sortDirection: 'desc',
        },
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      
      const dates = result.data!.data.map(item => new Date(item.created_at).getTime())
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i - 1])
      }
    })

    it('applies pagination', async () => {
      const result = await mockDb.searchThumbnails({
        filters: defaultFilterState,
        page: 1,
        limit: 1,
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data!.data.length).toBe(1)
      expect(result.data!.page).toBe(1)
      expect(result.data!.limit).toBe(1)
    })
  })

  describe('getThumbnailById', () => {
    it('returns thumbnail when found', async () => {
      const result = await mockDb.getThumbnailById('1')

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
      expect(result.data!.id).toBe('1')
    })

    it('returns error when not found', async () => {
      const result = await mockDb.getThumbnailById('nonexistent')

      expect(result.error).toBe('Thumbnail not found')
      expect(result.data).toBeNull()
    })
  })

  describe('likeThumbnail', () => {
    it('successfully likes a thumbnail', async () => {
      const result = await mockDb.likeThumbnail('1', 'user1')

      expect(result.error).toBeNull()
      expect(result.data).toBe(true)
    })

    it('returns error for nonexistent thumbnail', async () => {
      const result = await mockDb.likeThumbnail('nonexistent', 'user1')

      expect(result.error).toBe('Thumbnail not found')
      expect(result.data).toBeNull()
    })
  })

  describe('downloadThumbnail', () => {
    it('successfully downloads a thumbnail', async () => {
      const result = await mockDb.downloadThumbnail('1', 'user1')

      expect(result.error).toBeNull()
      expect(result.data).toBe(true)
    })

    it('increments download count', async () => {
      const beforeResult = await mockDb.getThumbnailById('1')
      const initialDownloads = beforeResult.data!.downloads

      await mockDb.downloadThumbnail('1', 'user1')

      const afterResult = await mockDb.getThumbnailById('1')
      expect(afterResult.data!.downloads).toBe(initialDownloads + 1)
    })
  })

  describe('incrementViews', () => {
    it('successfully increments views', async () => {
      const result = await mockDb.incrementViews('1')

      expect(result.error).toBeNull()
      expect(result.data).toBe(true)
    })

    it('increments view count', async () => {
      const beforeResult = await mockDb.getThumbnailById('1')
      const initialViews = beforeResult.data!.views

      await mockDb.incrementViews('1')

      const afterResult = await mockDb.getThumbnailById('1')
      expect(afterResult.data!.views).toBe(initialViews + 1)
    })
  })
})
