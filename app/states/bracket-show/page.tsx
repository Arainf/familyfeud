"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameData, getColorClasses } from "@/lib/game-utils";

export default function BracketShowPage() {
  const router = useRouter();
  const gameData = useGameData();

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

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">
            FAMILY FEUD
          </h1>
          <p className="text-xl md:text-3xl text-white/80">
            Loading Bracket...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
            TOURNAMENT BRACKET
          </h1>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 rounded-full inline-block">
            <span className="text-2xl md:text-3xl font-bold text-black">
              3-Team Bracket
            </span>
          </div>
        </div>

        {/* Tournament Bracket Display */}
        {gameData.tournament && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Match 1: Team 1 vs Team 2 */}
            <div
              className={`p-6 rounded-2xl border-4 shadow-2xl transition-all duration-500 ${
                gameData.tournament.currentMatchIndex === 0
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 animate-pulse scale-105"
                  : gameData.tournament.matches[0]?.completed
                  ? "border-green-500 bg-gradient-to-br from-green-900/30 to-blue-900/30"
                  : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-slate-900/50"
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Match 1: {gameData.tournament.teams[0]?.name} vs{" "}
                  {gameData.tournament.teams[1]?.name}
                </h3>
              </div>
              {/* Team 1 */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded ${
                      getColorClasses(
                        gameData.tournament.teams[0]?.primaryColor || "gray"
                      ).bg
                    }`}
                  />
                  <span className="text-white font-medium">
                    {gameData.tournament.teams[0]?.name}
                  </span>
                </div>
                {gameData.tournament.matches[0]?.completed && (
                  <span className="text-2xl font-bold text-white">
                    {gameData.tournament.matches[0]?.team1Score}
                  </span>
                )}
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-yellow-400">VS</span>
              </div>
              {/* Team 2 */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded ${
                      getColorClasses(
                        gameData.tournament.teams[1]?.primaryColor || "gray"
                      ).bg
                    }`}
                  />
                  <span className="text-white font-medium">
                    {gameData.tournament.teams[1]?.name}
                  </span>
                </div>
                {gameData.tournament.matches[0]?.completed && (
                  <span className="text-2xl font-bold text-white">
                    {gameData.tournament.matches[0]?.team2Score}
                  </span>
                )}
              </div>
              {gameData.tournament.currentMatchIndex === 0 && (
                <div className="mt-4 text-center">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold animate-bounce">
                    NEXT MATCH
                  </div>
                </div>
              )}
            </div>

            {/* Match 2: Winner of Match 1 vs Team 3 */}
            <div
              className={`p-6 rounded-2xl border-4 shadow-2xl transition-all duration-500 ${
                gameData.tournament.currentMatchIndex === 1
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 animate-pulse scale-105"
                  : gameData.tournament.matches[1]?.completed
                  ? "border-green-500 bg-gradient-to-br from-green-900/30 to-blue-900/30"
                  : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-slate-900/50"
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Match 2: Winner of Match 1 vs{" "}
                  {gameData.tournament.teams[2]?.name}
                </h3>
              </div>
              {/* Winner of Match 1 */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded ${
                      getColorClasses(
                        gameData.tournament.matches[0]?.winnerColor || "gray"
                      ).bg
                    }`}
                  />
                  <span className="text-white font-medium">
                    {gameData.tournament.matches[0]?.winnerName || "Winner M1"}
                  </span>
                </div>
                {gameData.tournament.matches[1]?.completed && (
                  <span className="text-2xl font-bold text-white">
                    {gameData.tournament.matches[1]?.team1Score}
                  </span>
                )}
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-yellow-400">VS</span>
              </div>
              {/* Team 3 */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded ${
                      getColorClasses(
                        gameData.tournament.teams[2]?.primaryColor || "gray"
                      ).bg
                    }`}
                  />
                  <span className="text-white font-medium">
                    {gameData.tournament.teams[2]?.name}
                  </span>
                </div>
                {gameData.tournament.matches[1]?.completed && (
                  <span className="text-2xl font-bold text-white">
                    {gameData.tournament.matches[1]?.team2Score}
                  </span>
                )}
              </div>
              {gameData.tournament.currentMatchIndex === 1 && (
                <div className="mt-4 text-center">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold animate-bounce">
                    NEXT MATCH
                  </div>
                </div>
              )}
            </div>

            {/* Match 3: Loser of Match 1 vs Loser of Match 2 */}
            <div
              className={`p-6 rounded-2xl border-4 shadow-2xl transition-all duration-500 ${
                gameData.tournament.currentMatchIndex === 2
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 animate-pulse scale-105"
                  : gameData.tournament.matches[2]?.completed
                  ? "border-green-500 bg-gradient-to-br from-green-900/30 to-blue-900/30"
                  : "border-gray-600 bg-gradient-to-br from-gray-900/50 to-slate-900/50"
              }`}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Match 3: Loser of Match 1 vs Loser of Match 2
                </h3>
              </div>
              {/* Loser of Match 1 */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded ${
                      getColorClasses(
                        gameData.tournament.matches[0]?.loserColor || "gray"
                      ).bg
                    }`}
                  />
                  <span className="text-white font-medium">
                    {gameData.tournament.matches[0]?.loserName || "Loser M1"}
                  </span>
                </div>
                {gameData.tournament.matches[2]?.completed && (
                  <span className="text-2xl font-bold text-white">
                    {gameData.tournament.matches[2]?.team1Score}
                  </span>
                )}
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold text-yellow-400">VS</span>
              </div>
              {/* Loser of Match 2 */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded ${
                      getColorClasses(
                        gameData.tournament.matches[1]?.loserColor || "gray"
                      ).bg
                    }`}
                  />
                  <span className="text-white font-medium">
                    {gameData.tournament.matches[1]?.loserName || "Loser M2"}
                  </span>
                </div>
                {gameData.tournament.matches[2]?.completed && (
                  <span className="text-2xl font-bold text-white">
                    {gameData.tournament.matches[2]?.team2Score}
                  </span>
                )}
              </div>
              {gameData.tournament.currentMatchIndex === 2 && (
                <div className="mt-4 text-center">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold animate-bounce">
                    NEXT MATCH
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Rankings */}
        {gameData.tournament &&
          gameData.tournament.matches.every((m: any) => m.completed) && (
            <div className="mt-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Final Rankings
              </h2>
              {/* You can add logic here to display the rankings based on match results */}
              <div className="flex flex-col items-center gap-2">
                {/* Placeholder: Replace with actual ranking logic */}
                <span className="text-xl text-yellow-300">1st: TBD</span>
                <span className="text-lg text-gray-200">2nd: TBD</span>
                <span className="text-lg text-gray-400">3rd: TBD</span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
