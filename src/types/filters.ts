export interface FilterOption {
  id: string
  label: string
  count?: number
  color?: string
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'color' | 'date'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  value?: string | number | boolean
}

export interface SortOption {
  id: string
  label: string
  direction: 'asc' | 'desc'
}

export interface FilterState {
  // MeiliSearch compatible filters
  types: string[] // tutorial, other, documentary, lifestyle, vlog
  emotions: string[] // neutral, happy
  face_presence: string[] // with_face, faceless
  layout_style: string[] // design_heavy, balanced
  colors: string[] // color palette hex values
  keywords: string[] // primary_keywords filter

  // Legacy filters for backward compatibility
  categories: string[]
  dateRange: {
    start?: Date
    end?: Date
  }
  priceRange: {
    min: number
    max: number
  }

  // Sorting options
  sortBy: string
  sortDirection: 'asc' | 'desc'
}

export const defaultFilterState: FilterState = {
  // MeiliSearch filters
  types: [],
  emotions: [],
  face_presence: [],
  layout_style: [],
  colors: [],
  keywords: [],

  // Legacy filters
  categories: [],
  dateRange: {},
  priceRange: { min: 0, max: 1000 },

  // Sorting
  sortBy: 'relevance',
  sortDirection: 'desc',
}

export const filterGroups: FilterGroup[] = [
  {
    id: 'types',
    label: 'Content Type',
    type: 'checkbox',
    options: [
      { id: 'tutorial', label: 'Tutorial', count: 1 },
      { id: 'other', label: 'Other', count: 21 },
      { id: 'documentary', label: 'Documentary', count: 1 },
      { id: 'lifestyle', label: 'Lifestyle', count: 5 },
      { id: 'vlog', label: 'Vlog', count: 3 },
    ],
  },
  {
    id: 'emotions',
    label: 'Emotions & Mood',
    type: 'checkbox',
    options: [
      { id: 'neutral', label: 'Neutral', count: 25 },
      { id: 'happy', label: 'Happy', count: 3 },
    ],
  },
  {
    id: 'face_presence',
    label: 'Face Presence',
    type: 'checkbox',
    options: [
      { id: 'with_face', label: 'With Face', count: 28 },
      { id: 'faceless', label: 'Faceless', count: 3 },
    ],
  },
  {
    id: 'layout_style',
    label: 'Layout Style',
    type: 'checkbox',
    options: [
      { id: 'design_heavy', label: 'Design Heavy', count: 13 },
      { id: 'balanced', label: 'Balanced', count: 18 },
    ],
  },

  {
    id: 'categories',
    label: 'Legacy Categories',
    type: 'checkbox',
    options: [
      { id: 'photography', label: 'Photography', count: 0 },
      { id: 'illustration', label: 'Illustration', count: 0 },
      { id: 'design', label: 'Design', count: 0 },
      { id: 'art', label: 'Digital Art', count: 0 },
    ],
  },
]

export const sortOptions: SortOption[] = [
  { id: 'relevance', label: 'Relevance', direction: 'desc' },
  { id: 'views', label: 'Most Views', direction: 'desc' },
  { id: 'views-asc', label: 'Least Views', direction: 'asc' },
  { id: 'newest', label: 'Newest First', direction: 'desc' },
  { id: 'oldest', label: 'Oldest First', direction: 'asc' },
  { id: 'title', label: 'Title A-Z', direction: 'asc' },
  { id: 'title-desc', label: 'Title Z-A', direction: 'desc' },
  { id: 'channel', label: 'Channel A-Z', direction: 'asc' },
]
