'use client';

import Link from 'next/link';
import { ExternalLink, Mail, Coffee, Twitter, Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Thumboard</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered YouTube thumbnail discovery platform built with modern web technologies.
            </p>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Made with love</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/know-more"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Know More
                </Link>
              </li>
              <li>
                <Link 
                  href="/debug/meilisearch"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Debug
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="mailto:connect@thumboard.in"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  connect@thumboard.in
                </Link>
              </li>
              <li>
                <Link 
                  href="mailto:thumboard@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  thumboard@gmail.com
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Connect & Support</h4>
            <div className="space-y-3">
              {/* Social Links */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium">Mihir Jadhav</div>
                <div className="flex gap-3">
                  <Link 
                    href="https://www.linkedin.com/in/-mihirjadhav/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                  <Link 
                    href="https://x.com/@mhrjdv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-medium">Debashis</div>
                <div className="flex gap-3">
                  <Link 
                    href="https://www.linkedin.com/in/heydeb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                  <Link 
                    href="https://x.com/@heydebashis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Support Button */}
              <Button size="sm" variant="outline" asChild className="w-full">
                <Link 
                  href="https://coff.ee/heydeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Coffee className="h-3 w-3" />
                  Buy us a coffee
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Thumboard. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Built with Next.js, TypeScript & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
