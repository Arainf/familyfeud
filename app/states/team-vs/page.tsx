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
    <div className="min-h-screen  flex items-center justify-center relative overflow-hidden"
     style={{
      backgroundImage: "url('/game-screen.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
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

      <div className="text-center z-10 w-full max-w-7xl mx-auto ">

        {/* Teams Display */}
        <div className="flex flex-row gap-96 justify-center align-middle">
          
          {/* Team 1 */}
          <div
            className={`  h-auto w-auto `}
            style={{
              viewTransitionName: "team1-card",
            }}
          >
            <div className="text-center">
              {gameData.team1Config.logo && (
                <img
                  src={gameData.team1Config.logo || "/placeholder.svg"}
                  alt="Team 1 Logo"
                  className=" h-[500px] w-auto object-cover overflow-visible"
                  style={{
                    viewTransitionName: "team1-logo",
                    
                    
                  }}
                />
              )}
            </div>
          </div>

          {/* VS Symbol */}
          <div className="flex items-center justify-center">
            <div
              className=" h-auto w-auto  "
              style={{
                viewTransitionName: "vs-symbol",
              }}
            >
              <img className="h-[300px] w-[400px] object-cover overflow-visible" src="/vs.png" alt="" />
            </div>
          </div>

          {/* Team 2 */}
          <div
            className={` h-auto w-auto `}
            style={{
              viewTransitionName: "team2-card",
            }}
          >
            <div className="text-center">
              {gameData.team2Config.logo && (
                <img
                  src={gameData.team2Config.logo || "/placeholder.svg"}
                  alt="Team 2 Logo"
                  className=" h-[500px] w-auto object-cover overflow-visible"
                  style={{
                    viewTransitionName: "team2-logo",
                  }}
                />
              )}
              
            </div>
          </div>
        </div>

      
      </div>
    </div>
  )
}
