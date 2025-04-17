import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/context/user-context"
import { QueryProvider } from "@/context/query-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EventHub - Event Registration App",
  description: "Discover and register for amazing events",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <UserProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Toaster />
                <Footer />
              </div>
            </UserProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
