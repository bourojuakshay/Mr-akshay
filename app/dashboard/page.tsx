"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { WalletCard } from "@/components/wallet-card"
import { RecentClaims } from "@/components/recent-claims"
import { StatCard } from "@/components/stat-card"
import Link from "next/link"
import { Zap, TrendingUp, Leaf, Scan, ChevronRight } from "lucide-react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }, [])

  if (loading || !user || !mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold tracking-tight text-foreground/80">Securing your session...</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12">
      <div className="relative py-6 sm:py-12 px-4 sm:px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10" />
        <div className="absolute bottom-40 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-accent/5 rounded-full blur-[70px] md:blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 md:w-8 h-1 bg-primary rounded-full" />
                <p className="text-primary font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px]">{greeting}</p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                Welcome back, <br className="sm:hidden" /> <span className="text-primary">Recycler!</span>
              </h1>
              <p className="text-muted-foreground font-medium text-xs sm:text-base border-l-2 border-border pl-3 md:pl-4 mt-2 md:mt-4 break-all max-w-[280px] sm:max-w-none">
                {user.email}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border p-2 rounded-2xl shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                🏆
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Current Rank</p>
                <p className="text-sm font-black text-foreground uppercase tracking-widest">Eco Master</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Wallet & Main Actions */}
            <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-8">
              <WalletCard />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/scanner"
                  className="group relative flex items-center justify-between p-6 bg-primary text-primary-foreground rounded-3xl overflow-hidden active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                >
                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-lg font-black uppercase tracking-widest">Start Scanning</span>
                    <span className="text-xs opacity-80 font-medium">Turn waste into rewards instantly</span>
                  </div>
                  <div className="relative z-10 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Scan className="w-6 h-6" />
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent skew-x-[-20deg] group-hover:translate-x-full transition-transform duration-700" />
                </Link>

                <Link
                  href="/impact"
                  className="group flex items-center justify-between p-6 bg-card border border-border hover:border-primary/50 transition-all rounded-3xl active:scale-[0.98]"
                >
                  <div className="flex flex-col gap-1 text-card-foreground">
                    <span className="text-lg font-black uppercase tracking-widest">Your Impact</span>
                    <span className="text-xs text-muted-foreground font-medium">Check your environmental score</span>
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-2xl border border-border flex items-center justify-center group-hover:border-primary/30 transition-all">
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                  </div>
                </Link>
              </div>

              <RecentClaims />
            </div>

            {/* Right Column: Stats & Community highlights (for wider screens, falls below on mobile) */}
            <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-4">
              <StatCard
                label="Total Credits"
                value="2,450"
                icon={Zap}
                trend="+12%"
                color="primary"
              />
              <StatCard
                label="Waste Saved"
                value="45.8 kg"
                icon={Leaf}
                trend="Elite"
                color="accent"
              />
              <StatCard
                label="Carbon Offset"
                value="128 kg"
                icon={TrendingUp}
                color="blue"
              />

              {/* Quick info card */}
              <div className="mt-4 p-6 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="bg-primary/20 p-1.5 rounded-lg text-primary">🌱</span>
                  Eco Tip
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Did you know that recycling a single plastic bottle can save enough energy to power a light bulb for 3 hours?
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
