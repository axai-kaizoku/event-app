"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useUser } from "@/context/user-context"
import { fetchUserEvents } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/event-card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserIcon } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isUserLoading } = useUser()

  const { data: userEvents, isLoading } = useQuery({
    queryKey: ["userEvents", user?.id],
    queryFn: () => fetchUserEvents(user?.id),
    enabled: !!user?.id,
  })

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login?redirect=/profile")
    }
  }, [user, isUserLoading, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Member since</p>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={logout}>
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>My Events</CardTitle>
            <CardDescription>Manage your event registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <EventCardSkeleton key={i} />
                      ))}
                  </div>
                ) : userEvents?.upcoming.length ? (
                  <div className="grid grid-cols-1 gap-4">
                    {userEvents.upcoming.map((event) => (
                      <EventCard key={event.id} event={event} isRegistered />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any upcoming events yet.
                    </p>
                    <Button asChild>
                      <a href="/#events">Browse Events</a>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {isLoading ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Array(2)
                      .fill(0)
                      .map((_, i) => (
                        <EventCardSkeleton key={i} />
                      ))}
                  </div>
                ) : userEvents?.past.length ? (
                  <div className="grid grid-cols-1 gap-4">
                    {userEvents.past.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isRegistered
                        isPast
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No past events found.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EventCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
