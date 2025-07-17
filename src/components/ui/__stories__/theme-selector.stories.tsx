import type { Meta, StoryObj } from '@storybook/nextjs'
import { ThemeSelector } from '../theme-selector'
import { ThemeProvider } from '@/components/providers/theme-provider'

const meta: Meta<typeof ThemeSelector> = {
  title: 'UI/ThemeSelector',
  component: ThemeSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive theme selector with light, dark, and system options. Includes descriptions and accessibility features.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="w-80 p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomStyling: Story = {
  args: {
    className: 'border rounded-lg p-4 bg-card',
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme selector with custom styling applied via className prop.',
      },
    },
  },
}

export const InCard: Story = {
  render: (args) => (
    <div className="max-w-md mx-auto">
      <div className="bg-card border rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Appearance Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how Thumboard looks to you. Select a single theme, or sync with your system and automatically switch between day and night themes.
        </p>
        <ThemeSelector {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Theme selector presented in a settings card context with descriptive text.',
      },
    },
  },
}
