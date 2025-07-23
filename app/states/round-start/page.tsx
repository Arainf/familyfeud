"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ConnectionStatus from "@/components/ConnectionStatus";



import { useRouter } from "next/navigation";

export default function RoundStartPage() {
  const router = useRouter();
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

      <motion.img
        src={roundNumber === 5 ? "/tie-breaker.webp" : `/round.webp`}
        alt="Round"
        className={ roundNumber === 5 ? "w-full h-screen object-none drop-shadow-2xl z-10" : "w-full h-screen ml-[-20%] object-none drop-shadow-2xl z-10"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "tween", duration: 0.9, ease: [0.68, -0.55, 0.27, 1.55] }}
      />

      {/* Centered ROUND [number] image with animation */}
      { roundNumber !== 5 ? ( 
        <motion.img
        src={`/${roundNumber}.webp`}
        alt={`Round ${roundNumber}`}
        className="w-[700px] max-w-full ml-[-35%] drop-shadow-2xl z-10 object-none"
        style={{ marginTop: "8vh", marginBottom: "8vh" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "tween", duration: 0.9, ease: [0.68, -0.55, 0.27, 1.55] }}
      />
      ) : null}
      <ConnectionStatus />
    </div>
  );
}
