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
  const [showStealOverlay, setShowStealOverlay] = useState(false);
  const [stealVisual, setStealVisual] = useState(false);
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [roundWinner, setRoundWinner] = useState('');
  const [roundPoints, setRoundPoints] = useState('');
  const [stealTeam, setStealTeam] = useState<'team1' | 'team2'>('team2');
  const [stealAnswer, setStealAnswer] = useState("");
  const [stealResult, setStealResult] = useState<null | 'success' | 'fail'>(null);

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
          setShowStealOverlay(localStorage.getItem('showStealOverlay') === 'true');
          setStealTeam((localStorage.getItem('stealTeam') as 'team1' | 'team2') || 'team2');
          setStealVisual(localStorage.getItem('showStealVisualOverlay') === 'true');
          setShowRoundSummary(localStorage.getItem('showRoundSummary') === 'true');
          setRoundWinner(localStorage.getItem('roundWinner') || '');
          setRoundPoints(localStorage.getItem('roundPoints') || '');
        } catch (error) {
          console.error("Error parsing game state:", error)
        }
      }
    }

    loadGameState()
    const interval = setInterval(loadGameState, 100)
    return () => clearInterval(interval)
  }, [])

  // Fade out the STEAL overlay after 1.5s
  useEffect(() => {
    if (stealVisual) {
      const timeout = setTimeout(() => {
        setStealVisual(false);
        localStorage.setItem('showStealVisualOverlay', 'false');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [stealVisual]);

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
    <div className="min-h-screen relative overflow-hidden"
    style={{
      backgroundImage: "url('/game-screen.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
    >
      {/* Cumulative Scores (top left/right) */}
      {showPassOrPlayOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center flex flex-col justify-center align-middle items-center animate-pulse">
            <img src="/play.png" alt="" />
            <img src="/or.png" alt="" className="w-40" />
            <img src="/pass.png" alt="" />
          </div>
        </div>
      )}
  
      {stealVisual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-out">
          {/* Replace the text below with an <img src="/steal.png" ... /> if you want an image */}
          <h1 className="text-8xl font-extrabold text-yellow-400 drop-shadow-2xl animate-pulse">STEAL</h1>
        </div>
      )}
      {showRoundSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">Round Summary</h2>
            <div className="text-2xl text-white mb-2">
              Winner: <span className="font-bold">{roundWinner}</span>
            </div>
            <div className="text-xl text-blue-300 mb-6">
              Points Awarded: <span className="font-bold">{roundPoints}</span>
            </div>
            {/* Host-only Next Round button: show if window.name === 'host' or similar logic, or always show for now */}
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
              onClick={() => {
                localStorage.setItem('showRoundSummary', 'false');
              }}
            >
              Next Round
            </button>
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
            <span className="text-red-500 text-[180px] md:text-[300px] font-extrabold tracking-tight drop-shadow-2xl">
              {"X".repeat(gameData?.strikes || 0)}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="text-center py-6 md:py-8">
          <div className=" px-6 md:px-8 py-3 md:py-4 rounded-2xl  inline-block">
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              {roundNames[gameData.currentRound]}
            </h2>
          </div>
        </div>

        {/* Round Pool Score (center top) */}
        <div className="flex justify-center mt-8 mb-4 ">
            {/* Pool Score */}
            <div
              className="mx-auto mb-16 min-w-60 min-h-28 flex justify-center  items-center"
              style={{
                borderRadius: '29px',
                border: '4px solid #7FE9FE',
                background: 'rgba(0, 0, 0, 0.34)',
                boxShadow: '0px 4px 33.4px 30px rgba(255, 255, 255, 0.22)',
                color: '#FFF',
                textAlign: 'center',
                fontFamily: 'Mozaic GEO, sans-serif',
                fontSize: 80,
                fontStyle: 'normal',
                fontWeight: 690,
                lineHeight: 'normal',
                maxWidth: 400
              }}
            >
              {gameData.roundScore ?? 0}
            </div>
        </div>
        

        {/* Question */}
        {gameData.currentQuestion && (
          <>
            {/* Team overall scores left/right */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30">
              <div
                style={{
                  minWidth: 120,
                  minHeight: 80,
                  borderRadius: 20,
                  border: '4px solid #7FE9FE',
                  background: 'linear-gradient(292deg, #84D1FE 36.24%, #41ACE5 80.85%, #8DC0E3 103.71%)',
                  color: '#000',
                  fontFamily: 'Mozaic GEO, sans-serif',
                  fontWeight: 900,
                  fontSize: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 6px 12.4px 8px rgba(0,0,0,0.15) inset',
                  marginLeft: 24,
                  padding: '0 32px',
                }}
              >
                <span className="text-lg font-bold text-yellow-100 mb-1">{gameData.team1Config.name}</span>
                <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">{gameData.team1Score}</span>
              </div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30">
              <div
                style={{
                  minWidth: 120,
                  minHeight: 80,
                  borderRadius: 20,
                  border: '4px solid #7FE9FE',
                  background: 'linear-gradient(292deg, #84D1FE 36.24%, #41ACE5 80.85%, #8DC0E3 103.71%)',
                  color: '#000',
                  fontFamily: 'Mozaic GEO, sans-serif',
                  fontWeight: 900,
                  fontSize: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 6px 12.4px 8px rgba(0,0,0,0.15) inset',
                  marginRight: 24,
                  padding: '0 32px',
                }}
              >
                 <span className="text-lg font-bold text-yellow-100 mb-1">{gameData.team2Config.name}</span>
                 <span className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">{gameData.team2Score}</span>
              </div>
            </div>
            <div
              className="mx-auto mb-20 max-w-6xl w-full"
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Mozaic GEO, sans-serif',
                fontSize: 50,
                fontStyle: 'normal',
                fontWeight: 690,
                lineHeight: 'normal',
                borderRadius: 20,
                border: '5px solid #7FE9FE',
                background: 'linear-gradient(292deg, #84D1FE 36.24%, #41ACE5 80.85%, #8DC0E3 103.71%)',
                padding: '18px 32px',
              }}
            >
              {gameData.currentQuestion.question}
            </div>
            


            <div className="flex-1 flex items-center justify-center px-4">
              <div className="relative max-w-6xl w-full">
                {/* Answer board */}
                <div
                  className=" md:px-4 md:py-1"
                  style={{
                    borderRadius: '29px',
                    border: '4px solid #7FE9FE',
                    background: 'rgba(0, 0, 0, 0.34)',
                    boxShadow: '0px 4px 33.4px 30px rgba(255, 255, 255, 0.22)',
                    viewTransitionName: "game-board",
                  }}
                >
                  <div className="rounded-2xl p-2 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Left column */}
                      <div className="space-y-4">
                        {gameData.currentQuestion.answers
                          .slice(0, Math.ceil(gameData.currentQuestion.answers.length / 2))
                          .map((answer, index) => (
                            <div
                              key={index}
                              className={`relative overflow-hidden transition-all duration-700 ${gameData.revealedAnswers[index] ? 'flip-in' : ''}`}
                              style={{
                                borderRadius: '18px',
                                background: 'linear-gradient(292deg, #84D1FE 36.24%, #41ACE5 80.85%, #8DC0E3 103.71%)',
                                boxShadow: '0px 6px 12.4px 8px rgba(0, 0, 0, 0.25) inset',
                                minHeight: '80px',
                                viewTransitionName: `answer-${index}`,
                              }}
                            >
                              <div className="flex items-center justify-between h-full px-4 md:px-6 py-4">
                                <div className="flex items-center justify-center align-middle  gap-3 md:gap-4">
                                  {!gameData.revealedAnswers[index] && (
                                    <div
                                      className="flex items-center justify-center align-middle mx-auto my-auto"
                                      style={{
                                        width: 200,
                                        height: 69,
                                        background: "#4C98D8",
                                        borderRadius: "50%",
                                        boxShadow: "0px 6px 12.4px 8px rgba(0,0,0,0.25) inset, 0px 4px 20px 0px rgba(0,0,0,0.15)",
                                        filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#FFE14C",
                                          fontWeight: 900,
                                          fontSize: 45,
                                          fontFamily: "Mozaic GEO, sans-serif",
                                          textAlign: "center",
                                          lineHeight: "1",
                                        }}
                                      >
                                        {index + 1}
                                      </span>
                                    </div>
                                  )}
                                  <span
                                    className="w-full text-start"
                                    style={{
                                      color: '#FFF',
                                      fontFamily: 'Mozaic GEO, sans-serif',
                                      fontSize: '40px',
                                      fontStyle: 'normal',
                                      fontWeight: 690,
                                      lineHeight: 'normal',
                                      letterSpacing: 0,
                                      display: 'block',
                                    }}
                                  >
                                    {gameData.revealedAnswers[index] ? answer.text : ""}
                                  </span>
                                </div>
                                {gameData.revealedAnswers[index] && (
                                  <div
                                    className="flex items-center justify-center"
                                    style={{
                                      width: 70,
                                      height: 70,
                                      borderRadius: 15,
                                      background: '#4C98D8',
                                      boxShadow: '0px 6px 12.4px 8px rgba(0,0,0,0.25) inset',
                                      filter: 'drop-shadow(0px 1px 15px rgba(0,0,0,0.25))',
                                    }}
                                  >
                                    <span className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Mozaic GEO, sans-serif' }}>
                                      {answer.points}
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
                                className={`relative overflow-hidden transition-all duration-700 ${gameData.revealedAnswers[actualIndex] ? 'flip-in' : ''}`}
                                style={{
                                  borderRadius: '18px',
                                  background: 'linear-gradient(292deg, #84D1FE 36.24%, #41ACE5 80.85%, #8DC0E3 103.71%)',
                                  boxShadow: '0px 6px 12.4px 8px rgba(0, 0, 0, 0.25) inset',
                                  minHeight: '80px',
                                  viewTransitionName: `answer-${actualIndex}`,
                                }}
                              >
                                <div className="flex items-center justify-between h-full px-4 md:px-6 py-4">
                                  <div className="flex items-center gap-3 md:gap-4">
                                    {!gameData.revealedAnswers[actualIndex] && (
                                      <div
                                        className="flex items-center justify-center align-middle mx-auto my-auto"
                                        style={{
                                          width: 200,
                                          height: 69,
                                          background: "#4C98D8",
                                          borderRadius: "50%",
                                          boxShadow: "0px 6px 12.4px 8px rgba(0,0,0,0.25) inset, 0px 4px 20px 0px rgba(0,0,0,0.15)",
                                          filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))",
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: "#FFE14C",
                                            fontWeight: 900,
                                            fontSize: 45,
                                            fontFamily: "Mozaic GEO, sans-serif",
                                            textAlign: "center",
                                            lineHeight: "1",
                                          }}
                                        >
                                          {actualIndex + 1}
                                        </span>
                                      </div>
                                    )}
                                    <span
                                      className="w-full text-center"
                                      style={{
                                        color: '#FFF',
                                        fontFamily: 'Mozaic GEO, sans-serif',
                                        fontSize: '40px',
                                        fontStyle: 'normal',
                                        fontWeight: 690,
                                        lineHeight: 'normal',
                                        letterSpacing: 0,
                                        display: 'block',
                                      }}
                                    >
                                      {gameData.revealedAnswers[actualIndex] ? answer.text : ""}
                                    </span>
                                  </div>
                                  {gameData.revealedAnswers[actualIndex] && (
                                    <div
                                      className="flex items-center justify-center "
                                      style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 15,
                                        background: '#4C98D8',
                                        boxShadow: '0px 6px 12.4px 8px rgba(0,0,0,0.25) inset',
                                        filter: 'drop-shadow(0px 1px 15px rgba(0,0,0,0.25))',
                                      }}
                                    >
                                      <span className="text-2xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Mozaic GEO, sans-serif' }}>
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
          </>
        )}

        {/* Strikes display */}
        <div className="text-center pb-8">
          <div
            className="inline-flex justify-center items-center gap-[35px] px-8 md:px-12 py-4 md:py-6 rounded-3xl "
            style={{
              viewTransitionName: "strikes-display",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative" style={{ borderRadius: '10px', border: '3px solid rgba(121, 209, 255, 0.30)'}}>
                <svg 
                  className={`${i < gameData.strikes ? "text-red-500 " : ""} transition-all duration-500`}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="56" 
                  height="52" 
                  viewBox="0 0 56 52" 
                  fill="none"
                >
                  <rect x="-0.265625" y="-13.0806" width="94.505" height="17.3212" transform="rotate(43.8845 -0.265625 -13.0806)" fill={i < gameData.strikes ? "#FF0000" : "#79D1F0"} fillOpacity="0.3"/>
                  <rect width="94.505" height="17.3212" transform="matrix(0.720739 -0.693207 -0.693207 -0.720739 -0.265625 64.915)" fill={i < gameData.strikes ? "#FF0000" : "#79D1FF"} fillOpacity="0.3"/>
                </svg>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
