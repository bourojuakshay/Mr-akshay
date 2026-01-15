"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useTheme } from "@/lib/theme-context"
import { StatCard } from "@/components/stat-card"
import { Mail, Calendar, Trophy, Target, LogOut, Sun, Moon, ShieldCheck, User as UserIcon } from "lucide-react"

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold tracking-tight text-foreground/80">Loading your profile...</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12">
      <div className="relative py-8 sm:py-12 px-4 sm:px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10" />
        <div className="absolute bottom-40 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-accent/5 rounded-full blur-[70px] md:blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Enhanced Profile Header */}
          <div className="bg-card border border-border rounded-[2rem] p-6 sm:p-10 mb-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-0 transition-opacity group-hover:opacity-20" />

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 relative z-10">
              {/* Refined Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-primary/20">
                  ♻️
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background border-2 border-primary/20 rounded-lg flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">Profile</h1>
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Verified</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground group">
                    <Mail className="w-4 h-4 transition-colors group-hover:text-primary" />
                    <span className="text-sm font-medium break-all">{user.email}</span>
                  </div>
                  {userStats?.createdAt && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground/60">
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Since {new Date(userStats.createdAt.toDate?.() || userStats.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StatCard
              label="Total Rewards"
              value={loadingStats ? "..." : (userStats?.wallet || 0)}
              icon={Trophy}
              color="primary"
              trend="Point Balance"
            />
            <StatCard
              label="Successful Claims"
              value={loadingStats ? "..." : (userStats?.claimsCount || 0)}
              icon={Target}
              color="accent"
              trend="Completed"
            />
          </div>

          {/* High-Contrast Settings Sections */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-foreground uppercase tracking-[0.2em] ml-2 mb-4">Account Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Theme Toggle Card */}
              <div className="bg-card border border-border rounded-3xl p-6 transition-all hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-foreground">Theme Mode</p>
                    <p className="text-xs text-muted-foreground font-medium">Switch visual appearance</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="w-12 h-12 flex items-center justify-center bg-muted border border-border rounded-2xl transition-all hover:bg-primary/10 hover:border-primary/40 active:scale-90"
                  >
                    {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-primary" />}
                  </button>
                </div>
              </div>

              {/* Account Identity Card */}
              <div className="bg-card border border-border rounded-3xl p-6 opacity-80">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Status</p>
                    <p className="font-black text-foreground uppercase tracking-widest text-sm">Active Account</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={async () => {
                await logout()
                router.push("/")
              }}
              className="group relative w-full flex items-center justify-between p-6 bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 hover:border-destructive/30 rounded-3xl transition-all active:scale-[0.99]"
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-lg font-black text-destructive uppercase tracking-widest">Sign Out</span>
                <span className="text-xs text-destructive/60 font-medium">Securely end your session</span>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
            </button>
          </div>

          {/* Support Info Corner */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">version 1.0.4 • EcoReward</p>
          </div>
        </div>
      </div>
    </div>
  )
}
