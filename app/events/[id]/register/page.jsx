"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchEventById } from "@/lib/api"
import { useUser } from "@/context/user-context"
import RegistrationForm from "@/components/registration-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect } from "react"

export default function RegisterPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isUserLoading } = useUser()

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login?redirect=/events/" + id + "/register")
    }
  }, [user, isUserLoading, router, id])

  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event) {
    router.push("/#events")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Register for {event.title}</CardTitle>
          <CardDescription>
            Please fill out the form below to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm event={event} />
        </CardContent>
      </Card>
    </div>
  )
}
