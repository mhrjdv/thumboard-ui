'use client'

import * as React from 'react'
import { Search, Home, Info, Keyboard } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string) => void
}

interface Command {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  keywords: string[]
}

export function CommandPalette({ isOpen, onClose, onSearch }: CommandPaletteProps) {
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const commands: Command[] = React.useMemo(() => [
    {
      id: 'search',
      title: 'Search Content',
      description: 'Search for images, videos, and thumbnails',
      icon: Search,
      action: () => {
        if (query.trim()) {
          onSearch?.(query.trim())
          onClose()
        }
      },
      keywords: ['search', 'find', 'look', 'query']
    },
    {
      id: 'home',
      title: 'Go to Home',
      description: 'Navigate to the main page',
      icon: Home,
      action: () => {
        window.location.href = '/'
        onClose()
      },
      keywords: ['home', 'main', 'dashboard']
    },
    {
      id: 'about',
      title: 'About Thumboard',
      description: 'Learn more about the platform',
      icon: Info,
      action: () => {
        window.location.href = '/know-more'
        onClose()
      },
      keywords: ['about', 'info', 'learn', 'know more']
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'View all available shortcuts',
      icon: Keyboard,
      action: () => {
        // TODO: Implement shortcuts modal
        onClose()
      },
      keywords: ['shortcuts', 'keyboard', 'hotkeys', 'commands']
    }
  ], [query, onSearch, onClose])

  const filteredCommands = React.useMemo(() => {
    if (!query.trim()) return commands

    const searchQuery = query.toLowerCase()
    return commands.filter(command => 
      command.title.toLowerCase().includes(searchQuery) ||
      command.description.toLowerCase().includes(searchQuery) ||
      command.keywords.some(keyword => keyword.includes(searchQuery))
    )
  }, [query, commands])

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [filteredCommands])

  React.useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="bg-background border rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground mr-3" />
            <Input
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              autoFocus
            />
            <div className="ml-3 text-xs text-muted-foreground">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                ESC
              </kbd>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No commands found
              </div>
            ) : (
              <div className="p-2">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon
                  return (
                    <div
                      key={command.id}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors',
                        index === selectedIndex 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-accent/50'
                      )}
                      onClick={() => command.action()}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{command.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {command.description}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Navigate with ↑↓ arrows, select with Enter</span>
              <div className="flex items-center gap-2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ⌘K
                </kbd>
                <span>to open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
