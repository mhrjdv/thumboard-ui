import type { Meta, StoryObj } from '@storybook/nextjs'
import { FilterPanel } from '../filter-panel'
import { defaultFilterState } from '@/types/filters'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof FilterPanel> = {
  title: 'UI/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive filter panel with sorting and faceted search options. Responsive design with mobile sheet and desktop sidebar layouts.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isMobile: {
      control: { type: 'boolean' },
      description: 'Whether to render as mobile sheet or desktop sidebar',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {
  args: {
    filters: defaultFilterState,
    onFiltersChange: action('onFiltersChange'),
    isMobile: false,
  },
}

export const Mobile: Story = {
  args: {
    filters: defaultFilterState,
    onFiltersChange: action('onFiltersChange'),
    isMobile: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile version renders as a trigger button that opens a sheet panel.',
      },
    },
  },
}

export const WithActiveFilters: Story = {
  args: {
    filters: {
      ...defaultFilterState,
      categories: ['photography', 'design'],
      emotions: ['calm', 'professional'],
      types: ['images'],
      colors: ['red', 'blue'],
      priceRange: { min: 50, max: 500 },
      sortBy: 'newest',
    },
    onFiltersChange: action('onFiltersChange'),
    isMobile: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with several active filters showing the clear all button and selected states.',
      },
    },
  },
}

export const MobileWithActiveFilters: Story = {
  args: {
    filters: {
      ...defaultFilterState,
      categories: ['photography', 'illustration'],
      emotions: ['energetic'],
      colors: ['green', 'purple', 'orange'],
    },
    onFiltersChange: action('onFiltersChange'),
    isMobile: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mobile filter panel showing the active filter count badge on the trigger button.',
      },
    },
  },
}

export const PriceRangeActive: Story = {
  args: {
    filters: {
      ...defaultFilterState,
      priceRange: { min: 100, max: 800 },
      sortBy: 'price-low',
    },
    onFiltersChange: action('onFiltersChange'),
    isMobile: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with price range slider active and price-based sorting.',
      },
    },
  },
}

export const ColorFiltersOnly: Story = {
  args: {
    filters: {
      ...defaultFilterState,
      colors: ['red', 'blue', 'green', 'yellow'],
    },
    onFiltersChange: action('onFiltersChange'),
    isMobile: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel showing color palette selection with multiple colors selected.',
      },
    },
  },
}

export const SortingFocus: Story = {
  args: {
    filters: {
      ...defaultFilterState,
      sortBy: 'popular',
      sortDirection: 'desc',
    },
    onFiltersChange: action('onFiltersChange'),
    isMobile: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Filter panel with focus on sorting options, showing popularity-based sorting.',
      },
    },
  },
}
