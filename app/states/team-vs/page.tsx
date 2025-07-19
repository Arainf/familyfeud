"use client"

import React, { useEffect, useState } from "react"
import { Crown, Star, Zap, Shield, Trophy, Target, Flame, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface TeamConfig {
  name: string
  color: string
  icon: string
  logo?: string
  motto?: string
}

interface GameData {
  team1Config: TeamConfig
  team2Config: TeamConfig
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

const getTeamIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    crown: Crown,
    star: Star,
    heart: Heart,
    zap: Zap,
    shield: Shield,
    trophy: Trophy,
    target: Target,
    flame: Flame,
  }
  return iconMap[iconName] || Crown
}

export default function TeamVsPage() {
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">LOADING...</h1>
        </div>
      </div>
    )
  }

  const team1Colors = getColorClasses(gameData.team1Config.color)
  const team2Colors = getColorClasses(gameData.team2Config.color)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 w-full max-w-7xl mx-auto px-4">
        {/* Small logo at top */}
        <div className="mb-8">
          <img
            src="/family-feud-logo.png"
            alt="Family Feud Logo"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-transparent transition-all duration-700 ease-in-out"
            style={{
              viewTransitionName: "family-feud-logo",
            }}
          />
        </div>

        {/* VS Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider animate-pulse drop-shadow-2xl">
            FACE OFF
          </h1>
        </div>

        {/* Teams Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Team 1 */}
          <div
            className={`${team1Colors.bg} p-8 md:p-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 animate-pulse`}
            style={{
              viewTransitionName: "team1-card",
            }}
          >
            <div className="text-center">
              {gameData.team1Config.logo && (
                <img
                  src={gameData.team1Config.logo || "/placeholder.svg"}
                  alt="Team 1 Logo"
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white mx-auto mb-4"
                  style={{
                    viewTransitionName: "team1-logo",
                  }}
                />
              )}
              {React.createElement(getTeamIcon(gameData.team1Config.icon), {
                className: "w-16 h-16 md:w-24 md:h-24 text-white mx-auto mb-4",
              })}
              <h2
                className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg"
                style={{
                  viewTransitionName: "team1-name",
                }}
              >
                {gameData.team1Config.name}
              </h2>
              {gameData.team1Config.motto && (
                <p className="text-lg md:text-xl text-yellow-200 italic">"{gameData.team1Config.motto}"</p>
              )}
            </div>
          </div>

          {/* VS Symbol */}
          <div className="flex items-center justify-center">
            <div
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 md:p-12 rounded-full shadow-2xl animate-bounce"
              style={{
                viewTransitionName: "vs-symbol",
              }}
            >
              <span className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">VS</span>
            </div>
          </div>

          {/* Team 2 */}
          <div
            className={`${team2Colors.bg} p-8 md:p-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 animate-pulse`}
            style={{
              viewTransitionName: "team2-card",
            }}
          >
            <div className="text-center">
              {gameData.team2Config.logo && (
                <img
                  src={gameData.team2Config.logo || "/placeholder.svg"}
                  alt="Team 2 Logo"
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white mx-auto mb-4"
                  style={{
                    viewTransitionName: "team2-logo",
                  }}
                />
              )}
              {React.createElement(getTeamIcon(gameData.team2Config.icon), {
                className: "w-16 h-16 md:w-24 md:h-24 text-white mx-auto mb-4",
              })}
              <h2
                className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg"
                style={{
                  viewTransitionName: "team2-name",
                }}
              >
                {gameData.team2Config.name}
              </h2>
              {gameData.team2Config.motto && (
                <p className="text-lg md:text-xl text-yellow-200 italic">"{gameData.team2Config.motto}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Get Ready Message */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-3xl shadow-2xl animate-pulse">
            <h3 className="text-2xl md:text-4xl font-bold text-white">GET READY TO PLAY!</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
