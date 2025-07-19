'use client';

import React from "react";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

export function ThumboardTimeline() {
  const items = [
    {
      id: 1,
      date: "Dec 2024",
      title: "2024 - Launch",
      description: "Thumboard officially launched with a complete visual content discovery platform featuring advanced search, intelligent filtering, and modern UI components. The platform now serves thousands of users daily with lightning-fast search capabilities and an intuitive user interface."
    },
    {
      id: 2,
      date: "Jul 2024",
      title: "Mid 2024 - Core Features",
      description: "Implemented core functionality including responsive masonry grid, advanced search with suggestions, comprehensive filtering system, and dark/light mode support. Added accessibility features, error boundaries, and comprehensive testing suite to ensure a robust user experience across all devices."
    },
    {
      id: 3,
      date: "Jan 2024",
      title: "Early 2024 - Foundation",
      description: "Built the foundation with Next.js 15, TypeScript, and modern tooling including comprehensive testing setup."
    }
  ];

  return (
    <div className="w-full bg-background py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Development Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow the evolution of Thumboard from concept to the powerful visual content discovery platform it is today.
          </p>
        </div>

        <Timeline defaultValue={3}>
          {items.map((item) => (
            <TimelineItem
              key={item.id}
              step={item.id}
              className="group-data-[orientation=vertical]/timeline:sm:ms-32"
            >
              <TimelineHeader>
                <TimelineSeparator />
                <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                  {item.date}
                </TimelineDate>
                <TimelineTitle className="sm:-mt-0.5 text-lg sm:text-xl font-semibold">
                  {item.title}
                </TimelineTitle>
                <TimelineIndicator />
              </TimelineHeader>
              <TimelineContent>
                <p className="text-muted-foreground text-sm md:text-base mb-6">
                  {item.description}
                </p>


              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
