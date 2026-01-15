"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { CreditCard, Wallet, ArrowUpRight, ChevronRight } from "lucide-react"
import Link from "next/link"

export function WalletCard() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState(0)
  const [displayWallet, setDisplayWallet] = useState(0)

  useEffect(() => {
    if (!user) return

    const userRef = doc(db, "users", user.uid)
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        const data = doc.data()
        if (data) {
          setWallet(data.wallet || 0)
        }
      },
      (err) => {
        console.error("WalletCard subscription error:", err)
      },
    )

    return () => unsubscribe()
  }, [user])

  // Animate wallet counter
  useEffect(() => {
    if (displayWallet === wallet) return

    const interval = setInterval(() => {
      setDisplayWallet((prev) => {
        if (Math.abs(prev - wallet) < 0.01) return wallet
        return prev + (wallet - prev) / 10
      })
    }, 50)

    return () => clearInterval(interval)
  }, [wallet, displayWallet])

  return (
    <Link
      href="/transactions"
      className="block relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/10 active:scale-[0.98] cursor-pointer scanner-border"
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Background Shapes */}
      <div className="absolute -right-20 -top-20 w-48 md:w-64 h-48 md:h-64 bg-cyan-500/10 rounded-full blur-[60px] md:blur-[80px] group-hover:bg-cyan-500/20 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-48 md:w-64 h-48 md:h-64 bg-blue-600/10 rounded-full blur-[60px] md:blur-[80px] group-hover:bg-blue-600/20 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg md:rounded-xl">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-[10px] md:text-sm font-bold tracking-widest uppercase">Digital Wallet</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50 group-hover:bg-slate-700 transition-colors">
            <span className="text-[9px] font-black uppercase text-cyan-400 tracking-tighter">Manage</span>
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium ml-1">Current Balance</p>
          <div className="flex items-baseline gap-1 md:gap-2 overflow-hidden">
            <span className="text-2xl md:text-4xl font-bold text-slate-300">₹</span>
            <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] truncate">
              {displayWallet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Account Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 group-hover:bg-white/10 transition-colors">
            <span className="text-[10px] text-slate-400 font-bold uppercase">View History</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
          </div>
        </div>
      </div>
    </Link>
  )
}
