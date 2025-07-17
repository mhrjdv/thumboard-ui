'use client'

import * as React from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export function Logo({ className, width = 200, height = 60, priority = false }: LogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <div 
        className={cn('bg-muted animate-pulse rounded', className)}
        style={{ width, height }}
      />
    )
  }

  // Determine which logo to show
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'
  
  const logoSrc = isDark ? '/Full_logo_dark.svg' : '/Full_logo_light.svg'
  const alt = 'Thumboard Logo'

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn('object-contain', className)}
    />
  )
}

// Compact version for smaller spaces
export function LogoCompact({ className, width = 40, height = 40, priority = false }: LogoProps) {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        className={cn('bg-muted animate-pulse rounded', className)}
        style={{ width, height }}
      />
    )
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'
  
  // For compact version, we'll use the same logos but smaller
  const logoSrc = isDark ? '/Full_logo_dark.svg' : '/Full_logo_light.svg'
  const alt = 'Thumboard'

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn('object-contain', className)}
    />
  )
}
