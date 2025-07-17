import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThumbnailCard, type ThumbnailData } from '../thumbnail-card'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof ThumbnailCard> = {
  title: 'UI/ThumbnailCard',
  component: ThumbnailCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive thumbnail card with hover effects, animations, and interactive elements.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the thumbnail card',
    },
    priority: {
      control: { type: 'boolean' },
      description: 'Whether to prioritize image loading',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleData: ThumbnailData = {
  id: '1',
  title: 'Beautiful Mountain Landscape',
  description: 'Stunning view of snow-capped mountains during golden hour with dramatic clouds',
  imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  author: {
    name: 'John Photographer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  },
  stats: {
    views: 1234,
    likes: 89,
    downloads: 45,
  },
  tags: ['landscape', 'mountains', 'nature', 'photography'],
  aspectRatio: 4/3,
}

export const Default: Story = {
  args: {
    data: sampleData,
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
}

export const SmallSize: Story = {
  args: {
    data: sampleData,
    size: 'sm',
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
}

export const LargeSize: Story = {
  args: {
    data: sampleData,
    size: 'lg',
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
}

export const PortraitImage: Story = {
  args: {
    data: {
      ...sampleData,
      title: 'Portrait Photography',
      description: 'Professional portrait with dramatic lighting',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop',
      aspectRatio: 4/5,
      tags: ['portrait', 'photography', 'professional'],
    },
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
}

export const SquareImage: Story = {
  args: {
    data: {
      ...sampleData,
      title: 'Abstract Art',
      description: 'Colorful abstract digital composition',
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
      aspectRatio: 1,
      tags: ['abstract', 'digital', 'art', 'colorful'],
    },
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
}

export const ManyTags: Story = {
  args: {
    data: {
      ...sampleData,
      tags: ['landscape', 'mountains', 'nature', 'photography', 'outdoor', 'adventure', 'travel', 'scenic'],
    },
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with many tags shows only first 3 and indicates overflow.',
      },
    },
  },
}

export const NoDescription: Story = {
  args: {
    data: {
      ...sampleData,
      description: undefined,
    },
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
}

export const HighStats: Story = {
  args: {
    data: {
      ...sampleData,
      stats: {
        views: 1234567,
        likes: 89012,
        downloads: 45678,
      },
    },
    onLike: action('onLike'),
    onDownload: action('onDownload'),
    onShare: action('onShare'),
    onClick: action('onClick'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with high statistics showing number formatting.',
      },
    },
  },
}
