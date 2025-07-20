"use client"

import React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGameData, getColorClasses } from "@/lib/game-utils"

export default function BracketShowPage() {
  const router = useRouter();
  const gameData = useGameData()

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
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">FAMILY FEUD</h1>
          <p className="text-xl md:text-3xl text-white/80">Loading Bracket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
            TOURNAMENT BRACKET
          </h1>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-full inline-block">
            <span className="text-2xl md:text-3xl font-bold text-black">Round Robin Format</span>
          </div>
        </div>

        {/* Tournament Bracket Display */}
        {gameData.tournament && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameData.tournament.matches.map((match: any, index: number) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border-4 shadow-2xl transition-all duration-500 ${
                  index === gameData.tournament?.currentMatchIndex
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 animate-pulse scale-105"
                    : match.completed
                      ? "border-green-500 bg-gradient-to-br from-green-900/30 to-blue-900/30"
                      : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-slate-900/50"
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-white">Match {index + 1}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded ${getColorClasses(match.team1?.color || 'gray').bg}`} />
                      <span className="text-white font-medium">{match.team1?.name || 'TBD'}</span>
                    </div>
                    {match.completed && <span className="text-2xl font-bold text-white">{match.team1Score}</span>}
                  </div>

                  <div className="text-center">
                    <span className="text-2xl font-bold text-yellow-400">VS</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded ${getColorClasses(match.team2?.color || 'gray').bg}`} />
                      <span className="text-white font-medium">{match.team2?.name || 'TBD'}</span>
                    </div>
                    {match.completed && <span className="text-2xl font-bold text-white">{match.team2Score}</span>}
                  </div>
                </div>

                {index === gameData.tournament?.currentMatchIndex && (
                  <div className="mt-4 text-center">
                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold animate-bounce">
                      NEXT MATCH
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 