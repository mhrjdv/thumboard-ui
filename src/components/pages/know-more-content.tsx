'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumboardTimeline } from '@/components/ui/thumboard-timeline';
import { ContactForm } from '@/components/ui/contact-form';
import { Footer } from '@/components/layout/footer';
import { ExternalLink, Mail, Coffee, Twitter, Linkedin, Heart } from 'lucide-react';
import Link from 'next/link';

export function KnowMoreContent() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Know More About Thumboard
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Discover the story behind Thumboard, our journey, and how we&apos;re revolutionizing visual content discovery.
          </p>
        </div>
      </section>

      {/* About Thumboard Section */}
      <section className="py-12 sm:py-16 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              What is Thumboard?
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Thumboard is a cutting-edge visual content discovery platform that revolutionizes how you find, explore, and interact with visual content. Built with modern web technologies and powered by advanced search capabilities.
              </p>
              <p>
                Our platform combines blazing-fast search, intelligent filtering, and intuitive user experience to help you discover exactly what you&apos;re looking for in seconds, not minutes.
              </p>
              <p>
                Whether you&apos;re a designer seeking inspiration, a content creator looking for assets, or simply someone who loves exploring visual content, Thumboard provides the tools and experience you need.
              </p>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-foreground mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Advanced search with intelligent suggestions and auto-complete</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Comprehensive filtering by categories, emotions, types, colors, and price ranges</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Responsive masonry grid with infinite scroll and lazy loading</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Dark/light mode support with system preference detection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Accessibility-first design with WCAG compliance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">🎨</CardTitle>
                <CardDescription className="text-base font-medium">Modern Design System</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Built with shadcn/ui components and Tailwind CSS for a consistent, beautiful user experience</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">⚡</CardTitle>
                <CardDescription className="text-base font-medium">Lightning Fast Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Optimized with lazy loading, infinite scroll, and bundle optimization for blazing-fast experience</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">📱</CardTitle>
                <CardDescription className="text-base font-medium">Fully Responsive</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mobile-first design that works perfectly on all devices and screen sizes</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">🔍</CardTitle>
                <CardDescription className="text-base font-medium">Intelligent Search</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Advanced search with debounced input, smart suggestions, and comprehensive filtering</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">♿</CardTitle>
                <CardDescription className="text-base font-medium">Accessibility First</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">WCAG compliant with keyboard navigation, screen reader support, and focus management</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">🛡️</CardTitle>
                <CardDescription className="text-base font-medium">Robust & Reliable</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Comprehensive error handling, graceful fallbacks, and 90%+ test coverage</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <ThumboardTimeline />
      </section>

      {/* Contact and Social Section */}
      <section className="py-12 sm:py-16 px-4 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto px-2">
            Have questions, feedback, or want to collaborate? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Contact Email */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us
              </CardTitle>
              <CardDescription>Get in touch for any inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="mailto:connect@thumboard.in"
                className="text-primary hover:underline font-medium"
              >
                connect@thumboard.in
              </Link>
            </CardContent>
          </Card>

          {/* Mihir's Social Links */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Mihir Jadhav</CardTitle>
              <CardDescription>Co-founder & Developer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="https://www.linkedin.com/in/-mihirjadhav/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="https://x.com/@mhrjdv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter/X
                <ExternalLink className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          {/* Debashis's Social Links */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Debashis</CardTitle>
              <CardDescription>Co-founder & Developer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="https://www.linkedin.com/in/heydeb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="https://x.com/@heydebashis"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter/X
                <ExternalLink className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>

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
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

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
