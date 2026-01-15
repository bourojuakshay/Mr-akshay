"use client"

import { useEffect, useState } from "react"

interface Confetto {
  id: number
  left: number
  delay: number
  duration: number
  angle: number
}

export function Confetti({ trigger }: { trigger: boolean }) {
  const [confetti, setConfetti] = useState<Confetto[]>([])

  useEffect(() => {
    if (!trigger) return

    const newConfetti: Confetto[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 2.5 + Math.random() * 0.5,
      angle: Math.random() * 360,
    }))

    setConfetti(newConfetti)

    // Clear confetti after animation completes
    const timer = setTimeout(() => {
      setConfetti([])
    }, 3500)

    return () => clearTimeout(timer)
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-pulse"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
            backgroundColor: ["#00f9ff", "#ff6b35", "#4ecdc4", "#95e1d3", "#38ada9"][Math.floor(Math.random() * 5)],
            transform: `rotate(${piece.angle}deg)`,
          }}
        />
      ))}

      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
