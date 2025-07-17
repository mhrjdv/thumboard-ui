import type { Meta, StoryObj } from '@storybook/nextjs'
import { SearchBar } from '../search-bar'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof SearchBar> = {
  title: 'UI/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive search input with debouncing, keyboard navigation, and accessibility features.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96 p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the search bar',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading spinner',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the search input',
    },
    showClearButton: {
      control: { type: 'boolean' },
      description: 'Show clear button when there is text',
    },
    autoFocus: {
      control: { type: 'boolean' },
      description: 'Auto focus the input on mount',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Search...',
    onSearch: action('onSearch'),
    onClear: action('onClear'),
  },
}

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: 'Search for images, videos, and more...',
    onSearch: action('onSearch'),
    onClear: action('onClear'),
  },
}

export const Loading: Story = {
  args: {
    placeholder: 'Searching...',
    loading: true,
    onSearch: action('onSearch'),
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Search disabled',
    disabled: true,
    onSearch: action('onSearch'),
  },
}

export const Small: Story = {
  args: {
    placeholder: 'Small search',
    size: 'sm',
    onSearch: action('onSearch'),
  },
}

export const Large: Story = {
  args: {
    placeholder: 'Large search',
    size: 'lg',
    onSearch: action('onSearch'),
  },
}

export const WithoutClearButton: Story = {
  args: {
    placeholder: 'No clear button',
    showClearButton: false,
    onSearch: action('onSearch'),
  },
}

export const AutoFocus: Story = {
  args: {
    placeholder: 'Auto focused',
    autoFocus: true,
    onSearch: action('onSearch'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar that automatically focuses when mounted.',
      },
    },
  },
}
