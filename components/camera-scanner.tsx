"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/lib/theme-context"
import { BrowserMultiFormatReader } from "@zxing/library"

interface CameraScannerProps {
  onScan: (qrId: string) => void
  isLoading: boolean
  onPermissionNeeded?: () => void
}

export function CameraScanner({ onScan, isLoading, onPermissionNeeded }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState("")
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const scanningRef = useRef(false)
  const streamRef = useRef<MediaStream | null>(null)
  const { theme } = useTheme()

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startScanning = useCallback(async () => {
    if (!readerRef.current || !videoRef.current || scanningRef.current) return

    scanningRef.current = true

    try {
      // Use decodeFromVideoDevice for continuous scanning
      // This is more efficient than a manual interval
      await readerRef.current.decodeFromVideoDevice(
        null, // Capture from default device or the one already started
        videoRef.current,
        (result, err) => {
          if (result && result.getText() && scanningRef.current && !isLoading) {
            scanningRef.current = false
            readerRef.current?.reset() // Stop scanning after first successful match
            onScan(result.getText())
          }
          if (err && !(err.name === "NotFoundException" || err.name === "ChecksumException" || err.name === "FormatException")) {
            console.warn("Scanning error:", err)
          }
        }
      )
    } catch (err) {
      console.error("Camera scanning setup failed:", err)
      setError("Failed to start scanning")
    }
  }, [onScan, isLoading])


  const initCamera = useCallback(async () => {
    setError("")
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this browser")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      setHasPermission(true)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader()
      }

      startScanning()
    } catch (err: any) {
      console.error("Camera init error:", err)
      setError(err.message || "Could not access camera")
      setHasPermission(false)
      if (onPermissionNeeded) onPermissionNeeded()
    }
  }, [onPermissionNeeded, startScanning])

  useEffect(() => {
    initCamera()
    return () => stopCamera()
  }, [initCamera, stopCamera])

  if (hasPermission === false) {
    return (
      <div className="bg-destructive/10 border border-destructive/50 rounded-2xl p-8 text-center backdrop-blur-sm">
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📸</span>
        </div>
        <h3 className="text-foreground font-semibold mb-2">Camera Access Required</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
          Please allow camera access in your browser settings to scan QR codes.
        </p>
        <button
          onClick={() => initCamera()}
          className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition transform active:scale-95 font-semibold shadow-lg shadow-primary/20"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl scanner-glow">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-[4/3] sm:aspect-square object-cover"
        style={{ display: hasPermission === true ? "block" : "none" }}
      />

      {/* Initializing state */}
      {hasPermission === null && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-primary font-medium">Starting Camera...</p>
          </div>
        </div>
      )}

      {/* scanner overlay */}
      {hasPermission === true && !isLoading && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanning frame corner marks */}
          <div className="absolute inset-[15%] border-2 border-primary/20 rounded-2xl">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
          </div>

          {/* Scanning line animation */}
          <div className="absolute top-[15%] left-[15%] right-[15%] h-0.5 bg-primary/60 shadow-[0_0_15px_rgba(var(--color-primary),0.8)] animate-pulse" />
        </div>
      )}

      {/* Loading/Processing state */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-md">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-primary font-bold text-lg">Validating QR Code...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-destructive/10 flex items-center justify-center backdrop-blur-sm p-6">
          <p className="text-destructive font-semibold text-center">{error}</p>
        </div>
      )}
    </div>
  )
}
