"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    trend?: string
    color?: "primary" | "accent" | "blue"
}

export function StatCard({ label, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
    const colorClasses = {
        primary: "text-primary bg-primary/10 border-primary/20 hover:border-primary/40",
        accent: "text-accent bg-accent/10 border-accent/20 hover:border-accent/40",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40"
    }

    return (
        <div className={`group relative overflow-hidden bg-card border border-border rounded-[1.25rem] md:rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]`}>
            {/* Background Glow */}
            <div className={`absolute -right-4 -top-4 w-20 md:w-24 h-20 md:h-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20 ${color === 'accent' ? 'bg-accent' : 'bg-primary'}`} />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2 md:space-y-3">
                    <p className="text-muted-foreground text-[10px] md:text-sm font-medium tracking-wide uppercase">{label}</p>
                    <div className="flex items-baseline gap-1.5 md:gap-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                            {value}
                        </h3>
                        {trend && (
                            <span className="text-[10px] md:text-xs font-bold text-green-500 bg-green-500/10 px-1.5 md:px-2 py-0.5 rounded-full">
                                {trend}
                            </span>
                        )}
                    </div>
                </div>

                <div className={`p-2 md:p-3 rounded-lg md:rounded-xl border transition-all duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
            </div>

            {/* Bottom Progress Bar Decor */}
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    )
}
