import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeToggle } from '../theme-toggle'
import { ThemeProvider } from '@/components/providers/theme-provider'

const meta: Meta<typeof ThemeToggle> = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle button for switching between light and dark themes with smooth animations and accessibility support.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['button', 'dropdown'],
      description: 'The visual variant of the theme toggle',
    },
    showLabel: {
      control: { type: 'boolean' },
      description: 'Whether to show the theme label text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'button',
    showLabel: false,
  },
}

export const WithLabel: Story = {
  args: {
    variant: 'button',
    showLabel: true,
  },
}

export const DropdownVariant: Story = {
  args: {
    variant: 'dropdown',
    showLabel: true,
  },
}

export const Interactive: Story = {
  args: {
    variant: 'button',
    showLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the toggle to see the theme change animation. The icon smoothly transitions between sun and moon.',
      },
    },
  },
}
