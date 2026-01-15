"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { BrowserMultiFormatReader } from "@zxing/library"
import { Loader2 } from "lucide-react"

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
      await readerRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result && result.getText() && scanningRef.current && !isLoading) {
            scanningRef.current = false
            readerRef.current?.reset()
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
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
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
      <div className="absolute inset-0 flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📸</span>
          </div>
          <h3 className="text-xl font-bold mb-3">Camera Access Needed</h3>
          <p className="text-muted-foreground mb-8">
            Please allow camera access to scan QR codes and claim your rewards.
          </p>
          <button
            onClick={() => initCamera()}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/30"
          >
            Enable Camera
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-0">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ display: hasPermission === true ? "block" : "none" }}
      />

      {/* Initializing / Loading state */}
      {(hasPermission === null || isLoading) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-primary font-bold tracking-wider">
            {isLoading ? "PROCESSING SCAN..." : "PREPARING SCANNER..."}
          </p>
        </div>
      )}

      {/* Immersive Scanner Overlay */}
      {hasPermission === true && !isLoading && (
        <div className="absolute inset-0 z-10">
          {/* Transparent Overlay with Cutout Mask */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 15% 25%, 15% 65%, 85% 65%, 85% 25%, 15% 25%)"
            }}
          />

          {/* Scanning Box */}
          <div className="absolute top-[25%] left-[15%] right-[15%] bottom-[35%]">
            {/* Corners */}
            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-2xl shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" />
            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-2xl shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" />
            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-2xl shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" />
            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-2xl shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" />

            {/* Scanning Line */}
            <div className="scanning-line animate-scan" />

            <div className="absolute -bottom-20 left-0 right-0 text-center">
              <p className="text-white/80 text-sm font-medium bg-black/40 backdrop-blur-md py-2 px-4 rounded-full inline-block">
                Align QR code within the frame to scan
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-50 bg-destructive/10 flex items-center justify-center backdrop-blur-sm p-6 text-center">
          <div className="bg-background/90 p-8 rounded-3xl border border-destructive/50 shadow-2xl">
            <p className="text-destructive font-bold text-lg mb-4">{error}</p>
            <button
              onClick={() => initCamera()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
