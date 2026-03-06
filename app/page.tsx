"use client"

import { useEffect } from "react"
import { Settings } from "lucide-react"

const modes = [
  { id: "game", label: "Game" },
  { id: "coding", label: "Coding" },
  { id: "study", label: "Study" },
]

function LandscapeIllustration() {
  return (
    <svg
      viewBox="0 0 120 90"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#B0E0E6" />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill="url(#skyGradient)" />

      {/* Clouds */}
      <ellipse cx="25" cy="20" rx="12" ry="6" fill="white" opacity="0.9" />
      <ellipse cx="32" cy="18" rx="8" ry="5" fill="white" opacity="0.9" />
      <ellipse cx="18" cy="22" rx="6" ry="4" fill="white" opacity="0.8" />

      <ellipse cx="90" cy="28" rx="10" ry="5" fill="white" opacity="0.85" />
      <ellipse cx="98" cy="26" rx="7" ry="4" fill="white" opacity="0.85" />
      <ellipse cx="84" cy="30" rx="5" ry="3" fill="white" opacity="0.75" />

      <ellipse cx="60" cy="15" rx="8" ry="4" fill="white" opacity="0.7" />
      <ellipse cx="66" cy="14" rx="5" ry="3" fill="white" opacity="0.7" />

      {/* Rolling hills - back layer */}
      <path
        d="M0 70 Q30 50 60 65 Q90 80 120 60 L120 90 L0 90 Z"
        fill="#6B8E23"
        opacity="0.7"
      />

      {/* Rolling hills - middle layer */}
      <path
        d="M0 80 Q20 60 50 72 Q80 84 100 68 Q110 62 120 70 L120 90 L0 90 Z"
        fill="#7CBA3D"
        opacity="0.85"
      />

      {/* Rolling hills - front layer */}
      <path
        d="M0 85 Q30 72 60 82 Q90 92 120 78 L120 90 L0 90 Z"
        fill="#8FD14F"
      />
    </svg>
  )
}

function ModeCard({ label }: { label: string }) {
  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ipcRenderer = (window as any).require?.('electron')?.ipcRenderer
    ipcRenderer?.send('lunch-mode', label)
  }
  return (
    <button
      onClick={handleClick}
      className="group relative flex flex-col items-center justify-between
                 w-[280px] h-[180px] md:w-[320px] md:h-[200px] lg:w-[360px] lg:h-[220px]
                 rounded-[28px] p-5 transition-all duration-300 ease-out
                 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(100,120,255,0.25)]
                 focus:outline-none focus:ring-2 focus:ring-[#4a4a9e] focus:ring-offset-2 focus:ring-offset-[#0a0a2e]"
      style={{ backgroundColor: "#1a1a5e" }}
    >
      {/* Illustration container */}
      <div className="w-full flex-1 rounded-[16px] overflow-hidden bg-[#87CEEB]/10 mb-3">
        <LandscapeIllustration />
      </div>

      {/* Label */}
      <span className="text-white text-base md:text-lg font-normal tracking-wide pb-1">
        {label}
      </span>
    </button>
  )
}

const getGreeting = () => {
  const now = new Date()
  const totalMinutes = now.getHours() * 60 + now.getMinutes()

  if (totalMinutes < 5 * 60) return "Good to find you at midnight"
  if (totalMinutes < 12 * 60) return "Good Morning"
  if (totalMinutes < 18 * 60 + 30) return "Good Afternoon"
  return "Good Evening"
}

export default function StartupModeSelector() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#0a0a2e" }}
    >
      {/* Header */}
      <header className="flex items-start justify-between p-8 md:p-12">
        {/* Greeting */}
        <div className="text-white">
          <h1 className="text-2xl md:text-3xl font-semibold">{getGreeting()}</h1>
          <p className="text-white/60 text-sm md:text-base mt-1">Koh</p>
        </div>

        {/* Settings icon */}
        <button
          className="text-white/40 hover:text-white/70 transition-colors duration-200 p-2
                     focus:outline-none focus:ring-2 focus:ring-[#4a4a9e] rounded-lg"
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </header>

      {/* Main content - centered cards */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10">
          {modes.map((mode) => (
            <ModeCard key={mode.id} label={mode.label} />
          ))}
        </div>
      </main>
    </div>
  )
}
