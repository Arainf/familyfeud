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
      "grand-winner": "/states/grand-winner",
    };
    channel.onmessage = (event) => {
      const { gameState } = event.data;
      const targetPath =
        gameStateRoutes[gameState as keyof typeof gameStateRoutes] ||
        "/states/idle";
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

  if (!match || !gameData.tournament.teams) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-orange-900 to-yellow-700">
        <span className="text-white text-2xl animate-pulse">
          Match information unavailable.
        </span>
      </div>
    );
  }

  // Try to get teams and scores from the bracket match first
  let team1 = gameData.tournament.teams?.find(
    (t: any) => t.name === match.team1Id
  );
  let team2 = gameData.tournament.teams?.find(
    (t: any) => t.name === match.team2Id
  );
  let team1Score = match.team1Score;
  let team2Score = match.team2Score;

  // Fallback to top-level config if bracket info is missing
  if (!team1 && gameData.team1Config) team1 = gameData.team1Config;
  if (!team2 && gameData.team2Config) team2 = gameData.team2Config;
  if (typeof team1Score !== "number" && typeof gameData.team1Score === "number")
    team1Score = gameData.team1Score;
  if (typeof team2Score !== "number" && typeof gameData.team2Score === "number")
    team2Score = gameData.team2Score;

  // Determine winner
  let winnerName = match.winnerName;
  if (
    !winnerName &&
    typeof team1Score === "number" &&
    typeof team2Score === "number"
  ) {
    winnerName = team1Score > team2Score ? team1?.name : team2?.name;
  }
  let winnerColor = "gray";
  if (winnerName && team1 && winnerName === team1.name)
    winnerColor = team1.color || team1.primaryColor || "gray";
  else if (winnerName && team2 && winnerName === team2.name)
    winnerColor = team2.color || team2.primaryColor || "gray";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-900 via-orange-900 to-yellow-700 p-4">
      <div className="bg-black/70 rounded-3xl shadow-2xl p-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-300 mb-6 drop-shadow-lg animate-bounce">
          Match Winner!
        </h1>
        <div className="flex flex-col items-center gap-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-6xl font-bold border-8 ${
              getColorClasses(winnerColor).bg
            } shadow-xl mb-4 animate-pulse`}
          ></div>
          <span className="text-3xl md:text-5xl font-extrabold text-white tracking-wide animate-pulse">
            {winnerName || "TBD"}
          </span>
        </div>
        <div className="mt-8">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg text-xl transition-all"
            onClick={() => router.replace("/states/bracket-show")}
          >
            Continue to Bracket
          </button>
        </div>
      </div>
    </div>
  );
}
