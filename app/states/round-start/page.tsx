"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface TeamConfig {
  name: string
  color: string
}

interface GameData {
  currentRound: 1 | 2 | 3 | 4 | "tiebreaker"
  team1Config: TeamConfig
  team2Config: TeamConfig
  team1Score: number
  team2Score: number
}

const roundNames = {
  1: "Round 1",
  2: "Round 2 - Double Points",
  3: "Round 3 - Triple Points",
  4: "Round 4 - Triple Points",
  tiebreaker: "Tie Breaker",
}

const getPointMultiplier = (round: 1 | 2 | 3 | 4 | "tiebreaker"): number => {
  switch (round) {
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 3
    case "tiebreaker":
      return 1
    default:
      return 1
  }
}

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string } } = {
    red: { bg: "bg-red-600" },
    blue: { bg: "bg-blue-600" },
    green: { bg: "bg-green-600" },
    purple: { bg: "bg-purple-600" },
    orange: { bg: "bg-orange-600" },
    pink: { bg: "bg-pink-600" },
    cyan: { bg: "bg-cyan-600" },
    yellow: { bg: "bg-yellow-600" },
  }
  return colorMap[color] || colorMap.blue
}

export default function RoundStartPage() {
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

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">LOADING...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          >
            {Math.random() > 0.5 ? (
              <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="text-center z-10">
        {/* Small logo at top corner */}
        <div className="absolute top-8 left-8">
          <img
            src="/family-feud-logo.png"
            alt="Family Feud Logo"
            className="w-16 h-16 md:w-20 md:h-20 bg-transparent transition-all duration-700 ease-in-out opacity-60"
            style={{
              viewTransitionName: "family-feud-logo",
            }}
          />
        </div>

        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider animate-bounce drop-shadow-2xl">
            {roundNames[gameData.currentRound]}
          </h1>

          {gameData.currentRound === "tiebreaker" && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 rounded-full inline-block animate-pulse">
              <span className="text-2xl md:text-3xl font-bold text-white">SCORES RESET!</span>
            </div>
          )}
        </div>

        {/* Point Multiplier Display */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-12 py-8 rounded-3xl shadow-2xl animate-pulse">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {getPointMultiplier(gameData.currentRound)}x POINTS
          </h2>
          <p className="text-lg md:text-xl text-yellow-100">
            {gameData.currentRound === "tiebreaker"
              ? "First to score wins!"
              : `All answers worth ${getPointMultiplier(gameData.currentRound)} times their value!`}
          </p>
        </div>

        {/* Current Scores */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            className={`${getColorClasses(gameData.team1Config.color).bg} p-6 rounded-2xl shadow-xl`}
            style={{
              viewTransitionName: "team1-score-card",
            }}
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              style={{
                viewTransitionName: "team1-name",
              }}
            >
              {gameData.team1Config.name}
            </h3>
            <p className="text-4xl md:text-5xl font-bold text-yellow-300">
              {gameData.currentRound === "tiebreaker" ? 0 : gameData.team1Score}
            </p>
          </div>
          <div
            className={`${getColorClasses(gameData.team2Config.color).bg} p-6 rounded-2xl shadow-xl`}
            style={{
              viewTransitionName: "team2-score-card",
            }}
          >
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              style={{
                viewTransitionName: "team2-name",
              }}
            >
              {gameData.team2Config.name}
            </h3>
            <p className="text-4xl md:text-5xl font-bold text-yellow-300">
              {gameData.currentRound === "tiebreaker" ? 0 : gameData.team2Score}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
