"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface GameData {
  gameState: string
  tournament?: {
    name: string
    teams: any[]
  }
}

export default function IdlePage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<GameData | null>(null)

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState")
      if (saved) {
        try {
          setGameData(JSON.parse(saved))
        } catch (error) {
          console.error("Error parsing game state:", error)
        }
      }
    }

    loadGameState()
    const interval = setInterval(loadGameState, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const gameStateRoutes = {
      idle: "/states/idle",
      "tournament-start": "/states/tournament-start",
      "bracket-show": "/states/bracket-show",
      "team-vs": "/states/team-vs",
      "round-start": "/states/round-start",
      "game-play": "/states/game-play",
      "pass-or-play": "/states/pass-or-play",
      "round-end-reveal": "/states/round-end-reveal",
      "post-round-scoring": "/states/post-round-scoring",
      "match-winner": "/states/match-winner",
      "bracket-update": "/states/bracket-update",
      "tournament-winner": "/states/tournament-winner",
    };
    const interval = setInterval(() => {
      const saved = localStorage.getItem("familyFeudGameState");
      if (saved) {
        try {
          const { gameState } = JSON.parse(saved);
          const currentPath = window.location.pathname;
          const targetPath = gameStateRoutes[(gameState as keyof typeof gameStateRoutes)] || "/states/idle";
          if (currentPath !== targetPath) {
            router.replace(targetPath);
          }
        } catch {}
      }
    }, 100);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: "url('/idle-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Logo with View Transition */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <img
            src="/family-feud-logo.png"
            alt="Family Feud Logo"
            className="w-2xl h-2xl md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] mx-auto bg-transparent transition-all duration-700 ease-in-out"
            style={{
              viewTransitionName: "family-feud-logo",
            }}
          />
        </div>

        {gameData?.tournament && (
          <div
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 mt-8 animate-fade-in"
            style={{
              viewTransitionName: "tournament-info",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{gameData.tournament.name}</h2>
            <p className="text-lg text-gray-300">{gameData.tournament.teams?.length || 0} Teams Ready</p>
          </div>
        )}
      </div>
    </div>
  )
}
