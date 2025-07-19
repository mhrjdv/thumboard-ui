'use client'

import * as React from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { filterGroups, sortOptions, type FilterState, type FilterGroup, defaultFilterState } from '@/types/filters'


interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
  isMobile?: boolean
  filterGroups?: FilterGroup[]
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface FilterGroupComponentProps {
  group: FilterGroup
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

function FilterGroupComponent({ group, filters, onFiltersChange }: FilterGroupComponentProps) {
  const [isExpanded, setIsExpanded] = React.useState(true)

  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    const currentValues = filters[group.id as keyof FilterState] as string[] || []
    const newValues = checked
      ? [...currentValues, optionId]
      : currentValues.filter(id => id !== optionId)
    
    onFiltersChange({
      ...filters,
      [group.id]: newValues,
    })
  }

  const handleRangeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      [group.id]: { min: values[0], max: values[1] },
    })
  }

  return (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto font-medium text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {group.label}
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {group.type === 'checkbox' && group.options && (
            <div className="space-y-2">
              {group.options.map((option) => {
                const currentValues = filters[group.id as keyof FilterState] as string[] || []
                const isChecked = currentValues.includes(option.id)
                
                return (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.id}-${option.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange(option.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`${group.id}-${option.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {option.count && (
                          <span className="text-xs text-muted-foreground">
                            {option.count.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>
          )}



          {group.type === 'range' && (
            <div className="space-y-3">
              <Slider
                value={[
                  (filters[group.id as keyof FilterState] as { min: number; max: number })?.min || group.min || 0,
                  (filters[group.id as keyof FilterState] as { min: number; max: number })?.max || group.max || 100
                ]}
                onValueChange={handleRangeChange}
                min={group.min}
                max={group.max}
                step={group.step}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${(filters[group.id as keyof FilterState] as { min: number; max: number })?.min || group.min || 0}</span>
                <span>${(filters[group.id as keyof FilterState] as { min: number; max: number })?.max || group.max || 100}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function FilterPanel({
  filters,
  onFiltersChange,
  className,
  isMobile = false,
  filterGroups: customFilterGroups = filterGroups,
  isCollapsed = false,
  onToggleCollapse
}: FilterPanelProps) {
  const handleSortChange = (value: string) => {
    const sortOption = sortOptions.find(option => option.id === value)
    if (sortOption) {
      onFiltersChange({
        ...filters,
        sortBy: sortOption.id,
        sortDirection: sortOption.direction,
      })
    }
  }

  const handleClearFilters = () => {
    onFiltersChange(defaultFilterState)
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.categories.length
    count += filters.emotions.length
    count += filters.types.length

    if (filters.dateRange.start || filters.dateRange.end) count += 1
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count += 1
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Sort by</label>
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {activeFilterCount > 0 && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs h-8 px-3 text-muted-foreground hover:text-foreground"
            >
              Clear all ({activeFilterCount})
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {customFilterGroups.map((group) => (
            <FilterGroupComponent
              key={group.id}
              group={group}
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          ))}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters & Sort</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={cn(
      'bg-card border rounded-lg p-4',
      isCollapsed ? 'w-12' : 'w-64',
      className
    )}>
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between mb-4">
        {!isCollapsed && <h3 className="text-sm font-medium text-foreground">Filters</h3>}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      {!isCollapsed && <FilterContent />}
    </div>
  )
}
