import React, { useEffect, useRef, useState } from 'react'

// Focus management utilities
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: string[],
  onSelect: (item: string, index: number) => void,
  isActive: boolean = true
) {
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (!isActive) return

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex(prev => (prev + 1) % items.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex(prev => (prev - 1 + items.length) % items.length)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (activeIndex >= 0) {
            onSelect(items[activeIndex], activeIndex)
          }
          break
        case 'Escape':
          setActiveIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, onSelect, activeIndex, isActive])

  return { activeIndex, setActiveIndex }
}

// Screen reader announcements
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null)

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcerRef.current) return

    const announcer = announcerRef.current
    announcer.setAttribute('aria-live', priority)
    announcer.textContent = message

    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }

  const AnnouncerComponent = () => React.createElement('div', {
    ref: announcerRef,
    'aria-live': 'polite',
    'aria-atomic': 'true',
    className: 'sr-only'
  })

  return { announce, AnnouncerComponent }
}

// Skip links for keyboard navigation
export function SkipLinks() {
  return React.createElement('div', {
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50'
  }, [
    React.createElement('a', {
      key: 'main',
      href: '#main-content',
      className: 'bg-primary text-primary-foreground px-4 py-2 rounded-br-md focus:outline-none focus:ring-2 focus:ring-ring'
    }, 'Skip to main content'),
    React.createElement('a', {
      key: 'search',
      href: '#search',
      className: 'bg-primary text-primary-foreground px-4 py-2 rounded-br-md focus:outline-none focus:ring-2 focus:ring-ring ml-2'
    }, 'Skip to search')
  ])
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// High contrast detection
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setPrefersHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersHighContrast
}

// ARIA utilities
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export function useAriaDescribedBy(description?: string) {
  const [id] = useState(() => generateId('desc'))
  
  const DescriptionComponent = description ? () => React.createElement('div', {
    id,
    className: 'sr-only'
  }, description) : null

  return {
    'aria-describedby': description ? id : undefined,
    DescriptionComponent,
  }
}

export function useAriaLabelledBy(label?: string) {
  const [id] = useState(() => generateId('label'))
  
  const LabelComponent = label ? () => React.createElement('div', {
    id,
    className: 'sr-only'
  }, label) : null

  return {
    'aria-labelledby': label ? id : undefined,
    LabelComponent,
  }
}

// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0]
    const [r, g, b] = rgb.map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

export function isAccessibleContrast(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
  const ratio = getContrastRatio(foreground, background)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

// Focus visible utilities
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let hadKeyboardEvent = false

    const onKeyDown = () => {
      hadKeyboardEvent = true
    }

    const onFocus = () => {
      if (hadKeyboardEvent) {
        setIsFocusVisible(true)
      }
    }

    const onBlur = () => {
      setIsFocusVisible(false)
      hadKeyboardEvent = false
    }

    const onMouseDown = () => {
      hadKeyboardEvent = false
    }

    document.addEventListener('keydown', onKeyDown)
    element.addEventListener('focus', onFocus)
    element.addEventListener('blur', onBlur)
    element.addEventListener('mousedown', onMouseDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      element.removeEventListener('focus', onFocus)
      element.removeEventListener('blur', onBlur)
      element.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return { ref, isFocusVisible }
}
