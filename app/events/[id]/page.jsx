"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/context/user-context"
import { fetchEventById, unregisterFromEvent } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function EventDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, updateUser } = useUser()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isRegistering, setIsRegistering] = useState(false)

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
  })

  const handleRegister = () => {
    if (!user) {
      // Redirect to login if not logged in
      router.push("/login?redirect=/events/" + id)
      return
    }

    // Navigate to registration form
    router.push(`/events/${id}/register`)
  }

  // const handleUnregister = async () => {
  //   if (!user) return

  //   setIsRegistering(true)
  //   try {
  //     await unregisterFromEvent({ userId: user.id, eventId: event.id })

  //     await queryClient.invalidateQueries({
  //       queryKey: ["event", id],
  //       exact: false,
  //       refetchType: "all",
  //     })

  //     await queryClient.invalidateQueries({
  //       queryKey: ["events"],
  //       exact: false,
  //       refetchType: "all",
  //     })

  //     router.refresh()
  //     router.push("/")

  //     toast({
  //       title: "Unregistered successfully!",
  //       description: `You've successfully unregistered for ${event.title}`,
  //     })
  //   } catch (err) {
  //     console.error("Failed to unregister", err)
  //     toast({
  //       title: "Failed to Unregistered",
  //       description: `Error unregistering for ${event.title}`,
  //     })
  //   } finally {
  //     setIsRegistering(false)
  //   }
  // }
  const handleUnregister = async () => {
    if (!user) return

    setIsRegistering(true)
    try {
      await unregisterFromEvent({ userId: user.id, eventId: event.id })

      // 1. Update user in localStorage
      const updatedUser = {
        ...user,
        registeredEvents: user.registeredEvents?.filter(
          (eventId) => eventId !== event.id
        ),
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // setUser(updatedUser)
      updateUser(updatedUser)

      // 2. Update user in context if setUser is available
      // Assuming useUser provides setUser
      if (typeof window !== "undefined") {
        const userUpdatedEvent = new CustomEvent("userUpdated", {
          detail: updatedUser,
        })
        window.dispatchEvent(userUpdatedEvent)
      }

      // 3. Invalidate queries
      await queryClient.invalidateQueries({
        queryKey: ["event", id],
        exact: false,
        refetchType: "all",
      })

      await queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: false,
        refetchType: "all",
      })

      await queryClient.invalidateQueries({
        queryKey: ["user"],
      })

      // 4. Toast
      toast({
        title: "Unregistered successfully!",
        description: `You've successfully unregistered from "${event.title}"`,
      })

      // 5. Refresh + redirect
      router.refresh()
      router.push("/")
    } catch (err) {
      console.error("Failed to unregister", err)
      toast({
        title: "Failed to unregister",
        description: `There was a problem unregistering from "${event.title}".`,
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return <EventDetailsSkeleton />
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/#events">Browse Events</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isUserRegistered = user?.registeredEvents?.includes(event.id)

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {event.organizer}
              </CardDescription>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
              {event.category}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-md overflow-hidden mb-6 bg-muted">
            {event.image ? (
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">
                  No image available
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">
                  {event.registeredCount}/{event.capacity} registered
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">About This Event</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          {isUserRegistered ? (
            <div className="w-full space-y-3">
              <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-4 py-3 rounded-md">
                You're registered for this event!
              </div>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleUnregister}
                disabled={isRegistering}
              >
                Cancel Registration
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleRegister}
              disabled={
                isRegistering || event.registeredCount >= event.capacity
              }
            >
              {event.registeredCount >= event.capacity
                ? "Event Full"
                : "Register Now"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

function EventDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
          </div>

          <div className="mb-6 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  )
}
