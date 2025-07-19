'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react'
import { meiliSearchService } from '@/lib/meilisearch'
import { MeilisearchIndexConfig } from '@/types/database'

export function MeilisearchConfigDebug() {
  const [config, setConfig] = useState<MeilisearchIndexConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const fetchConfig = async () => {
    setLoading(true)
    setError(null)
    try {
      const indexConfig = await meiliSearchService.getIndexConfig()
      setConfig(indexConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch configuration')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  const ConfigSection = ({ title, items }: { title: string; items: string[] }) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-700">{title}</h4>
      <div className="flex flex-wrap gap-1">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))
        ) : (
          <Badge variant="outline" className="text-xs text-gray-500">
            None configured
          </Badge>
        )}
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-4xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Meilisearch Index Configuration</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    fetchConfig()
                  }}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                {isOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading configuration...</span>
              </div>
            )}

            {config && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigSection
                  title="Sortable Attributes"
                  items={config.sortableAttributes}
                />
                <ConfigSection
                  title="Filterable Attributes"
                  items={config.filterableAttributes}
                />
                <ConfigSection
                  title="Searchable Attributes"
                  items={config.searchableAttributes}
                />
                <ConfigSection
                  title="Ranking Rules"
                  items={config.rankingRules}
                />
                <ConfigSection
                  title="Facetable Attributes"
                  items={config.facetableAttributes}
                />
                <ConfigSection
                  title="Highlightable Attributes"
                  items={config.highlightableAttributes}
                />
              </div>
            )}

            {config && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Configuration Status</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>✅ Dynamic configuration system is active</p>
                  <p>✅ UI will adapt to parameter changes automatically</p>
                  <p>✅ Fallback to defaults if configuration fetch fails</p>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
