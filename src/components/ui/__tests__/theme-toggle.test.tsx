import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '../theme-toggle'

// Mock the custom hook
jest.mock('../../../hooks/use-theme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    mounted: true,
    isDark: false,
    isLight: true,
    isSystem: false,
  }),
}))

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Switch to dark theme')
  })

  it('renders with label when showLabel is true', () => {
    render(<ThemeToggle showLabel />)

    expect(screen.getByText('Light theme')).toBeInTheDocument()
  })
})
