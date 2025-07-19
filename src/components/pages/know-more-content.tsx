'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ContactForm } from '@/components/ui/contact-form';
import { Footer } from '@/components/layout/footer';
import { ExternalLink, Coffee, Heart } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function KnowMoreContent() {
  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="block">
                <Logo width={120} height={32} priority />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link 
                href="/know-more" 
                className="text-sm font-medium text-foreground border-b-2 border-primary"
              >
                {/* Know More */}
              </Link>
            </nav>

            {/* Theme Toggle */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Why Thumboard?

          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Tired of boring templates? Thumboard is your playground for real creator thumbnails - fresh finds, not stock leftovers.
            It&apos;s a fun side-project by{' '} <br />
            <Link href="https://linkedin.com/in/-mihirjadhav" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Mihir
            </Link>
            {' '}&{' '}
            <Link href="https://twitter.com/heydebashis" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Debashis
            </Link>
            , powered by coffee, curiosity, and bad puns.
          </p>

        </div>
      </section>



        {/* Support Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Support Our Work
              </CardTitle>
              <CardDescription>
                If you find Thumboard helpful, consider supporting our development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link
                  href="https://coff.ee/heydeb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Coffee className="h-4 w-4" />
                  Buy us a coffee
                  <ExternalLink className="h-3 w-3 transform rotate-45" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>


      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Send us a Message
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto px-2">
            Have a specific question or want to provide detailed feedback? Use the form below to reach out to us directly.
          </p>
        </div>
        <ContactForm />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
