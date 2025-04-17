"use client"

import Link from "next/link"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserIcon } from "lucide-react"

export default function Header() {
  const { user } = useUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            EventHub
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#events"
              className="text-sm hover:text-primary transition-colors"
            >
              Events
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {user ? (
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">My Profile</span>
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
