"use client"

import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Moon, Sun, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) return null

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/impact", label: "Impact" },
    { href: "/scanner", label: "Scan" },
    { href: "/about", label: "About" },
    { href: "/profile", label: "Profile" },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <>
      <header className="hidden md:block sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                ♻️
              </div>
              <span className="hidden sm:inline">EcoReward</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle - REMOVED for Bottom Nav UX */}
              {/* 
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              */}
            </div>
          </div>

          {/* Mobile Navigation - REMOVED for Bottom Nav UX */}
          {/* 
          {mobileMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          */}
        </div>
      </header>
    </>
  )
}
