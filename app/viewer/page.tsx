"use client";

import React from "react";
import { useState, useEffect } from "react";
import { X, Star, Zap, Crown, Trophy, Play, ArrowRight } from "lucide-react";

type GameState =
  | "idle"
  | "tournament-start"
  | "bracket-show"
  | "team-vs"
  | "round-start"
  | "game-play"
  | "pass-or-play"
  | "round-end-reveal"
  | "post-round-scoring"
  | "match-winner"
  | "bracket-update"
  | "tournament-winner"
  | "grand-winner";

type Round = 1 | 2 | 3 | 4 | "tiebreaker";
type Team = "team1" | "team2";

interface TeamConfig {
  name: string;
  color: string;
  customColor?: string;
  icon: string;
  logo?: string;
  motto?: string;
  soundEffect?: string;
}

interface GameData {
  gameState: GameState;
  currentRound: Round;
  currentQuestionIndex: number;
  revealedAnswers: boolean[];
  team1Score: number;
  team2Score: number;
  roundScore: number;
  currentTeam: Team;
  strikes: number;
  team1Config: TeamConfig;
  team2Config: TeamConfig;
  showStrikeOverlay: boolean;
  fastMoneyScore: number;
  fastMoneyAnswers: string[];
  gameWinner: string | null;
  tournamentWinner: string | null;
  currentQuestion: {
    id: number;
    question: string;
    answers: { text: string; points: number }[];
  } | null;
  passOrPlayChoice: Team | null;
  allAnswersRevealed: boolean;
  roundWinner: Team | null;
  tournament: {
    name: string;
    teams: TeamConfig[];
    matches: any[];
    currentMatchIndex: number;
  } | null;
}

const roundNames = {
  1: "Round 1",
  2: "Round 2 - Double Points",
  3: "Round 3 - Triple Points",
  4: "Round 4 - Triple Points",
  tiebreaker: "Tie Breaker",
};

const getPointMultiplier = (round: Round): number => {
  switch (round) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 3;
    case "tiebreaker":
      return 1;
    default:
      return 1;
  }
};

const getColorClasses = (color: string) => {
  const colorMap: {
    [key: string]: { bg: string; text: string; glow: string; shadow: string };
  } = {
    red: {
      bg: "bg-red-600",
      text: "text-red-600",
      glow: "shadow-red-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]",
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      glow: "shadow-blue-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    },
    green: {
      bg: "bg-green-600",
      text: "text-green-600",
      glow: "shadow-green-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-600",
      glow: "shadow-purple-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]",
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-600",
      glow: "shadow-orange-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]",
    },
    pink: {
      bg: "bg-pink-600",
      text: "text-pink-600",
      glow: "shadow-pink-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    },
    cyan: {
      bg: "bg-cyan-600",
      text: "text-cyan-600",
      glow: "shadow-cyan-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(8,145,178,0.5)]",
    },
    yellow: {
      bg: "bg-yellow-600",
      text: "text-yellow-600",
      glow: "shadow-yellow-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(202,138,4,0.5)]",
    },
  };
  return colorMap[color] || colorMap.blue;
};

const getTeamIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    crown: Crown,
    star: Star,
    heart: "❤️",
    zap: Zap,
    shield: "🛡️",
    trophy: "🏆",
    target: "🎯",
    flame: "🔥",
    gamepad: "🎮",
  };
  return iconMap[iconName] || Crown;
};

