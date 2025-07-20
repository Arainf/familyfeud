"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoundEndRevealPage() {
  const router = useRouter();
  const [roundWinner, setRoundWinner] = useState("");
  const [roundPoints, setRoundPoints] = useState("");

  useEffect(() => {
    setRoundWinner(localStorage.getItem("roundWinner") || "");
    setRoundPoints(localStorage.getItem("roundPoints") || "");
  }, []);

  const handleNextRound = () => {
    localStorage.setItem("showRoundSummary", "false");
    router.push("/states/game-play");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
        <h2 className="text-4xl font-bold text-yellow-400 mb-4">Round Summary</h2>
        <div className="text-2xl text-white mb-2">
          Winner: <span className="font-bold">{roundWinner}</span>
        </div>
        <div className="text-xl text-blue-300 mb-6">
          Points Awarded: <span className="font-bold">{roundPoints}</span>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
          onClick={handleNextRound}
        >
          Next Round
        </button>
      </div>
    </div>
  );
} 