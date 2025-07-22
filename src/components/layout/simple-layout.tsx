"use client";

import { MainHeader } from "./main-header";
import { ErrorBoundaryWrapper } from "../error-boundary-wrapper";

interface SimpleLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  searchComponent?: React.ReactNode;
  className?: string;
}

export function SimpleLayout({
  children,
  showSearch = false,
  searchComponent,
  className = ""
}: SimpleLayoutProps) {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <ErrorBoundaryWrapper>
        <MainHeader
          showSearch={showSearch}
          searchComponent={searchComponent}
        />
      </ErrorBoundaryWrapper>
      <main className="flex-1">
        <ErrorBoundaryWrapper>
          {children}
        </ErrorBoundaryWrapper>
      </main>
    </div>
  );
}
