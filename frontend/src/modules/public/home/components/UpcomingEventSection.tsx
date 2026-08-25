"use client";

import React from "react";
import { Countdown } from "./Countdown";
import { Calendar, MapPin, Clock, Users, ExternalLink, Tag } from "lucide-react";
import { Button } from "@/components/ui";
import { getNextUpcomingEvent, getFeaturedEvents, type PublicEvent } from "../data/events";
import { cn } from "@/utils/cn";

interface UpcomingEventSectionProps {
  className?: string;
}

export const UpcomingEventSection: React.FC<UpcomingEventSectionProps> = ({ className }) => {
  const nextEvent = getNextUpcomingEvent();
  const featuredEvents = getFeaturedEvents().filter((e) => e.id !== nextEvent?.id).slice(0, 2);

  if (!nextEvent) {
    return (
      <section className={cn("py-20 bg-muted/30", className)} aria-labelledby="upcoming-events-title">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="upcoming-events-title" className="text-3xl font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No upcoming events at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <section className={cn("py-20 bg-muted/30", className)} aria-labelledby="upcoming-events-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="relative h-2 w-2 rounded-full bg-primary animate-pulse" />
            Next Live Event
          </span>
          <h2 id="upcoming-events-title" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {nextEvent.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {nextEvent.shortDescription}
          </p>
        </div>

        {/* Main Event Card */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Event Image & Countdown */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-card border border-border">
            {nextEvent.imageUrl && (
              <img
                src={nextEvent.imageUrl}
                alt={nextEvent.title}
                className="w-full h-64 lg:h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(nextEvent.startDate)}
                  {nextEvent.endDate !== nextEvent.startDate && (
                    <> – {formatDate(nextEvent.endDate)}</>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {nextEvent.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(nextEvent.startDate)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    nextEvent.category === "conference" && "bg-blue-100 text-blue-700",
                    nextEvent.category === "workshop" && "bg-green-100 text-green-700",
                    nextEvent.category === "webinar" && "bg-purple-100 text-purple-700",
                    nextEvent.category === "meetup" && "bg-orange-100 text-orange-700",
                    nextEvent.category === "hackathon" && "bg-red-100 text-red-700"
                  )}
                >
                  {nextEvent.category.charAt(0).toUpperCase() + nextEvent.category.slice(1)}
                </span>
                {nextEvent.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded text-xs text-muted-foreground bg-background/80 border border-border">
                    #{tag}
                  </span>
                ))}
              </div>
              <Countdown
                targetDate={nextEvent.startDate}
                eventLabel={nextEvent.title}
                size="lg"
                showLabel={true}
              />
            </div>
          </div>

          {/* Event Details & CTA */}
          <div className="space-y-6 p-6 lg:p-8 bg-card border border-border rounded-2xl">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Event Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{formatDate(nextEvent.startDate)}</p>
                    <p className="text-muted-foreground">{formatTime(nextEvent.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{nextEvent.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {nextEvent.capacity
                        ? `${nextEvent.registeredCount?.toLocaleString() || 0} / ${nextEvent.capacity.toLocaleString()} registered`
                        : "Unlimited capacity"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Organized by</p>
                    <p className="text-muted-foreground">{nextEvent.organizer}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">{nextEvent.description}</p>
              <div className="flex flex-col gap-3">
                {nextEvent.registrationUrl && (
                  <Button
                    className="w-full"
                    size="lg"
                    asChild
                  >
                    <a href={nextEvent.registrationUrl} target="_blank" rel="noopener noreferrer">
                      Register Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Featured Events</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <article
                  key={event.id}
                  className="group relative bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:border-primary/30"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          event.category === "conference" && "bg-blue-100 text-blue-700",
                          event.category === "workshop" && "bg-green-100 text-green-700",
                          event.category === "webinar" && "bg-purple-100 text-purple-700",
                          event.category === "meetup" && "bg-orange-100 text-orange-700",
                          event.category === "hackathon" && "bg-red-100 text-red-700"
                        )}
                      >
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                      {event.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {event.shortDescription}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    </div>
                    {event.registrationUrl && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                          View Details
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <a href="/events" target="_blank" rel="noopener noreferrer">
                  View All Events
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventSection;