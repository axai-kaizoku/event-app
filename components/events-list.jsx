"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchEvents } from "@/lib/api"
import EventCard from "@/components/event-card"
import { useUser } from "@/context/user-context"

export default function EventsList() {
  const { user } = useUser()

  const {
    data: events,
    status,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  })

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="aspect-video bg-muted rounded-md" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </div>
          ))}
      </div>
    )
  }

  if (error || !events) {
    return <div>Failed to load events. Please try again later.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isRegistered={user?.registeredEvents?.includes(event.id)}
        />
      ))}
    </div>
  )
}
