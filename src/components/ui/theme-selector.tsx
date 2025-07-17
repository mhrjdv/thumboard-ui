'use client'

import * as React from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

const themes = [
  {
    name: 'Light',
    value: 'light',
    icon: Sun,
    description: 'Light theme for bright environments',
  },
  {
    name: 'Dark',
    value: 'dark',
    icon: Moon,
    description: 'Dark theme for low-light environments',
  },
  {
    name: 'System',
    value: 'system',
    icon: Monitor,
    description: 'Adapts to your system preference',
  },
]

interface ThemeSelectorProps {
  className?: string
}

export function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <div className={`space-y-2 ${className}`}>
        {themes.map((themeOption) => (
          <div
            key={themeOption.value}
            className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/50 animate-pulse"
          >
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="flex-1">
              <div className="w-16 h-4 bg-muted rounded mb-1" />
              <div className="w-32 h-3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`} role="radiogroup" aria-label="Theme selection">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon
        const isSelected = theme === themeOption.value
        
        return (
          <Button
            key={themeOption.value}
            variant={isSelected ? 'default' : 'outline'}
            className="w-full justify-start h-auto p-3 text-left"
            onClick={() => setTheme(themeOption.value)}
            role="radio"
            aria-checked={isSelected}
            aria-describedby={`theme-${themeOption.value}-description`}
          >
            <div className="flex items-center space-x-3 w-full">
              <Icon className="w-5 h-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{themeOption.name}</div>
                <div 
                  id={`theme-${themeOption.value}-description`}
                  className="text-sm text-muted-foreground"
                >
                  {themeOption.description}
                </div>
              </div>
              {isSelected && (
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
            </div>
          </Button>
        )
      })}
    </div>
  )
}
