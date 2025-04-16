import Link from "next/link"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function EventCard({ event, isRegistered, isPast }) {
  const isFull = event.registeredCount >= event.capacity

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-video relative rounded-t-lg overflow-hidden">
          {event.image ? (
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={isRegistered ? "default" : isFull ? "outline" : "secondary"}>
              {isRegistered ? "Registered" : isFull ? "Full" : `${event.capacity - event.registeredCount} spots left`}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={isPast ? "outline" : isRegistered ? "secondary" : "default"} asChild>
          <Link href={`/events/${event.id}`}>
            {isPast ? "View Details" : isRegistered ? "View Registration" : "Register Now"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
