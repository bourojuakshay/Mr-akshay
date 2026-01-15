"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Leaf, Zap, Users, Globe, ChevronRight } from "lucide-react"

export default function AboutPage() {
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
    <div className="min-h-screen bg-background pb-28 md:pb-12">

      <div className="relative py-8 sm:py-16 px-4 sm:px-6 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10" />
        <div className="absolute bottom-40 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-accent/5 rounded-full blur-[70px] md:blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-7xl font-black text-foreground tracking-tight mb-6 leading-tight">
              Transforming Waste <br /> into <span className="text-primary">Wealth.</span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              EcoReward is more than just an app; it's a movement towards a circular economy where every responsible action is celebrated.
            </p>
          </div>

          {/* Mission & Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
            <div className="md:col-span-12 lg:col-span-8 bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-6 uppercase tracking-tight">Our Mission</h2>
              <p className="text-muted-foreground text-base sm:text-xl leading-relaxed font-medium">
                EcoReward is dedicated to making waste management rewarding. We believe that sustainable practices should
                be incentivized and celebrated. Our platform connects users with waste disposal facilities, allowing them
                to earn points for responsible waste management while contributing to a cleaner environment.
              </p>
            </div>

            <div className="md:col-span-6 lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 hover:border-primary/50 transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-widest">Eco-Friendly</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Support environmental sustainability with every waste disposal
              </p>
            </div>

            <div className="md:col-span-6 lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 hover:border-accent/50 transition-all group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-widest">Rewards</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Earn points instantly for every waste item you dispose
              </p>
            </div>

            <div className="md:col-span-6 lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 hover:border-primary/50 transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-widest">Community</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Join thousands of users building a sustainable world
              </p>
            </div>

            <div className="md:col-span-6 lg:col-span-4 bg-card border border-border rounded-[2.5rem] p-8 hover:border-accent/50 transition-all group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3 uppercase tracking-widest">Impact</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Track your environmental score and global contribution
              </p>
            </div>
          </div>

          {/* How It Works - Premium Step-by-Step */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 mb-16">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-10 h-1 bg-primary rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight">How It Works</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground mb-2 uppercase tracking-widest">Join Us</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">Create your account with email or Google in seconds</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground mb-2 uppercase tracking-widest">Find Points</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">Locate verified waste disposal points with EcoReward QR codes</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground mb-2 uppercase tracking-widest">Scan & Earn</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">Scan the QR code and earn credits for every responsible disposal</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-muted border border-border rounded-2xl flex items-center justify-center font-black text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground mb-2 uppercase tracking-widest">Get Rewards</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">Accumulate credits and unlock high-value environmental rewards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional CTA Section */}
          <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[3rem] p-8 sm:p-16 text-center shadow-2xl scanner-border">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-tight">Ready to Make a <br /> <span className="text-cyan-400">Difference?</span></h2>
              <p className="text-slate-400 text-base sm:text-lg mb-10 font-medium font-medium leading-relaxed">
                Join the thousands of recyclers who are transforming the planet, one scan at a time. Every action contributes to a cleaner world.
              </p>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 text-slate-900 font-black rounded-2xl hover:bg-cyan-400 transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/20 uppercase tracking-widest text-sm"
              >
                Start Scanning <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Contact & Support Section */}
          <div className="mt-16 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-2">
              <h3 className="text-lg font-black text-foreground uppercase tracking-widest">Questions?</h3>
              <p className="text-muted-foreground text-sm font-medium">Our support team is here to help you 24/7</p>
            </div>

            <a
              href="mailto:support@ecoreward.com"
              className="inline-flex items-center gap-3 px-6 py-3 bg-muted border border-border rounded-2xl text-primary hover:bg-primary/5 hover:border-primary/30 transition-all font-black uppercase tracking-widest text-xs"
            >
              Contact Support
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
