"use client"

import React from "react"
import { Play, ArrowRight } from "lucide-react"
import { useGameData, getColorClasses, getTeamIcon } from "@/lib/game-utils"

export default function PassOrPlayPage() {
  const gameData = useGameData()

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">FAMILY FEUD</h1>
          <p className="text-xl md:text-3xl text-white/80">Loading Decision...</p>
        </div>
      </div>
    )
  }

  const currentTeamConfig = gameData.currentTeam === "team1" ? gameData.team1Config : gameData.team2Config
  const currentTeamColors = getColorClasses(currentTeamConfig?.color || 'blue')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
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

      <div className="text-center z-10 max-w-4xl mx-auto px-4">
        {/* Question Display */}
        {gameData.currentQuestion && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-3xl shadow-2xl mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                {gameData.currentQuestion.question}
              </h2>
            </div>
          </div>
        )}

        {/* Team Decision */}
        <div className={`${currentTeamColors.bg} p-8 md:p-12 rounded-3xl shadow-2xl animate-pulse`}>
          <div className="mb-6">
            {currentTeamConfig?.logo && (
              <img
                src={currentTeamConfig.logo || "/placeholder.svg"}
                alt="Team Logo"
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-4 border-white mx-auto mb-4"
              />
            )}
            <div className="text-5xl md:text-6xl mb-4">{getTeamIcon(currentTeamConfig?.icon || 'crown')}</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {currentTeamConfig?.name || 'Team'}
            </h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-lg">PASS OR PLAY?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-green-600 hover:bg-green-700 p-6 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all">
                <Play className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-2" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">PLAY</h3>
                <p className="text-green-100 mt-2">Take control of the board</p>
              </div>

              <div className="bg-orange-600 hover:bg-orange-700 p-6 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all">
                <ArrowRight className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-2" />
                <h3 className="text-2xl md:text-3xl font-bold text-white">PASS</h3>
                <p className="text-orange-100 mt-2">Let the other team play</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 