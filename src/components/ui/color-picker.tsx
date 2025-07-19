'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

const predefinedColors = [
  '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
  '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
  '#800000', '#804000', '#808000', '#408000', '#008000', '#008040',
  '#008080', '#004080', '#000080', '#400080', '#800080', '#800040',
  '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF', '#FFE0E0',
];

export function ColorPicker({ value = '#000000', onChange, className }: ColorPickerProps) {
  const [color, setColor] = React.useState(value);
  const [inputValue, setInputValue] = React.useState(value);

  React.useEffect(() => {
    setColor(value);
    setInputValue(value);
  }, [value]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setInputValue(newColor);
    onChange?.(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      setColor(newValue);
      onChange?.(newValue);
    }
  };

  const handleInputBlur = () => {
    // Reset to current color if invalid
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(color);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-8 p-0 border-2"
            style={{ backgroundColor: color }}
            aria-label="Pick a color"
          >
            <span className="sr-only">Current color: {color}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Color Picker</label>
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-12 rounded border cursor-pointer"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Hex Value</label>
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="#000000"
                className="font-mono"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Preset Colors</label>
              <div className="grid grid-cols-6 gap-1">
                {predefinedColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    onClick={() => handleColorChange(presetColor)}
                    className={cn(
                      'w-8 h-8 rounded border-2 cursor-pointer hover:scale-110 transition-transform',
                      color === presetColor ? 'border-foreground' : 'border-muted'
                    )}
                    style={{ backgroundColor: presetColor }}
                    aria-label={`Select color ${presetColor}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="#000000"
        className="w-24 font-mono text-xs"
      />
    </div>
  );
}
