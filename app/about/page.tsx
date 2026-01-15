"use client"

import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative py-6 sm:py-8 px-4 sm:px-6">
        {/* background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-in fade-in">
            <div className="text-5xl sm:text-6xl font-bold mb-4">♻️</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">EcoReward</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforming waste management through rewards. Every responsible disposal is a step towards a sustainable
              future.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              EcoReward is dedicated to making waste management rewarding. We believe that sustainable practices should
              be incentivized and celebrated. Our platform connects users with waste disposal facilities, allowing them
              to earn points for responsible waste management while contributing to a cleaner environment.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Eco-Friendly</h3>
                  <p className="text-muted-foreground text-sm">
                    Support environmental sustainability with every waste disposal
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Rewards</h3>
                  <p className="text-muted-foreground text-sm">
                    Earn points instantly for every waste item you responsibly dispose
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Community Driven</h3>
                  <p className="text-muted-foreground text-sm">
                    Join thousands of users building a sustainable community
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Global Impact</h3>
                  <p className="text-muted-foreground text-sm">
                    Track your environmental impact and contribute to global sustainability goals
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Sign Up or Login</h3>
                  <p className="text-muted-foreground text-sm">Create your EcoReward account with email or Google</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Find QR Codes</h3>
                  <p className="text-muted-foreground text-sm">Locate waste disposal points with EcoReward QR codes</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Scan & Dispose</h3>
                  <p className="text-muted-foreground text-sm">Scan the QR code and dispose your waste responsibly</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Earn Rewards</h3>
                  <p className="text-muted-foreground text-sm">Accumulate points and unlock exciting rewards</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50 rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start earning rewards while helping the environment. Every action counts!
            </p>
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition duration-200"
            >
              Start Scanning <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 sm:p-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Questions?</h3>
            <p className="text-muted-foreground mb-4">
              We'd love to hear from you! For support and inquiries, contact us at:
            </p>
            <a
              href="mailto:support@ecoreward.com"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              support@ecoreward.com
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
