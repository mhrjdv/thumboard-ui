'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeAwareFavicon() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Find or create the favicon link element
    let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }

    // Use resolvedTheme to handle system preference
    const currentTheme = resolvedTheme || theme;
    
    if (currentTheme === 'dark') {
      favicon.href = '/favicon-dark.svg';
    } else {
      favicon.href = '/favicon-light.svg';
    }
  }, [theme, resolvedTheme]);

  return null;
} 