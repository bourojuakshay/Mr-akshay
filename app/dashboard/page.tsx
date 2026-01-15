"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { WalletCard } from "@/components/wallet-card"
import { RecentClaims } from "@/components/recent-claims"
import Link from "next/link"
import { Zap, TrendingUp, Leaf } from "lucide-react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

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

        <div className="max-w-5xl mx-auto">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 break-all">{user.email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-primary/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Earned</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">0 pts</p>
                </div>
                <Zap className="w-10 h-10 text-primary/20" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-accent/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Waste Scanned</p>
                  <p className="text-2xl sm:text-3xl font-bold text-accent mt-2">0 kg</p>
                </div>
                <Leaf className="w-10 h-10 text-accent/20" />
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 sm:p-6 hover:border-primary/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Impact Score</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">Beginner</p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary/20" />
              </div>
            </div>
          </div>

          {/* Wallet and scan section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <WalletCard />
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/scanner"
                className="flex items-center justify-center gap-2 py-4 px-6 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition transform hover:scale-105 duration-200 active:scale-95"
              >
                📱 Scan QR
              </Link>
              <Link
                href="/about"
                className="flex items-center justify-center gap-2 py-4 px-6 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition duration-200"
              >
                ℹ️ Learn More
              </Link>
            </div>
          </div>

          {/* Recent claims */}
          <div>
            <RecentClaims />
          </div>
        </div>
      </div>
    </div>
  )
}
