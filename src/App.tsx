"use client"

import React, { useEffect } from "react"
import { Settings } from "lucide-react"
// import gameplayImg from "../buttonImage/gameplay.png"
// import monitorImg from "../buttonImage/monitor.png"
// import readingBookImg from "../buttonImage/reading-book.png"
import WgameplayImg from "../buttonImage/game-removebg-preview.png"
import WmonitorImg from "../buttonImage/coding-removebg-preview.png"
import WreadingBookImg from "../buttonImage/study-removebg-preview.png"

const modes = [
  { id: "game", label: "Game", image: WgameplayImg },
  { id: "coding", label: "Coding", image: WmonitorImg },
  { id: "study", label: "Study", image: WreadingBookImg },
]


function ModeCard({ label, image }: { label: string; image: string }) {
  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ipcRenderer.send('lunch-mode', label)
  }
  return (
    <button
      onClick={handleClick}
      className="group relative flex flex-col items-center justify-between
                 w-full max-w-[360px] md:flex-1 md:min-w-0 h-[180px] md:h-[200px] lg:h-[220px]
                 rounded-[28px] p-5 transition-all duration-300 ease-out
                 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(100,120,255,0.25)]
                 focus:outline-none focus:ring-2 focus:ring-[#4a4a9e] focus:ring-offset-2 focus:ring-offset-[#0a0a2e]"
      style={{ backgroundColor: "#1a1a5e" }}
    >
      {/* Image container */}
      <div className="w-full flex-1 rounded-[16px] overflow-hidden mb-3 flex items-center justify-center">
        <img src={image} alt={label} className="w-[90%] h-[90%] object-contain" />
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
      className="min-h-screen w-full flex flex-col overflow-x-hidden"
      style={{ backgroundColor: "#0a0a2e" }}
    >
      {/* Title bar */}
      <div
        className="h-[36px] flex items-center px-4 select-none"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className="text-white text-sm font-medium">Lazy Person Startup Apps</span>
      </div>

      {/* Header */}
      <header
        className="flex items-start justify-between pt-4 pb-8 px-8 md:pb-12 md:px-12"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {/* Greeting */}
        <div className="text-white">
          <h1 className="text-3xl md:text-3xl font-semibold">{getGreeting()}</h1>
          <p className="text-white/100 text-x1 md:text-2xl mt-2 font-semibold pl-55">Koh</p>
        </div>

        {/* Settings icon */}
        <button
          className="text-white/100 hover:text-white/70 transition-colors duration-200 p-2
                     focus:outline-none focus:ring-2 focus:ring-[#4a4a9e] rounded-lg"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          aria-label="Settings"
        >
          <Settings className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </header>

      {/* Main content - centered cards */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-10">
          {modes.map((mode) => (
            <ModeCard key={mode.id} label={mode.label} image={mode.image} />
          ))}
        </div>
      </main>
    </div>
  )
}
