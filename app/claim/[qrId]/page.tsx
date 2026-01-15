"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { claimQRCode, getQRCodeInfo, type QRData } from "@/lib/claim-service"
import { Confetti } from "@/components/confetti"
import { useRef } from "react"
import Link from "next/link"

export default function ClaimPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const qrId = params.qrId as string

  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState("")
  const [amount, setAmount] = useState(0)
  const [wasteType, setWasteType] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [alreadyClaimedByMe, setAlreadyClaimedByMe] = useState(false)
  const hasInitiatedClaim = useRef(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Fetch QR code info
    if (qrId && !hasInitiatedClaim.current) {
      getQRCodeInfo(decodeURIComponent(qrId)).then((data: QRData | null) => {
        if (data) {
          setAmount(data.amount)
          setWasteType(data.wasteType)

          if (data.claimed) {
            if (user && data.claimedBy === user.uid) {
              setAlreadyClaimedByMe(true)
              setClaimed(true)
            } else {
              setError("This reward is already claimed")
            }
          } else {
            // Auto-claim
            performClaim()
          }
        } else {
          setError("Invalid QR code")
        }
      })
    }
  }, [user, loading, qrId])

  useEffect(() => {
    if (claimed && !alreadyClaimedByMe) {
      setShowConfetti(true)
    }
  }, [claimed, alreadyClaimedByMe])

  const performClaim = async () => {
    if (!user || claiming || hasInitiatedClaim.current) return

    hasInitiatedClaim.current = true
    setClaiming(true)
    const result = await claimQRCode(decodeURIComponent(qrId), user.uid)
    setClaiming(false)

    if (result.success) {
      setClaimed(true)
      setAmount(result.amount || 0)
    } else {
      setError(result.message)
      hasInitiatedClaim.current = false // Allow retry on failure
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-2xl text-cyan-400 animate-pulse">Loading...</div>
      </div>
    )
  }

  const wasteTypeDisplay = {
    dry: { name: "Dry Waste", emoji: "📦" },
    wet: { name: "Wet Waste", emoji: "🌱" },
  }

  const displayType = wasteType as keyof typeof wasteTypeDisplay

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Confetti trigger={showConfetti} />

      {/* background effects */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${alreadyClaimedByMe ? "bg-red-500/20 animate-pulse" : "bg-cyan-500/10"} rounded-full blur-3xl -z-10`} />
      <div className={`absolute bottom-0 left-0 w-96 h-96 ${alreadyClaimedByMe ? "bg-red-600/20 animate-pulse" : "bg-orange-500/10"} rounded-full blur-3xl -z-10`} />

      <div className="max-w-md w-full">
        {claimed ? (
          /* success state */
          <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 inline-block">
              <div className="relative">
                <div className={`absolute inset-0 ${alreadyClaimedByMe ? "bg-orange-500/30" : "bg-green-500/30"} rounded-full blur-2xl animate-pulse`} />
                <div className={`relative ${alreadyClaimedByMe ? "bg-gradient-to-br from-orange-400 to-red-600" : "bg-gradient-to-br from-green-400 to-green-600"} rounded-full p-6 animate-in scale-in-95 duration-300`}>
                  {alreadyClaimedByMe ? (
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 animate-in slide-in-from-top-4 duration-500">
              {alreadyClaimedByMe ? "Already Claimed" : "Reward Claimed!"}
            </h1>
            <p className="text-gray-400 mb-8">
              {alreadyClaimedByMe ? "This reward is already claimed" : "Your reward has been added to your wallet"}
            </p>

            {/* amount display or already claimed message */}
            <div className={`bg-slate-900/50 border ${alreadyClaimedByMe ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-cyan-500/30"} rounded-2xl p-8 mb-8 scanner-border animate-in slide-in-from-bottom-4 duration-500`}>
              {alreadyClaimedByMe ? (
                <div className="text-2xl font-bold text-red-400 animate-pulse">
                  this reward is already claimed !
                </div>
              ) : (
                <>
                  <div className="text-gray-400 text-sm mb-2">Amount Earned</div>
                  <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text mb-4">
                    ₹{amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">{wasteTypeDisplay[displayType]?.name || "Waste"}</div>
                </>
              )}
            </div>

            {/* celebratory pulse animation */}
            {!alreadyClaimedByMe && (
              <div className="mb-8 flex justify-center gap-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-green-400 rounded-full"
                    style={{
                      animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <Link
              href="/dashboard"
              className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105 duration-200 inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : error ? (
          /* error state */
          <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-6">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Oops!</h1>
            <p className="text-gray-400 mb-6 text-lg font-medium">{error}</p>

            <div className="space-y-3">
              <Link
                href="/scanner"
                className="block py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
              >
                Scan Another Code
              </Link>
              <Link
                href="/dashboard"
                className="block py-3 px-6 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* processing state */
          <div className="text-center">
            <div className="mb-6 inline-block">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-orange-500 rounded-full animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Processing Claim...</h1>
            <p className="text-gray-400">Please wait while we verify and claim your reward</p>

            <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Do not close this page</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
