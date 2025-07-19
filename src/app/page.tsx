'use client'


import { Suspense } from 'react'
import { ContentBrowser } from "@/components/layout/content-browser";



export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }>
        <ContentBrowser
          onSearch={() => {}}
          onItemClick={() => {}}
          onItemLike={() => {}}
          onItemDownload={() => {}}
          onItemShare={() => {}}
        />
      </Suspense>
    </div>
  );
}
