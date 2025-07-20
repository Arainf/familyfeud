"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface GameData {
  tournament?: {
    name: string
    teams: any[]
  }
}

export default function TournamentStartPage() {
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
    const channel = new BroadcastChannel("feud-game-state");
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
    channel.onmessage = (event) => {
      const { gameState } = event.data;
      const targetPath = gameStateRoutes[gameState as keyof typeof gameStateRoutes] || "/states/idle";
      if (window.location.pathname !== targetPath) {
        router.replace(targetPath);
      }
    };
    return () => channel.close();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        {/* Smaller logo positioned at top */}
        <div className="mb-8">
          <img
            src="/family-feud-logo.png"
            alt="Family Feud Logo"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-transparent transition-all duration-700 ease-in-out"
            style={{
              viewTransitionName: "family-feud-logo",
            }}
          />
        </div>

        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider animate-pulse drop-shadow-2xl">
            TOURNAMENT
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-400 tracking-wider animate-pulse drop-shadow-2xl">
            BEGINS!
          </h2>
        </div>

        {gameData?.tournament && (
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-6 rounded-3xl shadow-2xl animate-bounce"
            style={{
              viewTransitionName: "tournament-info",
            }}
          >
            <h3 className="text-2xl md:text-4xl font-bold text-white">{gameData.tournament.name}</h3>
            <p className="text-lg md:text-xl text-blue-200 mt-2">
              {gameData.tournament.teams?.length || 0} Teams Competing
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
