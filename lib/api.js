// Mock API functions for demonstration purposes
// In a real app, these would make actual API calls to your backend

// Mock data
const mockEvents = [
  {
    id: "1",
    title: "Web Development Workshop",
    description:
      "Learn the latest web development techniques and tools in this hands-on workshop. Perfect for beginners and intermediate developers looking to level up their skills.",
    date: "April 24, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Tech Hub, 123 Main St",
    organizer: "Code Academy",
    category: "Technology",
    image: "/web.png?height=400&width=600",
    registeredCount: 45,
    capacity: 50,
  },
  {
    id: "2",
    title: "Business Networking Mixer",
    description:
      "Connect with local entrepreneurs and business professionals. Expand your network and discover new opportunities for collaboration.",
    date: "April 29, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Downtown Conference Center",
    organizer: "Business Alliance",
    category: "Networking",
    image: "/placeholder.svg?height=400&width=600",
    registeredCount: 32,
    capacity: 100,
  },
  {
    id: "3",
    title: "AI in Healthcare Conference",
    description:
      "Explore the cutting-edge applications of artificial intelligence in healthcare. Leading experts will discuss the latest research and real-world implementations.",
    date: "June 5, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Medical Research Center",
    organizer: "HealthTech Association",
    category: "Technology",
    image: "/AI.webp?height=400&width=600",
    registeredCount: 120,
    capacity: 150,
  },
  {
    id: "4",
    title: "Summer Music Festival",
    description:
      "Enjoy a day of live music performances from local and national artists. Food trucks and activities for all ages.",
    date: "July 10, 2025",
    time: "12:00 PM - 10:00 PM",
    location: "City Park Amphitheater",
    organizer: "City Arts Council",
    category: "Entertainment",
    image: "/summer.jpeg?height=400&width=600",
    registeredCount: 850,
    capacity: 1000,
  },
  {
    id: "5",
    title: "Startup Pitch Competition",
    description:
      "Watch innovative startups pitch their ideas to a panel of investors. Networking opportunities available after the main event.",
    date: "June 15, 2025",
    time: "3:00 PM - 7:00 PM",
    location: "Innovation Center",
    organizer: "Venture Capital Group",
    category: "Business",
    image: "/standUp.jpeg?height=400&width=600",
    registeredCount: 75,
    capacity: 100,
  },
  {
    id: "6",
    title: "Yoga in the Park",
    description:
      "Join us for a relaxing yoga session in the park. All skill levels welcome. Bring your own mat and water bottle.",
    date: "May 25, 2025",
    time: "8:00 AM - 9:30 AM",
    location: "Riverside Park",
    organizer: "Wellness Collective",
    category: "Health",
    image: "/yoga.jpg?height=400&width=600",
    registeredCount: 28,
    capacity: 50,
  },
]

// Mock API functions with artificial delay to simulate network requests
export async function fetchEvents() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return mockEvents
}

export async function fetchEventById(id) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockEvents.find((event) => event.id === id)
}

export async function fetchUserEvents(userId) {
  if (!userId) {
    return { upcoming: [], past: [] }
  }

  await new Promise((resolve) => setTimeout(resolve, 700))

  // Get user from localStorage to get registered events
  const userJson = localStorage.getItem("user")
  if (!userJson) {
    return { upcoming: [], past: [] }
  }

  const user = JSON.parse(userJson)
  const registeredEventIds = user.registeredEvents || []

  const registeredEvents = mockEvents.filter((event) =>
    registeredEventIds.includes(event.id)
  )

  // Split into upcoming and past events based on date
  const currentDate = new Date()
  const upcoming = []
  const past = []

  registeredEvents.forEach((event) => {
    const eventDate = new Date(event.date)
    if (eventDate > currentDate) {
      upcoming.push(event)
    } else {
      past.push(event)
    }
  })

  return { upcoming, past }
}

// export async function registerForEvent({ userId, eventId, registrationData }) {
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // In a real app, this would make an API call to register the user
//   // For this demo, we'll update the user in localStorage

//   const userJson = localStorage.getItem("user")
//   if (!userJson) {
//     throw new Error("User not found")
//   }

//   const user = JSON.parse(userJson)

//   // Add the event to the user's registered events
//   const registeredEvents = user.registeredEvents || []
//   if (!registeredEvents.includes(eventId)) {
//     user.registeredEvents = [...registeredEvents, eventId]
//     localStorage.setItem("user", JSON.stringify(user))
//   }

//   // In a real app, we would also update the event's registeredCount
//   // For this demo, we'll just return successfully
//   return
// }

export async function registerForEvent({ userId, eventId, registrationData }) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userJson = localStorage.getItem("user")
  const allUsersJson = localStorage.getItem("allUsers")

  if (!userJson || !allUsersJson) {
    throw new Error("User or users list not found")
  }

  const user = JSON.parse(userJson)
  const allUsers = JSON.parse(allUsersJson)

  const registeredEvents = user.registeredEvents || []
  if (!registeredEvents.includes(eventId)) {
    const updatedUser = {
      ...user,
      registeredEvents: [...registeredEvents, eventId],
    }

    // Update localStorage user
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update allUsers list
    const updatedAllUsers = allUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    )
    localStorage.setItem("allUsers", JSON.stringify(updatedAllUsers))
  }

  return
}

export async function unregisterFromEvent({ userId, eventId }) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const userJson = localStorage.getItem("user")
  const allUsersJson = localStorage.getItem("allUsers")

  if (!userJson || !allUsersJson) {
    throw new Error("User or users list not found")
  }

  const user = JSON.parse(userJson)
  const allUsers = JSON.parse(allUsersJson)

  const registeredEvents = user.registeredEvents || []

  // Only proceed if the event exists in user's registrations
  if (registeredEvents.includes(eventId)) {
    const updatedUser = {
      ...user,
      registeredEvents: registeredEvents.filter((id) => id !== eventId),
    }

    // Update localStorage user
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Update allUsers list
    const updatedAllUsers = allUsers.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    )
    localStorage.setItem("allUsers", JSON.stringify(updatedAllUsers))
  }

  return
}
