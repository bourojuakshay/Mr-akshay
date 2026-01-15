"use client"
import { Camera } from "lucide-react"

interface CameraPermissionModalProps {
  isOpen: boolean
  onAllow: () => void
  onDeny: () => void
}

export function CameraPermissionModal({ isOpen, onAllow, onDeny }: CameraPermissionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Camera Access</h2>
                <p className="text-sm text-muted-foreground mt-1">EcoReward needs camera permission</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>We need access to your camera to scan QR codes and claim your waste rewards.</p>
            <p>Your camera feed is only used locally and never stored or shared.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onDeny}
              className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={onAllow}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Allow Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
