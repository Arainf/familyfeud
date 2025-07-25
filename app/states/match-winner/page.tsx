"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TeamConfig {
  name: string;
  color1: string;
  color2: string;
  icon: string;
  logo?: string;
  motto?: string;
}

export default function MatchWinnerPage() {
  const [teamWinner, setTeamWinner] = useState<TeamConfig | null>(null);

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const winner = localStorage.getItem("roundWinner") || "";
          setTeamWinner(parsed.team1Config.name === winner ? parsed.team1Config : parsed.team2Config);
        } catch (error) {
          console.error("Error parsing game state:", error);
        }
      }
    };
    loadGameState();
  }, []);

  if (!teamWinner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 via-orange-900 to-yellow-700">
        <span className="text-white text-2xl animate-pulse">Winner will be revealed after the final round!</span>
      </div>
    );
  }

  const bgUrl = "/secondary-bg.webp";
  const { color1, color2, logo } = teamWinner;
  // Glowing animated style
  const glowStyle = {
    boxShadow: `0 0 120px 40px ${color1}, 0 0 200px 80px ${color2}`,
    borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color1} 0%, ${color2} 100%)` as string,
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgUrl}), linear-gradient(135deg, #fbbf24 0%, #f59e42 50%, #f472b6 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 480, height: 480 }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: [0.7, 1.05, 0.95, 1], opacity: 1, boxShadow: [
          `0 0 60px 10px ${color1}, 0 0 120px 40px ${color2}`,
          `0 0 120px 40px ${color1}, 0 0 200px 80px ${color2}`,
          `0 0 90px 30px ${color1}, 0 0 160px 60px ${color2}`,
          `0 0 120px 40px ${color1}, 0 0 200px 80px ${color2}`
        ] }}
        transition={{
          scale: { duration: 1, type: "spring" },
          opacity: { duration: 0.7 },
          boxShadow: { duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
        }}
      >
        <motion.img
          src={logo || "/logo.gif"}
          alt="Winner Logo"
          className="object-contain"
          style={{ width: 400, height: 400, borderRadius: "50%", ...glowStyle }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ scale: { duration: 1.2, type: "spring" }, opacity: { duration: 0.8 } }}
        />
      </motion.div>
    </div>
  );
}

