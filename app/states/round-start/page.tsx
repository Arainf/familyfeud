"use client";
import { useEffect, useState } from "react";



export default function RoundStartPage() {
  const [roundNumber, setRoundNumber] = useState(1);
  

  useEffect(() => {
    // Function to update round number from localStorage
    const updateRound = () => {
      const gameState = localStorage.getItem("familyFeudGameState");
      if (gameState) {
        try {
          const parsedState = JSON.parse(gameState);
          const round = parsedState.currentRound;
          // Convert tiebreaker to 5 for image display
          setRoundNumber(round === "tiebreaker" ? 5 : round);
        } catch (error) {
          console.error("Error parsing game state:", error);
        }
      }
    };

    updateRound();

    // Listen for changes in localStorage (from other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "familyFeudGameState") {
        updateRound();
      }
    };
    window.addEventListener("storage", onStorage);

    // Poll for changes in the same tab
    const interval = setInterval(updateRound, 200);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
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
