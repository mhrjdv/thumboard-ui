'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  variant?: 'spinner' | 'skeleton' | 'pulse'
}

export function Loading({ size = 'md', text, className, variant = 'spinner' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return <LoadingSkeleton className={className} />
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('animate-pulse bg-muted rounded', className)} />
    )
  }

  return null
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg aspect-[4/3] mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)} />
  )
}

// Loading overlay for full-screen loading
export function LoadingOverlay({ text = 'Loading...', className }: { text?: string; className?: string }) {
  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium">{text}</p>
      </div>
    </div>
  )
}

// Loading states for different components
export function SearchLoading() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loading text="Searching..." />
    </div>
  )
}

export function GridLoading() {
  return <LoadingSkeleton />
}

export function FilterLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
