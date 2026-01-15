"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { CreditCard, Wallet, ArrowUpRight } from "lucide-react"

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
    <div className="relative group overflow-hidden bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/10 active:scale-[0.99] scanner-border">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Background Shapes */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-colors duration-500" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">Digital Wallet</span>
          </div>
          <CreditCard className="w-6 h-6 text-slate-700" />
        </div>

        <div className="space-y-1">
          <p className="text-slate-500 text-xs font-medium ml-1">Current Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-slate-300">₹</span>
            <span className="text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
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

          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 group-hover:bg-white/10 transition-colors cursor-default">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Ready to claim</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
