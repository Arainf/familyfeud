"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameData, getColorClasses } from "@/lib/game-utils";

export default function MatchWinnerPage() {
  const router = useRouter();
  const gameData = useGameData();

  useEffect(() => {
    const channel = new BroadcastChannel("feud-game-state");
    const gameStateRoutes = {
      idle: "/states/idle",
      "bracket-show": "/states/bracket-show",
      "team-vs": "/states/team-vs",
      "round-start": "/states/round-start",
      "game-play": "/states/game-play",
      "round-end-reveal": "/states/round-end-reveal",
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

  if (!gameData || !gameData.tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <span className="text-white text-2xl animate-pulse">Loading...</span>
      </div>
    );
  }

  const matchIndex = gameData.tournament.currentMatchIndex;
  const match = gameData.tournament.matches?.[matchIndex];

  // Only show winner if currentRound is 4 (final round)
  const isFinalRound = match && (match.currentRound === 4 || match.currentRound === "4");
  if (!match || !gameData.tournament.teams || !isFinalRound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-orange-900 to-yellow-700">
        <span className="text-white text-2xl animate-pulse">Winner will be revealed after the final round!</span>
      </div>
    );
  }

  // Get teams and scores
  let team1 = gameData.tournament.teams?.find((t: any) => t.name === match.team1Id);
  let team2 = gameData.tournament.teams?.find((t: any) => t.name === match.team2Id);
  let team1Score = typeof match.team1Score === "number" ? match.team1Score : 0;
  let team2Score = typeof match.team2Score === "number" ? match.team2Score : 0;
  if (!team1 && gameData.team1Config) team1 = gameData.team1Config;
  if (!team2 && gameData.team2Config) team2 = gameData.team2Config;

  // Determine winner/loser
  let winner, loser, winnerScore, loserScore;
  if (team1Score >= team2Score) {
    winner = team1;
    loser = team2;
    winnerScore = team1Score;
    loserScore = team2Score;
  } else {
    winner = team2;
    loser = team1;
    winnerScore = team2Score;
    loserScore = team1Score;
  }

  // Choose background
  const bgUrl = "/winner-bg.png";
  // fallback to a nice gradient if bg not found

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgUrl}), linear-gradient(135deg, #fbbf24 0%, #f59e42 50%, #f472b6 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Confetti effect */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <svg className="absolute w-full h-full" style={{ opacity: 0.15 }}>
          <defs>
            <radialGradient id="confetti" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#fffbe6" />
              <stop offset="100%" stopColor="#fbbf24" />
            </radialGradient>
          </defs>
          {[...Array(100)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 100 + "%"}
              cy={Math.random() * 100 + "%"}
              r={Math.random() * 8 + 2}
              fill="url(#confetti)"
              opacity={Math.random() * 0.6 + 0.2}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-20 bg-black/80 rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col items-center max-w-2xl mx-auto border-4 border-yellow-400">
        <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-300 mb-8 drop-shadow-lg animate-bounce">🏆 Match Winner!</h1>
        <div className="flex flex-col md:flex-row items-center gap-10 w-full justify-between">
          {/* Winner Card */}
          <div className="flex flex-col items-center bg-yellow-100/10 rounded-2xl p-6 shadow-xl border-4 border-yellow-400 min-w-[180px] max-w-xs">
            <img
              src={winner?.logo || "/logo.gif"}
              alt="Winner Logo"
              className="w-32 h-32 object-contain rounded-full border-4 border-yellow-300 bg-white/10 shadow-lg mb-4 animate-pulse"
              style={{ filter: "drop-shadow(0 0 32px #fde68a)" }}
            />
            <span className="text-3xl md:text-4xl font-bold text-yellow-200 mb-2 drop-shadow-lg animate-pulse">
              {winner?.name || "Winner"}
            </span>
            <span className="text-2xl font-bold text-white mb-1">Score: {winnerScore}</span>
            <span className="text-lg font-semibold text-yellow-400 tracking-wide mb-2">Congratulations!</span>
            <span className="text-base text-yellow-200 italic text-center">{winner?.motto || ""}</span>
          </div>

          {/* VS Divider */}
          <div className="text-5xl font-black text-yellow-200 mx-4 hidden md:block">VS</div>

          {/* Loser Card */}
          <div className="flex flex-col items-center bg-gray-900/70 rounded-2xl p-6 shadow-lg border-4 border-gray-600 min-w-[180px] max-w-xs opacity-60 grayscale">
            <img
              src={loser?.logo || "/logo.gif"}
              alt="Loser Logo"
              className="w-28 h-28 object-contain rounded-full border-4 border-gray-400 bg-white/10 shadow mb-4"
            />
            <span className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
              {loser?.name || "Loser"}
            </span>
            <span className="text-xl font-bold text-gray-100 mb-1">Score: {loserScore}</span>
            <span className="text-base font-semibold text-gray-400 tracking-wide mb-2">Good effort!</span>
            <span className="text-base text-gray-300 italic text-center">{loser?.motto || ""}</span>
          </div>
        </div>

        <button
          className="mt-10 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-10 py-4 rounded-full shadow-lg text-2xl transition-all animate-bounce"
          onClick={() => router.replace("/states/bracket-show")}
        >
          Continue to Bracket
        </button>
      </div>
    </div>
  );
}
