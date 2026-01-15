"use client"

import { useEffect, useState } from "react"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

interface Claim {
  id: string
  amount: number
  wasteType: string
  claimedAt: Date
}

export function RecentClaims() {
  const { user } = useAuth()
  const [claims, setClaims] = useState<Claim[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    setLoading(true)
    setError("")
    const q = query(
      collection(db, "qr_codes"),
      where("claimedBy", "==", user.uid),
      where("claimed", "==", true),
      orderBy("claimedAt", "desc"),
      limit(5),
    )

    getDocs(q)
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          amount: doc.data().amount,
          wasteType: doc.data().wasteType,
          claimedAt: doc.data().claimedAt?.toDate?.() || new Date(),
        }))
        setClaims(data)
      })
      .catch((err) => {
        console.error("RecentClaims fetch error:", err)
        setError("Failed to load recent claims. Please ensure Firestore rules and indexes are set up.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  const wasteTypeEmoji = {
    dry: "📦",
    wet: "🌱",
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Claims</h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      ) : claims.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No claims yet. Scan a QR code to earn!</p>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{wasteTypeEmoji[claim.wasteType as keyof typeof wasteTypeEmoji] || "♻️"}</div>
                <div>
                  <div className="text-sm font-medium text-white capitalize">{claim.wasteType} Waste</div>
                  <div className="text-xs text-gray-400">
                    {claim.claimedAt.toLocaleDateString()} {claim.claimedAt.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-400">+₹{claim.amount.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
