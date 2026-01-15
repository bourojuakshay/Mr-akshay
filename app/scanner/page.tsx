"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { CameraScanner } from "@/components/camera-scanner"
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

    let qrId = scannedValue
    if (scannedValue.includes("/") || scannedValue.startsWith("http")) {
      try {
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden select-none">
      <CameraPermissionModal
        isOpen={showPermissionModal}
        onAllow={handlePermissionAllow}
        onDeny={handlePermissionDeny}
      />

      {/* Immersive Camera Interface */}
      <CameraScanner
        onScan={handleScan}
        isLoading={isLoading}
        onPermissionNeeded={handlePermissionNeeded}
      />

      {/* Top Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="p-3 bg-black/30 backdrop-blur-md rounded-2xl text-white hover:bg-black/50 transition-colors border border-white/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
          <span className="text-white font-bold tracking-widest text-sm uppercase">Scanner</span>
        </div>
        <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      {/* Scanner is always full screen via component */}
    </div>
  )
}
