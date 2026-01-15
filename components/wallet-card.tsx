"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

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
        if (prev < wallet) {
          return Math.min(prev + (wallet - prev) / 10, wallet)
        }
        return wallet
      })
    }, 50)

    return () => clearInterval(interval)
  }, [wallet, displayWallet])

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 scanner-border">
      <div className="text-gray-400 text-sm mb-4 font-medium">Your Wallet Balance</div>
      <div className="text-4xl sm:text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2 break-words">
        ₹{displayWallet.toFixed(2)}
      </div>
      <div className="text-gray-500 text-sm">Digital Currency</div>

      {/* animated accent line */}
      <div className="mt-6 h-1 w-12 sm:w-16 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-full" />
    </div>
  )
}
