"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface TeamConfig {
  name: string
  color: string
  icon: string
  logo?: string
  motto?: string
}

interface Question {
  question: string
  answers: { text: string; points: number }[]
}

interface GameData {
  currentRound: 1 | 2 | 3 | 4 | "tiebreaker"
  team1Config: TeamConfig
  team2Config: TeamConfig
  team1Score: number
  team2Score: number
  strikes: number
  showStrikeOverlay: boolean
  currentQuestion: Question | null
  revealedAnswers: boolean[]
  roundScore?: number
  currentTeam?: 'team1' | 'team2'
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

export default function GamePlayPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [showPassOrPlayOverlay, setShowPassOrPlayOverlay] = useState(false)
  const [showStrikeOverlay, setShowStrikeOverlay] = useState(false)

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setGameData(parsed)
          setShowPassOrPlayOverlay(localStorage.getItem('showPassOrPlayOverlay') === 'true')
          if (localStorage.getItem('showStrikeOverlay') === 'true') {
            setShowStrikeOverlay(true)
            setTimeout(() => {
              setShowStrikeOverlay(false)
              localStorage.setItem('showStrikeOverlay', 'false')
            }, 1200)
          }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Cumulative Scores (top left/right) */}
      {showPassOrPlayOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center animate-pulse">
            <h1 className="text-6xl md:text-8xl font-extrabold text-yellow-400 drop-shadow-2xl mb-8">PASS OR PLAY</h1>
          </div>
        </div>
      )}
      {/* Animated background particles */}
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

      {/* Strike Overlay */}
      {showStrikeOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="text-center animate-pulse">
            <span className="text-red-500 text-[180px] md:text-[300px] font-extrabold drop-shadow-2xl">✖</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="text-center py-6 md:py-8">
          <div
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-8 md:px-12 py-4 md:py-6 rounded-3xl shadow-2xl inline-block animate-pulse mb-4"
            style={{
              viewTransitionName: "game-header",
            }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider drop-shadow-2xl">
              FAMILY FEUD
            </h1>
            {/* Small logo integrated into header */}
            <img
              src="/family-feud-logo.png"
              alt="Family Feud Logo"
              className="w-8 h-8 md:w-10 md:h-10 inline-block ml-4 bg-transparent transition-all duration-700 ease-in-out opacity-80"
              style={{
                viewTransitionName: "family-feud-logo",
              }}
            />
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-2xl inline-block">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {roundNames[gameData.currentRound]}
            </h2>
          </div>
        </div>

        {/* Round Pool Score (center top) */}
        <div className="flex justify-center mt-8 mb-4">
          <div className="bg-yellow-400 border-4 border-yellow-700 rounded-2xl px-12 py-6 shadow-2xl flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">{gameData.roundScore ?? 0}</span>
          </div>
        </div>
        {/* Team overall scores (left/right) */}
        <div className="flex flex-row justify-between items-center gap-6 md:gap-8 px-4 md:px-12 mb-8">
          <div
            className={`${team1Colors.bg} px-6 md:px-8 py-4 md:py-6 rounded-2xl shadow-2xl flex flex-col items-center`}
            style={{ viewTransitionName: "team1-score-card" }}
          >
            <span className="text-lg font-bold text-yellow-100 mb-1">{gameData.team1Config.name}</span>
            <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">{gameData.team1Score}</span>
          </div>
          <div
            className={`${team2Colors.bg} px-6 md:px-8 py-4 md:py-6 rounded-2xl shadow-2xl flex flex-col items-center`}
            style={{ viewTransitionName: "team2-score-card" }}
          >
            <span className="text-lg font-bold text-yellow-100 mb-1">{gameData.team2Config.name}</span>
            <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">{gameData.team2Score}</span>
          </div>
        </div>

        {/* Question */}
        {gameData.currentQuestion && (
          <div className="text-center mb-8 px-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 md:px-12 py-6 md:py-8 rounded-3xl shadow-2xl max-w-5xl mx-auto"
              style={{
                viewTransitionName: "question-card",
              }}
            >
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {gameData.currentQuestion.question}
              </h2>
            </div>
          </div>
        )}

        {/* Game board */}
        {gameData.currentQuestion && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="relative max-w-6xl w-full">
              {/* Answer board */}
              <div
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl p-4 md:p-8 shadow-2xl"
                style={{
                  viewTransitionName: "game-board",
                }}
              >
                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      {gameData.currentQuestion.answers
                        .slice(0, Math.ceil(gameData.currentQuestion.answers.length / 2))
                        .map((answer, index) => (
                          <div
                            key={index}
                            className={`relative overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${
                              gameData.revealedAnswers[index]
                                ? "bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse transform scale-105"
                                : "bg-gradient-to-r from-blue-800 to-blue-900"
                            }`}
                            style={{
                              minHeight: "80px",
                              viewTransitionName: `answer-${index}`,
                            }}
                          >
                            <div className="flex items-center justify-between h-full px-4 md:px-6 py-4">
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                  <span className="text-2xl md:text-3xl font-bold text-blue-900">{index + 1}</span>
                                </div>
                                <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                                  {gameData.revealedAnswers[index] ? answer.text : ""}
                                </span>
                              </div>
                              {gameData.revealedAnswers[index] && (
                                <div className="bg-yellow-400 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-xl animate-bounce">
                                  <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                    {answer.points }
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      {gameData.currentQuestion.answers
                        .slice(Math.ceil(gameData.currentQuestion.answers.length / 2))
                        .map((answer, index) => {
                          const actualIndex = index + Math.ceil(gameData.currentQuestion.answers.length / 2)
                          return (
                            <div
                              key={actualIndex}
                              className={`relative overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${
                                gameData.revealedAnswers[actualIndex]
                                  ? "bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse transform scale-105"
                                  : "bg-gradient-to-r from-blue-800 to-blue-900"
                              }`}
                              style={{
                                minHeight: "80px",
                                viewTransitionName: `answer-${actualIndex}`,
                              }}
                            >
                              <div className="flex items-center justify-between h-full px-4 md:px-6 py-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                      {actualIndex + 1}
                                    </span>
                                  </div>
                                  <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                                    {gameData.revealedAnswers[actualIndex] ? answer.text : ""}
                                  </span>
                                </div>
                                {gameData.revealedAnswers[actualIndex] && (
                                  <div className="bg-yellow-400 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-xl animate-bounce">
                                    <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                      {answer.points * getPointMultiplier(gameData.currentRound)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strikes display */}
        <div className="text-center pb-8">
          <div
            className="inline-flex gap-4 md:gap-6 bg-gradient-to-r from-red-600 to-red-800 px-8 md:px-12 py-4 md:py-6 rounded-3xl shadow-2xl"
            style={{
              viewTransitionName: "strikes-display",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative">
                <X
                  className={`w-16 h-16 md:w-20 md:h-20 ${
                    i < gameData.strikes ? "text-yellow-300 animate-pulse" : "text-red-900"
                  } transition-all duration-500`}
                  strokeWidth={8}
                />
                {i < gameData.strikes && (
                  <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
