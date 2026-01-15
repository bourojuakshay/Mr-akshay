"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl md:text-2xl text-primary animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <LoginForm />
    </div>
  )
}
