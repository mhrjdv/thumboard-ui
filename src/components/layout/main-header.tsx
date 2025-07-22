"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";
import { AuthNav } from "@/components/navigation/auth-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { useAuth } from "@/hooks/use-auth";

interface MainHeaderProps {
  showSearch?: boolean;
  searchComponent?: React.ReactNode;
  className?: string;
}

export function MainHeader({ 
  showSearch = false, 
  searchComponent, 
  className = "" 
}: MainHeaderProps) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  return (
    <header className={`sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Mobile Navigation + Logo */}
          <div className="flex items-center flex-shrink-0">
            {/* Mobile Navigation Menu */}
            <div className="md:hidden mr-2">
              <MobileNav />
            </div>
            
            {/* Logo */}
            <Link href="/" className="block">
              <Logo width={120} height={32} priority />
            </Link>
          </div>

          {/* Desktop Search - Only show if enabled and search component provided */}
          {showSearch && searchComponent && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
              {searchComponent}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/know-more">
                  Know More
                </Link>
              </Button>
              
              {isAuthenticated && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
              )}
            </nav>

            {/* Authentication Section */}
            <div className="flex items-center gap-2">
              {authLoading ? (
                /* Loading state - show skeleton */
                <div className="flex items-center gap-2">
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                /* Authenticated user - show user dropdown menu */
                <AuthNav />
              ) : (
                /* Guest user - show login/signup buttons */
                <>
                  {/* Desktop Auth Buttons - Full size (md and up) */}
                  <div className="hidden md:flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="hover:bg-accent">
                      <Link href="/login">
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                      <Link href="/signup">
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Tablet Auth Buttons - Medium size (sm to md) */}
                  <div className="hidden sm:flex md:hidden items-center gap-1">
                    <Button asChild variant="ghost" size="sm" className="px-3 text-sm">
                      <Link href="/login">
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="px-3 text-sm">
                      <Link href="/signup">
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Mobile Auth Buttons - Compact (below sm) */}
                  <div className="flex sm:hidden items-center gap-1">
                    <Button asChild variant="ghost" size="sm" className="px-2 text-xs h-8 min-w-[3rem]">
                      <Link href="/login">
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="px-2 text-xs h-8 min-w-[3rem]">
                      <Link href="/signup">
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
