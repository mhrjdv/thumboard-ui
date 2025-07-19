'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Component as WaitlistComponent } from "@/components/ui/waitlist";

export default function Home() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const mode = currentTheme === 'dark' ? 'dark' : 'light'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WaitlistComponent mode={mode} />
    </div>
  );
}
