"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, QrCode, Info, User, BarChart3 } from "lucide-react"

export function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { href: "/dashboard", label: "Home", icon: Home },
        { href: "/impact", label: "Impact", icon: BarChart3 },
        { href: "/scanner", label: "Scan", icon: QrCode, isAction: true },
        { href: "/about", label: "About", icon: Info },
        { href: "/profile", label: "Profile", icon: User },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    if (item.isAction) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center w-16 relative"
                            >
                                <div className={`absolute -top-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background transform transition-transform active:scale-90 ${active ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                                    <QrCode className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <span className={`text-[10px] font-medium mt-8 ${active ? "text-primary" : "text-muted-foreground"}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative py-1"
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-primary/10" : ""}`}>
                                <Icon className={`w-6 h-6 ${active ? "text-primary fill-primary/10" : "text-muted-foreground"}`} />
                            </div>
                            <span className={`text-[10px] font-medium tracking-tight ${active ? "text-primary" : "text-muted-foreground"}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
