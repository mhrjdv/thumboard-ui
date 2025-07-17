'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown'
  showLabel?: boolean
}

export function ThemeToggle({ variant = 'button', showLabel = false }: ThemeToggleProps) {
  const { toggleTheme, mounted, isDark, isSystem } = useTheme()

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled aria-label="Loading theme toggle">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const getIcon = () => {
    if (isSystem) return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    if (isDark) return <Moon className="h-[1.2rem] w-[1.2rem]" />
    return <Sun className="h-[1.2rem] w-[1.2rem]" />
  }

  const getLabel = () => {
    if (isSystem) return 'System theme'
    if (isDark) return 'Dark theme'
    return 'Light theme'
  }

  const getToggleLabel = () => {
    if (isDark) return 'Switch to light theme'
    return 'Switch to dark theme'
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size={showLabel ? 'default' : 'icon'}
        onClick={toggleTheme}
        aria-label={getToggleLabel()}
        className="transition-all duration-200 hover:scale-105"
      >
        <div className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute inset-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
        {showLabel && <span className="ml-2">{getLabel()}</span>}
        <span className="sr-only">{getToggleLabel()}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={getToggleLabel()}
      className="w-full justify-start"
    >
      {getIcon()}
      <span className="ml-2">{getLabel()}</span>
    </Button>
  )
}
