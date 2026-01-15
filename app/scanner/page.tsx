"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { CameraScanner } from "@/components/camera-scanner"
import { Header } from "@/components/header"
import { CameraPermissionModal } from "@/components/camera-permission-modal"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ScannerPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  const handleScan = useCallback(async (scannedValue: string) => {
    setIsLoading(true)

    // Extract ID from URL if necessary
    let qrId = scannedValue
    if (scannedValue.includes("/") || scannedValue.startsWith("http")) {
      try {
        // If it's a URL, get the last part
        const parts = scannedValue.split("/")
        qrId = parts[parts.length - 1] || parts[parts.length - 2]
      } catch (e) {
        console.error("Error parsing scanned URL:", e)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 800))
    router.push(`/claim/${encodeURIComponent(qrId)}`)
  }, [router])

  const handlePermissionNeeded = useCallback(() => {
    setShowPermissionModal(true)
  }, [])

  const handlePermissionAllow = () => {
    setShowPermissionModal(false)
    window.location.reload()
  }

  const handlePermissionDeny = () => {
    setShowPermissionModal(false)
    router.push("/dashboard")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary font-medium animate-pulse">Loading Secure Session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <CameraPermissionModal
        isOpen={showPermissionModal}
        onAllow={handlePermissionAllow}
        onDeny={handlePermissionDeny}
      />

      <div className="relative py-8 px-4 sm:px-6">
        {/* background effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-all group mb-8"
          >
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-primary/50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Scan <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">QR Code</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg">
              Position the unique code in the frame to claim your rewards.
            </p>
          </div>

          {/* Camera scanner */}
          <div className="mb-10">
            <CameraScanner
              onScan={handleScan}
              isLoading={isLoading}
              onPermissionNeeded={handlePermissionNeeded}
            />
          </div>

          {/* Instructions */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="text-primary">💡</span> Scanning Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-400">Hold your device steady for better focus.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-400">Ensure the code is well-lit and centered.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
