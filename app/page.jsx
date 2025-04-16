import { Suspense } from "react"
import Link from "next/link"
import EventsList from "@/components/events-list"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">EventHub</h1>
          <p className="text-muted-foreground">
            Discover and register for amazing events
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/profile">
            <Button variant="outline">My Profile</Button>
          </Link>
        </div>
      </header>

      <section className="mb-12">
        <div className="rounded-lg bg-gradient-to-r from-violet-950 via-violet-900 to-violet-800 p-8 text-white">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Find Your Next Experience
            </h2>
            <p className="text-lg mb-6">
              Browse through hundreds of events and register for the ones that
              interest you.
            </p>
            <Button size="lg" asChild>
              <Link href="#events">Explore Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="events" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Link href="/events">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>
        <Suspense fallback={<div>Loading events...</div>}>
          <EventsList />
        </Suspense>
      </section>
    </div>
  )
}
