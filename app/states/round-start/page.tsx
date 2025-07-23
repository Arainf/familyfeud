"use client";
import { useEffect, useState } from "react";



export default function RoundStartPage() {
  const [roundNumber, setRoundNumber] = useState(1);
  

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Convert tiebreaker to 5 for image display
          setRoundNumber(parsed.currentRound === "tiebreaker" ? 5 : parsed.currentRound)
        } catch (error) {
          console.error("Error parsing game state:", error)
        }
      }
    }

    loadGameState()
    const interval = setInterval(loadGameState, 100)
    return () => clearInterval(interval)
  }, []);
 

  return (
    <div
      className="min-h-screen w-full h-screen flex flex-row items-center justify-center overflow-hidden relative"
      style={{
        backgroundImage: "url('/game-screen.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top bunting */}
      <img
        src="/round.webp"
        alt="Bunting"
        className="w-full h-screen ml-[-20%] object-none"
        style={{ pointerEvents: "none" }}
      />

      {/* Centered ROUND [number] image */}
      <img
        src={roundNumber === 5 ? "/tie-breaker.webp" : `/${roundNumber}.webp`}
        alt={roundNumber === 5 ? "Tie Breaker" : `Round ${roundNumber}`}
        className="w-[700px] max-w-full ml-[-35%] drop-shadow-2xl z-10 object-none"
        style={{ marginTop: "8vh", marginBottom: "8vh" }}
      />

    </div>
  );
}
