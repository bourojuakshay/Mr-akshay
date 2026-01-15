"use client"

import { Leaf, Droplets, Wind, TrendingUp, Award } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ImpactPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/")
        }
    }, [user, loading, router])

    const stats = [
        {
            label: "Plastic Recycled",
            value: "12.5 kg",
            icon: Leaf,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            label: "CO2 Saved",
            value: "4.8 kg",
            icon: Wind,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Water Saved",
            value: "150 L",
            icon: Droplets,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
        },
        {
            label: "Eco Points",
            value: "850",
            icon: TrendingUp,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
    ]

    if (loading || !user) return null

    return (
        <div className="min-h-screen bg-background text-foreground">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col gap-8">
                    {/* Hero Section */}
                    <section className="bg-gradient-to-br from-card to-muted rounded-3xl p-8 border border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-0" />
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Environmental Impact</h1>
                            <p className="text-slate-400 max-w-2xl text-lg">
                                Every piece of waste you recycle makes a difference. See how your responsible choices are helping the planet thrive.
                            </p>
                        </div>
                    </section>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon
                            return (
                                <div key={idx} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-colors">
                                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-slate-400 text-sm">{stat.label}</div>
                                </div>
                            )
                        })}
                    </section>

                    {/* Achievement Section */}
                    <section className="bg-card border border-border rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Sustainability Milestone</h2>
                                <p className="text-slate-400">You're in the top 15% of recyclers this month!</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Carbon Neutral Progress</span>
                                    <span className="text-primary">75%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[75%]" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 italic">
                                Tips: Recycling 2kg more dry waste will help you reach the "Eco Warrior" level.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
