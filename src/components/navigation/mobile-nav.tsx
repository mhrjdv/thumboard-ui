"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Menu, User, LogOut, Home, Info, Mail, LayoutDashboard } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, signOut, loading } = useAuth();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-lg">Thumboard</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-3 py-4 flex-1">
            <Link
              href="/"
              className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link
              href="/know-more"
              className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <Info className="h-5 w-5" />
              <span>Know More</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <Mail className="h-5 w-5" />
              <span>Contact</span>
            </Link>

            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-lg font-medium hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Authentication Section */}
          <div className="border-t pt-4 mt-auto">
            {loading ? (
              <div className="flex items-center space-x-2 p-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLinkClick}
                  >
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full" onClick={handleLinkClick}>
                  <Link href="/signup">
                    Sign Up
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={handleLinkClick}>
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