export default function FamilyFeudViewer() {
  const [gameData, setGameData] = useState<GameData | null>(null);

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState");
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          // Map old structure to new structure
          const mappedData: GameData = {
            gameState: parsedData.gameState || "idle",
            currentRound:
              parsedData.currentRound === "round1"
                ? 1
                : parsedData.currentRound === "round2"
                ? 2
                : parsedData.currentRound === "round3"
                ? 3
                : 1,
            currentQuestionIndex: parsedData.currentQuestionIndex || 0,
            revealedAnswers: parsedData.revealedAnswers || [],
            team1Score: parsedData.team1Score || 0,
            team2Score: parsedData.team2Score || 0,
            roundScore: parsedData.roundScore || 0,
            currentTeam: parsedData.currentTeam || "team1",
            strikes: parsedData.strikes || 0,
            team1Config: parsedData.team1Config || {
              name: "Team 1",
              color: "red",
              icon: "crown",
              motto: "Champions in the making!",
            },
            team2Config: parsedData.team2Config || {
              name: "Team 2",
              color: "blue",
              icon: "star",
              motto: "Ready to dominate!",
            },
            showStrikeOverlay: parsedData.showStrikeOverlay || false,
            fastMoneyScore: parsedData.fastMoneyScore || 0,
            fastMoneyAnswers: parsedData.fastMoneyAnswers || [],
            gameWinner: parsedData.gameWinner || null,
            tournamentWinner: parsedData.tournamentWinner || null,
            currentQuestion: parsedData.currentQuestion || null,
            passOrPlayChoice: parsedData.passOrPlayChoice || null,
            allAnswersRevealed: parsedData.allAnswersRevealed || false,
            roundWinner: parsedData.roundWinner || null,
            tournament: parsedData.tournament || null,
          };
          setGameData(mappedData);
        } catch (error) {
          console.error("Error parsing game state:", error);
          setGameData({
            gameState: "idle",
            currentRound: 1,
            currentQuestionIndex: 0,
            revealedAnswers: [],
            team1Score: 0,
            team2Score: 0,
            roundScore: 0,
            currentTeam: "team1",
            strikes: 0,
            team1Config: {
              name: "Team 1",
              color: "red",
              icon: "crown",
              motto: "Champions in the making!",
            },
            team2Config: {
              name: "Team 2",
              color: "blue",
              icon: "star",
              motto: "Ready to dominate!",
            },
            showStrikeOverlay: false,
            fastMoneyScore: 0,
            fastMoneyAnswers: [],
            gameWinner: null,
            tournamentWinner: null,
            currentQuestion: null,
            passOrPlayChoice: null,
            allAnswersRevealed: false,
            roundWinner: null,
            tournament: null,
          });
        }
      } else {
        setGameData({
          gameState: "idle",
          currentRound: 1,
          currentQuestionIndex: 0,
          revealedAnswers: [],
          team1Score: 0,
          team2Score: 0,
          roundScore: 0,
          currentTeam: "team1",
          strikes: 0,
          team1Config: {
            name: "Team 1",
            color: "red",
            icon: "crown",
            motto: "Champions in the making!",
          },
          team2Config: {
            name: "Team 2",
            color: "blue",
            icon: "star",
            motto: "Ready to dominate!",
          },
          showStrikeOverlay: false,
          fastMoneyScore: 0,
          fastMoneyAnswers: [],
          gameWinner: null,
          tournamentWinner: null,
          currentQuestion: null,
          passOrPlayChoice: null,
          allAnswersRevealed: false,
          roundWinner: null,
          tournament: null,
        });
      }
    };

    loadGameState();
    const interval = setInterval(loadGameState, 100);
    return () => clearInterval(interval);
  }, []);

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">
            FAMILY FEUD
          </h1>
          <p className="text-xl md:text-3xl text-white/80">Loading Game...</p>
        </div>
      </div>
    );
  }

  // Idle Screen
  if (gameData.gameState === "idle") {
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

        {/* Main Logo */}
        <div className="relative z-10 text-center">
          <div className="mb-8 a">
            <img
              src="/family-feud-logo.png"
              alt="Family Feud Logo"
              className=" lg:w-[700px] lg:h-[700px] mx-auto bg-transparent"
            />
          </div>
        </div>
      </div>
    );
  }

  // Tournament Start Screen
  if (gameData.gameState === "tournament-start") {
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
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider animate-pulse drop-shadow-2xl">
              TOURNAMENT
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-400 tracking-wider animate-pulse drop-shadow-2xl">
              BEGINS!
            </h2>
          </div>

          {gameData.tournament && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-6 rounded-3xl shadow-2xl animate-bounce">
              <h3 className="text-2xl md:text-4xl font-bold text-white">
                {gameData.tournament.name}
              </h3>
              <p className="text-lg md:text-xl text-blue-200 mt-2">
                Round Robin Tournament
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bracket Show Screen
  if (gameData.gameState === "bracket-show") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
              TOURNAMENT BRACKET
            </h1>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-full inline-block">
              <span className="text-2xl md:text-3xl font-bold text-black">
                Round Robin Format
              </span>
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
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Match {index + 1}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded ${
                            getColorClasses(match.team1.color).bg
                          }`}
                        />
                        <span className="text-white font-medium">
                          {match.team1.name}
                        </span>
                      </div>
                      {match.completed && (
                        <span className="text-2xl font-bold text-white">
                          {match.team1Score}
                        </span>
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-yellow-400">
                        VS
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded ${
                            getColorClasses(match.team2.color).bg
                          }`}
                        />
                        <span className="text-white font-medium">
                          {match.team2.name}
                        </span>
                      </div>
                      {match.completed && (
                        <span className="text-2xl font-bold text-white">
                          {match.team2Score}
                        </span>
                      )}
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
    );
  }

  // Team VS Screen
  if (gameData.gameState === "team-vs") {
    const team1Colors = getColorClasses(gameData.team1Config.color);
    const team2Colors = getColorClasses(gameData.team2Config.color);

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
            >
              <div className="text-center">
                {gameData.team1Config.logo && (
                  <img
                    src={gameData.team1Config.logo || "/placeholder.svg"}
                    alt="Team 1 Logo"
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white mx-auto mb-4"
                  />
                )}
                {typeof getTeamIcon(gameData.team1Config.icon) === "string" ? (
                  <div className="text-6xl md:text-8xl mb-4">
                    {getTeamIcon(gameData.team1Config.icon)}
                  </div>
                ) : (
                  React.createElement(getTeamIcon(gameData.team1Config.icon), {
                    className:
                      "w-16 h-16 md:w-24 md:h-24 text-white mx-auto mb-4",
                  })
                )}
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {gameData.team1Config.name}
                </h2>
                {gameData.team1Config.motto && (
                  <p className="text-lg md:text-xl text-yellow-200 italic">
                    "{gameData.team1Config.motto}"
                  </p>
                )}
              </div>
            </div>

            {/* VS Symbol */}
            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 md:p-12 rounded-full shadow-2xl animate-bounce">
                <span className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">
                  VS
                </span>
              </div>
            </div>

            {/* Team 2 */}
            <div
              className={`${team2Colors.bg} p-8 md:p-12 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 animate-pulse`}
            >
              <div className="text-center">
                {gameData.team2Config.logo && (
                  <img
                    src={gameData.team2Config.logo || "/placeholder.svg"}
                    alt="Team 2 Logo"
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white mx-auto mb-4"
                  />
                )}
                {typeof getTeamIcon(gameData.team2Config.icon) === "string" ? (
                  <div className="text-6xl md:text-8xl mb-4">
                    {getTeamIcon(gameData.team2Config.icon)}
                  </div>
                ) : (
                  React.createElement(getTeamIcon(gameData.team2Config.icon), {
                    className:
                      "w-16 h-16 md:w-24 md:h-24 text-white mx-auto mb-4",
                  })
                )}
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {gameData.team2Config.name}
                </h2>
                {gameData.team2Config.motto && (
                  <p className="text-lg md:text-xl text-yellow-200 italic">
                    "{gameData.team2Config.motto}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Get Ready Message */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-3xl shadow-2xl animate-pulse">
              <h3 className="text-2xl md:text-4xl font-bold text-white">
                GET READY TO PLAY!
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Round Start Screen
  if (gameData.gameState === "round-start") {
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
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider animate-bounce drop-shadow-2xl">
              {roundNames[gameData.currentRound]}
            </h1>

            {gameData.currentRound === "tiebreaker" && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 rounded-full inline-block animate-pulse">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  SCORES RESET!
                </span>
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
                : `All answers worth ${getPointMultiplier(
                    gameData.currentRound
                  )} times their value!`}
            </p>
          </div>

          {/* Current Scores */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              className={`${
                getColorClasses(gameData.team1Config.color).bg
              } p-6 rounded-2xl shadow-xl`}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {gameData.team1Config.name}
              </h3>
              <p className="text-4xl md:text-5xl font-bold text-yellow-300">
                {gameData.currentRound === "tiebreaker"
                  ? 0
                  : gameData.team1Score}
              </p>
            </div>
            <div
              className={`${
                getColorClasses(gameData.team2Config.color).bg
              } p-6 rounded-2xl shadow-xl`}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {gameData.team2Config.name}
              </h3>
              <p className="text-4xl md:text-5xl font-bold text-yellow-300">
                {gameData.currentRound === "tiebreaker"
                  ? 0
                  : gameData.team2Score}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pass or Play Screen
  if (gameData.gameState === "pass-or-play") {
    const currentTeamConfig =
      gameData.currentTeam === "team1"
        ? gameData.team1Config
        : gameData.team2Config;
    const currentTeamColors = getColorClasses(currentTeamConfig.color);

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
          <div
            className={`${currentTeamColors.bg} p-8 md:p-12 rounded-3xl shadow-2xl animate-pulse`}
          >
            <div className="mb-6">
              {currentTeamConfig.logo && (
                <img
                  src={currentTeamConfig.logo || "/placeholder.svg"}
                  alt="Team Logo"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full border-4 border-white mx-auto mb-4"
                />
              )}
              {typeof getTeamIcon(currentTeamConfig.icon) === "string" ? (
                <div className="text-5xl md:text-6xl mb-4">
                  {getTeamIcon(currentTeamConfig.icon)}
                </div>
              ) : (
                React.createElement(getTeamIcon(currentTeamConfig.icon), {
                  className:
                    "w-16 h-16 md:w-20 md:h-20 text-white mx-auto mb-4",
                })
              )}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {currentTeamConfig.name}
              </h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-lg">
                PASS OR PLAY?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-green-600 hover:bg-green-700 p-6 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all">
                  <Play className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-2" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    PLAY
                  </h3>
                  <p className="text-green-100 mt-2">
                    Take control of the board
                  </p>
                </div>

                <div className="bg-orange-600 hover:bg-orange-700 p-6 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition-all">
                  <ArrowRight className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-2" />
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    PASS
                  </h3>
                  <p className="text-orange-100 mt-2">
                    Let the other team play
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Play Screen (Main Game Board)
  if (gameData.gameState === "game-play") {
    const team1Colors = getColorClasses(gameData.team1Config.color);
    const team2Colors = getColorClasses(gameData.team2Config.color);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
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
        {gameData.showStrikeOverlay && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative">
              <X
                className="text-red-500 animate-bounce"
                style={{
                  width: "400px",
                  height: "400px",
                  strokeWidth: "8",
                  filter: "drop-shadow(0 0 40px rgba(239, 68, 68, 0.9))",
                }}
              />
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-10 animate-ping" />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-6">
          {/* Header */}
          <div className="text-center py-6 md:py-8">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-8 md:px-12 py-4 md:py-6 rounded-3xl shadow-2xl inline-block animate-pulse mb-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wider drop-shadow-2xl">
                FAMILY FEUD
              </h1>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-2xl inline-block">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {roundNames[gameData.currentRound]}
              </h2>
            </div>
          </div>

          {/* Team scores */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 px-4 md:px-12 mb-8">
            <div
              className={`${team1Colors.bg} px-8 md:px-12 py-6 md:py-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto`}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                {gameData.team1Config.logo && (
                  <img
                    src={gameData.team1Config.logo || "/placeholder.svg"}
                    alt="Team 1 Logo"
                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-white"
                  />
                )}
                {typeof getTeamIcon(gameData.team1Config.icon) === "string" ? (
                  <div className="text-2xl md:text-3xl">
                    {getTeamIcon(gameData.team1Config.icon)}
                  </div>
                ) : (
                  React.createElement(getTeamIcon(gameData.team1Config.icon), {
                    className: "w-6 h-6 md:w-8 md:h-8 text-white",
                  })
                )}
                <div className="text-white text-2xl md:text-3xl font-bold text-center drop-shadow-lg">
                  {gameData.team1Config.name}
                </div>
              </div>
              {gameData.team1Config.motto && (
                <div className="text-yellow-200 text-sm md:text-base text-center mb-2 italic">
                  "{gameData.team1Config.motto}"
                </div>
              )}
              <div className="text-yellow-300 text-4xl md:text-6xl font-bold text-center drop-shadow-lg">
                {gameData.currentRound === "tiebreaker"
                  ? 0
                  : gameData.team1Score}
              </div>
            </div>

            <div
              className={`${team2Colors.bg} px-8 md:px-12 py-6 md:py-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 w-full md:w-auto`}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                {gameData.team2Config.logo && (
                  <img
                    src={gameData.team2Config.logo || "/placeholder.svg"}
                    alt="Team 2 Logo"
                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-white"
                  />
                )}
                {typeof getTeamIcon(gameData.team2Config.icon) === "string" ? (
                  <div className="text-2xl md:text-3xl">
                    {getTeamIcon(gameData.team2Config.icon)}
                  </div>
                ) : (
                  React.createElement(getTeamIcon(gameData.team2Config.icon), {
                    className: "w-6 h-6 md:w-8 md:h-8 text-white",
                  })
                )}
                <div className="text-white text-2xl md:text-3xl font-bold text-center drop-shadow-lg">
                  {gameData.team2Config.name}
                </div>
              </div>
              {gameData.team2Config.motto && (
                <div className="text-yellow-200 text-sm md:text-base text-center mb-2 italic">
                  "{gameData.team2Config.motto}"
                </div>
              )}
              <div className="text-yellow-300 text-4xl md:text-6xl font-bold text-center drop-shadow-lg">
                {gameData.currentRound === "tiebreaker"
                  ? 0
                  : gameData.team2Score}
              </div>
            </div>
          </div>

          {/* Question */}
          {gameData.currentQuestion && (
            <div className="text-center mb-8 px-4">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 md:px-12 py-6 md:py-8 rounded-3xl shadow-2xl max-w-5xl mx-auto">
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
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl p-4 md:p-8 shadow-2xl">
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Left column */}
                      <div className="space-y-4">
                        {gameData.currentQuestion.answers
                          .slice(
                            0,
                            Math.ceil(
                              gameData.currentQuestion.answers.length / 2
                            )
                          )
                          .map((answer, index) => (
                            <div
                              key={index}
                              className={`relative overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${
                                gameData.revealedAnswers[index]
                                  ? "bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse transform scale-105"
                                  : "bg-gradient-to-r from-blue-800 to-blue-900"
                              }`}
                              style={{ minHeight: "80px" }}
                            >
                              <div className="flex items-center justify-between h-full px-4 md:px-6 py-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                                    {gameData.revealedAnswers[index]
                                      ? answer.text
                                      : ""}
                                  </span>
                                </div>
                                {gameData.revealedAnswers[index] && (
                                  <div className="bg-yellow-400 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-xl animate-bounce">
                                    <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                      {answer.points *
                                        getPointMultiplier(
                                          gameData.currentRound
                                        )}
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
                          .slice(
                            Math.ceil(
                              gameData.currentQuestion.answers.length / 2
                            )
                          )
                          .map((answer, index) => {
                            const actualIndex =
                              index +
                              Math.ceil(
                                gameData.currentQuestion.answers.length / 2
                              );
                            return (
                              <div
                                key={actualIndex}
                                className={`relative overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-all duration-700 ${
                                  gameData.revealedAnswers[actualIndex]
                                    ? "bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse transform scale-105"
                                    : "bg-gradient-to-r from-blue-800 to-blue-900"
                                }`}
                                style={{ minHeight: "80px" }}
                              >
                                <div className="flex items-center justify-between h-full px-4 md:px-6 py-4">
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                      <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                        {actualIndex + 1}
                                      </span>
                                    </div>
                                    <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                                      {gameData.revealedAnswers[actualIndex]
                                        ? answer.text
                                        : ""}
                                    </span>
                                  </div>
                                  {gameData.revealedAnswers[actualIndex] && (
                                    <div className="bg-yellow-400 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-xl animate-bounce">
                                      <span className="text-2xl md:text-3xl font-bold text-blue-900">
                                        {answer.points *
                                          getPointMultiplier(
                                            gameData.currentRound
                                          )}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
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
            <div className="inline-flex gap-4 md:gap-6 bg-gradient-to-r from-red-600 to-red-800 px-8 md:px-12 py-4 md:py-6 rounded-3xl shadow-2xl">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <X
                    className={`w-16 h-16 md:w-20 md:h-20 ${
                      i < gameData.strikes
                        ? "text-yellow-300 animate-pulse"
                        : "text-red-900"
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
    );
  }

  // Round End Reveal Screen (Show all answers without scoring)
  if (gameData.gameState === "round-end-reveal") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
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
              <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-300" />
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-6">
          {/* Header */}
          <div className="text-center py-6 md:py-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider animate-pulse drop-shadow-2xl">
              ALL ANSWERS REVEALED!
            </h1>
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-4 rounded-2xl shadow-2xl inline-block">
              <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                {roundNames[gameData.currentRound]} Complete
              </h2>
            </div>
          </div>

          {/* All Answers Display */}
          {gameData.currentQuestion && (
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="max-w-6xl w-full">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl p-4 md:p-8 shadow-2xl">
                  <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {gameData.currentQuestion.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {gameData.currentQuestion.answers.map((answer, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-green-500 to-green-700 rounded-2xl border-4 border-white shadow-xl p-4 md:p-6 animate-pulse"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <span className="text-2xl md:text-3xl font-bold text-green-900">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-xl md:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
                                {answer.text}
                              </span>
                            </div>
                            <div className="bg-yellow-400 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-xl">
                              <span className="text-2xl md:text-3xl font-bold text-green-900">
                                {answer.points *
                                  getPointMultiplier(gameData.currentRound)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Message */}
          <div className="text-center pb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-3xl shadow-2xl animate-bounce">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Calculating Scores...
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Post Round Scoring Screen
  if (gameData.gameState === "post-round-scoring") {
    const winningTeam =
      gameData.roundWinner === "team1"
        ? gameData.team1Config
        : gameData.team2Config;
    const winningColors = getColorClasses(winningTeam.color);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 relative overflow-hidden">
        {/* Animated celebration effects */}
        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce opacity-80"
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

        <div className="relative z-10 min-h-screen flex flex-col justify-center items-center p-4">
          {/* Round Winner */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-wider animate-pulse drop-shadow-2xl">
              ROUND WINNER!
            </h1>

            <div
              className={`${winningColors.bg} p-8 md:p-12 rounded-3xl shadow-2xl animate-bounce`}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                {winningTeam.logo && (
                  <img
                    src={winningTeam.logo || "/placeholder.svg"}
                    alt="Winner Logo"
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-4 border-white"
                  />
                )}
                {typeof getTeamIcon(winningTeam.icon) === "string" ? (
                  <div className="text-5xl md:text-6xl">
                    {getTeamIcon(winningTeam.icon)}
                  </div>
                ) : (
                  React.createElement(getTeamIcon(winningTeam.icon), {
                    className: "w-16 h-16 md:w-20 md:h-20 text-white",
                  })
                )}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {winningTeam.name}
              </h2>
              {winningTeam.motto && (
                <p className="text-lg md:text-xl text-yellow-200 italic">
                  "{winningTeam.motto}"
                </p>
              )}
            </div>
          </div>

          {/* Score Calculation */}
          <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl max-w-4xl w-full">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
              Score Update
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`${
                  getColorClasses(gameData.team1Config.color).bg
                } p-6 rounded-2xl`}
              >
                <h4 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
                  {gameData.team1Config.name}
                </h4>
                <div className="text-center">
                  <p className="text-lg text-yellow-200">
                    Previous: {gameData.team1Score - gameData.roundScore}
                  </p>
                  <p className="text-lg text-yellow-200">
                    Round Points: +
                    {gameData.roundWinner === "team1" ? gameData.roundScore : 0}
                  </p>
                  <div className="border-t-2 border-white mt-2 pt-2">
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      Total:{" "}
                      {gameData.currentRound === "tiebreaker"
                        ? gameData.roundWinner === "team1"
                          ? gameData.roundScore
                          : 0
                        : gameData.team1Score}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`${
                  getColorClasses(gameData.team2Config.color).bg
                } p-6 rounded-2xl`}
              >
                <h4 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
                  {gameData.team2Config.name}
                </h4>
                <div className="text-center">
                  <p className="text-lg text-yellow-200">
                    Previous: {gameData.team2Score - gameData.roundScore}
                  </p>
                  <p className="text-lg text-yellow-200">
                    Round Points: +
                    {gameData.roundWinner === "team2" ? gameData.roundScore : 0}
                  </p>
                  <div className="border-t-2 border-white mt-2 pt-2">
                    <p className="text-3xl md:text-4xl font-bold text-white">
                      Total:{" "}
                      {gameData.currentRound === "tiebreaker"
                        ? gameData.roundWinner === "team2"
                          ? gameData.roundScore
                          : 0
                        : gameData.team2Score}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Round Info */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-xl md:text-2xl font-bold text-white">
                {gameData.currentRound === 4 ||
                gameData.currentRound === "tiebreaker"
                  ? "Match Complete!"
                  : `Next: ${roundNames[(gameData.currentRound + 1) as Round]}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Match Winner Screen
  if (gameData.gameState === "match-winner") {
    const winnerTeam =
      gameData.gameWinner === gameData.team1Config.name
        ? gameData.team1Config
        : gameData.team2Config;
    const winnerColors = getColorClasses(winnerTeam.color);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center relative overflow-hidden">
        {/* Animated confetti */}
        <div className="absolute inset-0">
          {Array.from({ length: 300 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              {Math.random() > 0.5 ? (
                <Star className="w-4 h-4 text-yellow-300" />
              ) : (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 border-4 border-white/30 rounded-full animate-ping" />
          <div className="absolute w-64 h-64 border-4 border-yellow-300/50 rounded-full animate-pulse" />
        </div>

        <div className="text-center z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            {winnerTeam.logo && (
              <img
                src={winnerTeam.logo || "/placeholder.svg"}
                alt="Winner Logo"
                className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white animate-bounce"
              />
            )}
            {typeof getTeamIcon(winnerTeam.icon) === "string" ? (
              <div className="text-6xl md:text-8xl animate-bounce">
                {getTeamIcon(winnerTeam.icon)}
              </div>
            ) : (
              React.createElement(getTeamIcon(winnerTeam.icon), {
                className:
                  "w-24 h-24 md:w-32 md:h-32 text-yellow-300 animate-bounce",
              })
            )}
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 animate-pulse drop-shadow-2xl">
            🎉 {gameData.gameWinner} WINS! 🎉
          </h1>
          {winnerTeam.motto && (
            <div className="text-2xl md:text-3xl text-white/90 mb-6 italic">
              "{winnerTeam.motto}"
            </div>
          )}
          <div className="text-3xl md:text-5xl text-white/90 mb-8 font-bold">
            Final Score: {gameData.team1Config.name} {gameData.team1Score} -{" "}
            {gameData.team2Score} {gameData.team2Config.name}
          </div>
          <div className="text-2xl md:text-3xl text-white/80 animate-pulse">
            Match Complete! 🏆
          </div>
        </div>
      </div>
    );
  }

  // Bracket Update Screen
  if (gameData.gameState === "bracket-update") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl animate-pulse">
              BRACKET UPDATE
            </h1>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-4 rounded-full inline-block">
              <span className="text-2xl md:text-3xl font-bold text-white">
                Match Complete!
              </span>
            </div>
          </div>

          {/* Updated Tournament Bracket */}
          {gameData.tournament && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameData.tournament.matches.map((match: any, index: number) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border-4 shadow-2xl transition-all duration-500 ${
                    match.completed
                      ? "border-green-500 bg-gradient-to-br from-green-900/50 to-blue-900/50 animate-pulse"
                      : index === gameData.tournament?.currentMatchIndex
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-orange-900/50"
                      : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-slate-900/50"
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Match {index + 1}
                    </h3>
                    {match.completed && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mt-2">
                        COMPLETED
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded ${
                            getColorClasses(match.team1.color).bg
                          }`}
                        />
                        <span className="text-white font-medium">
                          {match.team1.name}
                        </span>
                      </div>
                      {match.completed && (
                        <span
                          className={`text-2xl font-bold ${
                            match.winner === match.team1.name
                              ? "text-green-400"
                              : "text-white"
                          }`}
                        >
                          {match.team1Score}
                        </span>
                      )}
                    </div>

                    <div className="text-center">
                      <span className="text-2xl font-bold text-yellow-400">
                        VS
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded ${
                            getColorClasses(match.team2.color).bg
                          }`}
                        />
                        <span className="text-white font-medium">
                          {match.team2.name}
                        </span>
                      </div>
                      {match.completed && (
                        <span
                          className={`text-2xl font-bold ${
                            match.winner === match.team2.name
                              ? "text-green-400"
                              : "text-white"
                          }`}
                        >
                          {match.team2Score}
                        </span>
                      )}
                    </div>
                  </div>

                  {match.completed && (
                    <div className="mt-4 text-center">
                      <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                        WINNER: {match.winner}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Next Match Info */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-3xl shadow-2xl animate-bounce">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {gameData.tournament &&
                gameData.tournament.currentMatchIndex <
                  gameData.tournament.matches.length - 1
                  ? "Next Match Coming Up!"
                  : "Tournament Complete!"}
              </h3>
              <p className="text-lg text-blue-200">
                {gameData.tournament &&
                gameData.tournament.currentMatchIndex <
                  gameData.tournament.matches.length - 1
                  ? "Get ready for the next exciting matchup!"
                  : "All matches have been completed!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tournament Winner Screen
  if (gameData.gameState === "tournament-winner") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gold-400 via-yellow-500 to-orange-500 flex items-center justify-center relative overflow-hidden">
        {/* Epic celebration effects */}
        <div className="absolute inset-0">
          {Array.from({ length: 500 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce opacity-90"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            >
              {Math.random() > 0.7 ? (
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-300" />
              ) : Math.random() > 0.4 ? (
                <Star className="w-4 h-4 md:w-6 md:h-6 text-white" />
              ) : (
                <div className="w-3 h-3 bg-white rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Multiple pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] border-8 border-white/20 rounded-full animate-ping" />
          <div className="absolute w-[600px] h-[600px] border-6 border-yellow-300/30 rounded-full animate-pulse" />
          <div
            className="absolute w-[400px] h-[400px] border-4 border-orange-400/40 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="text-center z-10 max-w-6xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-wider animate-pulse drop-shadow-2xl">
              🏆 TOURNAMENT CHAMPION! 🏆
            </h1>
          </div>

          {gameData.tournamentWinner && (
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-12 md:p-16 rounded-[4rem] shadow-2xl border-8 border-white animate-bounce">
              <div className="flex items-center justify-center gap-6 mb-8">
                <Trophy
                  className="w-20 h-20 md:w-24 md:h-24 text-yellow-300 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <div className="text-center">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                    {gameData.tournamentWinner}
                  </h2>
                  <p className="text-2xl md:text-3xl text-yellow-200 font-semibold">
                    ULTIMATE CHAMPIONS!
                  </p>
                </div>
                <Trophy
                  className="w-20 h-20 md:w-24 md:h-24 text-yellow-300 animate-spin"
                  style={{
                    animationDuration: "3s",
                    animationDirection: "reverse",
                  }}
                />
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Tournament Complete!
                </h3>
                <p className="text-lg md:text-xl text-blue-100">
                  Congratulations to all teams for an amazing tournament!
                </p>
              </div>

              <div className="text-3xl md:text-4xl text-white animate-pulse font-bold">
                🎉 VICTORY CELEBRATION! 🎉
              </div>
            </div>
          )}

          {/* Final Tournament Stats */}
          <div className="mt-12 bg-black/30 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Tournament Statistics
            </h3>
            {gameData.tournament && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-300">
                    {gameData.tournament.teams.length}
                  </p>
                  <p className="text-lg">Teams Participated</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-300">
                    {gameData.tournament.matches.length}
                  </p>
                  <p className="text-lg">Matches Played</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-300">
                    Round Robin
                  </p>
                  <p className="text-lg">Tournament Format</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grand Winner Screen
  if (gameData.gameState === "grand-winner") {
    const winnerTeam =
      gameData.team1Score > gameData.team2Score
        ? gameData.team1Config
        : gameData.team2Config;
    const winnerScore =
      gameData.team1Score > gameData.team2Score
        ? gameData.team1Score
        : gameData.team2Score;
    const loserTeam =
      gameData.team1Score > gameData.team2Score
        ? gameData.team2Config
        : gameData.team1Config;
    const loserScore =
      gameData.team1Score > gameData.team2Score
        ? gameData.team2Score
        : gameData.team1Score;

    return (
      <div className="min-h-screen w-full h-screen flex items-center justify-center overflow-hidden relative bg-cover bg-[url('/secondary-bg.webp')]">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 max-w-6xl mx-auto px-4">
          {/* Main Title */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-9xl font-bold text-yellow-400 mb-4 tracking-wider animate-bounce drop-shadow-2xl">
              GRAND WINNER!
            </h1>
            <div className="flex justify-center mb-8">
              <Crown className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Winner Display */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-8 md:p-12 rounded-3xl shadow-2xl mb-8 animate-scale-up">
            <div className="flex flex-col items-center">
              <Trophy className="w-20 h-20 md:w-32 md:h-32 text-white mb-6 animate-bounce" />

              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {winnerTeam.name}
              </h2>

              <div className="bg-white/20 px-8 py-4 rounded-2xl backdrop-blur-sm">
                <p className="text-2xl md:text-4xl font-bold text-white">
                  Final Score: {String(winnerScore).padStart(3, "0")}
                </p>
              </div>

              <p className="text-xl md:text-2xl text-white mt-4 italic">
                "{winnerTeam.motto}"
              </p>
            </div>
          </div>

          {/* Runner-up */}
          <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-6 md:p-8 rounded-2xl shadow-xl mb-8">
            <div className="flex flex-col items-center">
              <Star className="w-12 h-12 md:w-16 md:h-16 text-white mb-4" />

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Runner-up: {loserTeam.name}
              </h3>

              <p className="text-lg md:text-xl text-white">
                Final Score: {String(loserScore).padStart(3, "0")}
              </p>
            </div>
          </div>

          {/* Congratulations Message */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">
              🎉 CONGRATULATIONS! 🎉
            </h3>
            <p className="text-lg md:text-xl text-purple-200">
              Thank you for playing Family Feud!
            </p>
          </div>
        </div>

        {/* Watermark */}
        <img
          src="/watermark.svg"
          alt="Watermark"
          className="fixed right-4 bottom-4 w-32 h-auto z-50 pointer-events-none select-none"
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
        <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">
          FAMILY FEUD
        </h1>
        <p className="text-xl md:text-3xl text-white/80">
          Loading Game State...
        </p>
      </div>
    </div>
  );
}
