"use client"

import { createContext, useContext, useState, useEffect } from "react"

const UserContext = createContext(undefined)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const allUsersFromLocal = localStorage.getItem("allUsers")

    // Default demo user only on the first app load (no users in localStorage)
    if (!allUsersFromLocal) {
      const defaultUser = [
        {
          id: "demo",
          name: "Demo User",
          email: "demo@example.com",
          password: "demo@123",
          registeredEvents: ["4"],
          createdAt: "2025-04-17T18:09:47.544Z",
        },
      ]
      localStorage.setItem("allUsers", JSON.stringify(defaultUser))
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("user")
      }
    }

    setIsUserLoading(false)
  }, [])

  const login = (userData) => {
    const allUsersFromLocal = localStorage.getItem("allUsers")
    const allUsers = JSON.parse(allUsersFromLocal)

    const existingUser = allUsers.find((user) => user.email === userData.email)

    if (existingUser) {
      if (existingUser.password === userData.password) {
        setUser(existingUser)
        localStorage.setItem("user", JSON.stringify(existingUser))
        return true
      }
      return false
    }

    return false
  }

  const signup = (userData) => {
    const allUsersFromLocal = localStorage.getItem("allUsers")
    const allUsers = JSON.parse(allUsersFromLocal)

    const existingUser = allUsers.find((user) => user.email === userData.email)

    if (existingUser) {
      return false // Don't login, as user already exists
    }

    const updatedUsers = [...allUsers, userData] // Add new user
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers))

    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  return (
    <UserContext.Provider
      value={{ user, login, signup, logout, updateUser, isUserLoading }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
