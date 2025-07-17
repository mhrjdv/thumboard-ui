import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThumbnailGrid } from '../thumbnail-grid'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof ThumbnailGrid> = {
  title: 'UI/ThumbnailGrid',
  component: ThumbnailGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive grid layout for displaying thumbnail cards with masonry, grid, and list view options.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-6 max-w-7xl mx-auto">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['masonry', 'grid', 'list'],
      description: 'Layout type for the grid',
    },
    columns: {
      control: { type: 'select' },
      options: [2, 3, 4, 5],
      description: 'Number of columns in grid layout',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading state',
    },
    hasMore: {
      control: { type: 'boolean' },
      description: 'Whether there are more items to load',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const GridLayout: Story = {
  args: {
    layout: 'grid',
    columns: 3,
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const ListLayout: Story = {
  args: {
    layout: 'list',
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const FourColumns: Story = {
  args: {
    layout: 'grid',
    columns: 4,
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const NoMoreItems: Story = {
  args: {
    hasMore: false,
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const EmptyState: Story = {
  args: {
    data: [],
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}

export const SingleItem: Story = {
  args: {
    data: [
      {
        id: '1',
        title: 'Single Beautiful Image',
        description: 'A lone image in the grid',
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        author: { name: 'Solo Artist' },
        stats: { views: 500, likes: 25, downloads: 10 },
        tags: ['single', 'test'],
        aspectRatio: 4/3,
      },
    ],
    onItemClick: action('onItemClick'),
    onItemLike: action('onItemLike'),
    onItemDownload: action('onItemDownload'),
    onItemShare: action('onItemShare'),
    onLoadMore: action('onLoadMore'),
  },
}
