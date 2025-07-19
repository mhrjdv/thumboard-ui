'use client'

import * as React from 'react'
import { ThumbnailGrid } from '@/components/ui/thumbnail-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Grid3X3, Columns3 } from 'lucide-react'

export function GridLayoutTest() {
  const [currentLayout, setCurrentLayout] = React.useState<'grid-3' | 'grid-5'>('grid-3')
  const [testResults, setTestResults] = React.useState<{
    'grid-3': boolean
    'grid-5': boolean
  }>({
    'grid-3': false,
    'grid-5': false
  })

  const testLayouts = [
    { key: 'grid-3', label: 'Grid Layout (3 cols)', icon: Columns3 },
    { key: 'grid-5', label: 'Grid Layout (5 cols)', icon: Grid3X3 }
  ] as const

  const handleLayoutTest = (layout: 'grid-3' | 'grid-5') => {
    setCurrentLayout(layout)
    // Mark as tested
    setTestResults(prev => ({ ...prev, [layout]: true }))
  }

  const allTestsPassed = Object.values(testResults).every(Boolean)

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grid Layout Test</CardTitle>
          <CardDescription>
            Test all three grid layout types with real MeiliSearch data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Layout Test Buttons */}
            <div className="flex flex-wrap gap-2">
              {testLayouts.map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={currentLayout === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLayoutTest(key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {testResults[key] && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      ✓
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Test Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Test Status:</span>
              {allTestsPassed ? (
                <Badge variant="default" className="bg-green-500">
                  All Tests Passed ✓
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {Object.values(testResults).filter(Boolean).length}/4 Layouts Tested
                </Badge>
              )}
            </div>

            {/* Current Layout Info */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Current Layout: {currentLayout}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentLayout === 'grid-3' && 'Responsive grid with equal-height cards (up to 3 columns)'}
                {currentLayout === 'grid-5' && 'Responsive grid with equal-height cards (up to 5 columns)'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Component */}
      <ThumbnailGrid
        searchParams={{
          query: '',
          filters: {
            types: [],
            emotions: [],
            face_presence: [],
            layout_style: [],
            colors: [],
            keywords: [],
            categories: [],
            sortBy: 'relevance',
            sortDirection: 'desc',
            priceRange: { min: 0, max: 100 },
            dateRange: { start: undefined, end: undefined }
          }
        }}
        useRealData={true}
        layout={currentLayout}
        className="min-h-[600px]"
      />

      {/* Test Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Grid Layout:</strong> Should display thumbnails in a responsive grid with equal heights.
              Cards should align in neat rows and columns.
            </div>
            <div>
              <strong>Masonry Layout:</strong> Should display thumbnails in a Pinterest-style layout where
              cards can have different heights and flow naturally into columns.
            </div>
            <div>
              <strong>List Layout:</strong> Should display thumbnails in a horizontal list format with
              more detailed information visible for each item.
            </div>
            <div className="pt-2 border-t">
              <strong>Expected Features:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground">
                <li>Real data from MeiliSearch API</li>
                <li>Smooth transitions between layouts</li>
                <li>Responsive design on all screen sizes</li>
                <li>Proper image loading and optimization</li>
                <li>Interactive hover effects</li>
                <li>Modal popup on thumbnail click</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
