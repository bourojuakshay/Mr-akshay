"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useTheme } from "@/lib/theme-context"
import { Mail, Calendar, Trophy, Target, LogOut, Sun, Moon } from "lucide-react"

export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [userStats, setUserStats] = useState<any>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return
      try {
        const userRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          setUserStats(userDoc.data())
        }
      } catch (error) {
        console.error("Error fetching user stats:", error)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchUserStats()
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl md:text-2xl text-primary animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="relative py-6 sm:py-8 px-4 sm:px-6">
        {/* background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl font-bold">
                ♻️
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Profile</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{user.email}</span>
                </div>
                {userStats?.createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Member since{" "}
                      {new Date(userStats.createdAt.toDate?.() || userStats.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">Total Points</h3>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-primary">
                {loadingStats ? "..." : userStats?.wallet || 0}
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-accent" />
                <h3 className="font-semibold text-foreground">Items Claimed</h3>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-accent">
                {loadingStats ? "..." : userStats?.claimsCount || 0}
              </p>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Account Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-xl">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
                <div>
                  <p className="font-semibold text-foreground">Theme Mode</p>
                  <p className="text-sm text-muted-foreground">Switch between light and dark</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-3 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 transition-colors"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-primary" />}
                </button>
              </div>

              <button
                onClick={async () => {
                  await logout()
                  router.push("/")
                }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-xl transition-colors font-bold"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
