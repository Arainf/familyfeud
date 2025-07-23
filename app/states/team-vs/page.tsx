"use client";

import React, { useEffect, useState } from "react";
import {
  Crown,
  Star,
  Zap,
  Shield,
  Trophy,
  Target,
  Flame,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ConnectionStatus from "@/components/ConnectionStatus";

interface TeamConfig {
  name: string;
  color: string;
  icon: string;
  logo?: string;
  motto?: string;
}

interface GameData {
  team1Config: TeamConfig;
  team2Config: TeamConfig;
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
  };
  return colorMap[color] || colorMap.blue;
};

const getTeamIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    crown: Crown,
    star: Star,
    heart: Heart,
    zap: Zap,
    shield: Shield,
    trophy: Trophy,
    target: Target,
    flame: Flame,
  };
  return iconMap[iconName] || Crown;
};

export default function TeamVsPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState");
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setGameData(parsedData);

          // Start animation sequence after a short delay
          setTimeout(() => {
            setAnimationComplete(true);
          }, 500);
        } catch (error) {
          console.error("Error parsing game state:", error);
        }
      }
    };

    loadGameState();
    const interval = setInterval(loadGameState, 100);
    return () => clearInterval(interval);
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
            LOADING...
          </h1>
        </div>
      </div>
    );
  }

  const team1Colors = getColorClasses(gameData.team1Config.color);
  const team2Colors = getColorClasses(gameData.team2Config.color);

  return (
    <div
      className="min-h-screen  flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/game-screen.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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

      <div className="text-center z-10 w-full max-w-[90vw] mx-auto">
        {/* Teams Display */}
        <div className="flex flex-row gap-8 md:gap-16 lg:gap-32 xl:gap-48 2xl:gap-64 justify-center items-center w-full px-4">
          {/* Team 1 */}
          <AnimatePresence>
            <motion.div
              initial={{ x: -1000, opacity: 0, rotateY: 180 }}
              animate={
                animationComplete
                  ? {
                      x: 0,
                      opacity: 1,
                      rotateY: 0,
                      transition: {
                        type: "spring",
                        stiffness: 50,
                        damping: 10,
                        delay: 0.3,
                      },
                    }
                  : {}
              }
              className="h-auto w-auto origin-center"
              style={{
                viewTransitionName: "team1-card",
              }}
            >
              <div className="text-center relative">
                {gameData.team1Config.logo ? (
                  <motion.img
                    src={gameData.team1Config.logo}
                    alt="Team 1 Logo"
                    className="h-[350px] w-[20vw] md:h-[500px] lg:h-[650px] xl:h-[800px] w-auto object-contain max-h-[70vh]"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={
                      animationComplete
                        ? {
                            scale: 1,
                            opacity: 1,
                            transition: {
                              delay: 0.5,
                              type: "spring",
                              stiffness: 100,
                            },
                          }
                        : {}
                    }
                    style={{
                      viewTransitionName: "team1-logo",
                      filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))",
                    }}
                  />
                ) : (
                  <div className="h-[300px] md:h-[400px] lg:h-[500px] w-[300px] md:w-[400px] lg:w-[500px] bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      Team 1
                    </span>
                  </div>
                )}

                {/* Team Name */}
                <motion.div
                  className="mt-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={
                    animationComplete
                      ? {
                          y: 0,
                          opacity: 1,
                          transition: {
                            delay: 0.8,
                            type: "spring",
                          },
                        }
                      : {}
                  }
                ></motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* VS Symbol */}
          <AnimatePresence>
            <motion.div
              className="flex items-center justify-center z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                animationComplete
                  ? {
                      scale: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.7,
                        type: "tween",
                        duration: 0.8,
                        ease: [0.68, -0.55, 0.27, 1.55],
                      },
                    }
                  : {}
              }
            >
              <motion.div
                className="h-auto w-[20vw] max-w-[1000px] md:max-w-[1000px] lg:max-w-[1000px] xl:max-w-[1000px]"
                style={{
                  viewTransitionName: "vs-symbol",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  className="w-full h-auto object-contain"
                  src="/vs.png"
                  alt="Versus"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Team 2 */}
          <AnimatePresence>
            <motion.div
              initial={{ x: 1000, opacity: 0, rotateY: -180 }}
              animate={
                animationComplete
                  ? {
                      x: 0,
                      opacity: 1,
                      rotateY: 0,
                      transition: {
                        type: "spring",
                        stiffness: 50,
                        damping: 10,
                        delay: 0.3,
                      },
                    }
                  : {}
              }
              className="h-auto w-auto origin-center"
              style={{
                viewTransitionName: "team2-card",
              }}
            >
              <div className="text-center relative">
                {gameData.team2Config.logo ? (
                  <motion.img
                    src={gameData.team2Config.logo}
                    alt="Team 2 Logo"
                    className="h-[350px] w-[20vw] md:h-[500px] lg:h-[650px] xl:h-[800px] w-auto object-contain max-h-[70vh]"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={
                      animationComplete
                        ? {
                            scale: 1,
                            opacity: 1,
                            transition: {
                              delay: 0.5,
                              type: "spring",
                              stiffness: 100,
                            },
                          }
                        : {}
                    }
                    style={{
                      viewTransitionName: "team2-logo",
                      filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.7))",
                    }}
                  />
                ) : (
                  <div className="h-[300px] md:h-[400px] lg:h-[500px] w-[300px] md:w-[400px] lg:w-[500px] bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      Team 2
                    </span>
                  </div>
                )}

                {/* Team Name */}
                <motion.div
                  className="mt-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={
                    animationComplete
                      ? {
                          y: 0,
                          opacity: 1,
                          transition: {
                            delay: 0.8,
                            type: "spring",
                          },
                        }
                      : {}
                  }
                ></motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ConnectionStatus />
    </div>
  );
}
