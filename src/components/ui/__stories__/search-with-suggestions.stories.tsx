import type { Meta, StoryObj } from '@storybook/nextjs'
import { SearchWithSuggestions } from '../search-with-suggestions'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof SearchWithSuggestions> = {
  title: 'UI/SearchWithSuggestions',
  component: SearchWithSuggestions,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An enhanced search component with suggestions, recent searches, and keyboard navigation.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4 h-96">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    loading: {
      control: { type: 'boolean' },
      description: 'Show loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the search input',
    },
    showSuggestions: {
      control: { type: 'boolean' },
      description: 'Show suggestions dropdown',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}

export const WithCustomData: Story = {
  args: {
    placeholder: 'Search Thumboard...',
    suggestions: [
      { id: '1', text: 'photography tips', type: 'trending', count: 2341 },
      { id: '2', text: 'graphic design', type: 'trending', count: 1876 },
      { id: '3', text: 'web development', type: 'suggestion' },
      { id: '4', text: 'user interface', type: 'suggestion' },
      { id: '5', text: 'mobile apps', type: 'suggestion' },
    ],
    recentSearches: [
      'react components',
      'tailwind css',
      'next.js tutorial',
    ],
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}

export const NoSuggestions: Story = {
  args: {
    suggestions: [],
    recentSearches: [],
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}

export const OnlyRecentSearches: Story = {
  args: {
    suggestions: [],
    recentSearches: [
      'design patterns',
      'color theory',
      'typography',
      'brand identity',
    ],
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}

export const OnlyTrendingSuggestions: Story = {
  args: {
    recentSearches: [],
    suggestions: [
      { id: '1', text: 'ai generated art', type: 'trending', count: 5432 },
      { id: '2', text: 'minimalist logos', type: 'trending', count: 3210 },
      { id: '3', text: 'vintage posters', type: 'trending', count: 2876 },
    ],
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    onSearch: action('onSearch'),
    onSuggestionSelect: action('onSuggestionSelect'),
  },
}
