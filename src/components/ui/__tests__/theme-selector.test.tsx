import { render, screen } from '@testing-library/react'
import { ThemeSelector } from '../theme-selector'

// Mock the custom hook
jest.mock('../../../hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    mounted: true,
  }),
}))

describe('ThemeSelector', () => {
  it('renders all theme options', () => {
    render(<ThemeSelector />)

    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('has proper ARIA attributes', () => {
    render(<ThemeSelector />)

    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveAttribute('aria-label', 'Theme selection')

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
  })
})
