'use client'

import { useState, useEffect } from 'react'

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()

        // Focus on the existing search bar instead of opening command palette
        const searchInput = document.querySelector('#search input') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
          searchInput.select() // Select all text for easy replacement
        } else {
          // Fallback to command palette if search input not found
          setIsOpen(prev => !prev)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openCommandPalette = () => setIsOpen(true)
  const closeCommandPalette = () => setIsOpen(false)

  return {
    isOpen,
    openCommandPalette,
    closeCommandPalette,
  }
}
