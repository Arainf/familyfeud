"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Crown, Star } from "lucide-react";

interface TeamConfig {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  motto: string;
}

interface GameData {
  gameState: string;
  team1Config: TeamConfig;
  team2Config: TeamConfig;
  team1Score: number;
  team2Score: number;
  grandWinner?: string;
}

export default function GrandWinnerPage() {
  const router = useRouter();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/Game_Winner_Music.mp3");
      audioRef.current.loop = true;
    }

    // Function to update game data from localStorage
    const updateGameData = () => {
      const gameStateRaw = localStorage.getItem("familyFeudGameState");
      if (gameStateRaw) {
        try {
          const parsedData = JSON.parse(gameStateRaw);
          setGameData(parsedData);
        } catch (error) {
          console.error("Error parsing game state:", error);
        }
      }
    };

    updateGameData();

    // Listen for changes in localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "familyFeudGameState") {
        updateGameData();
      }
    };
    window.addEventListener("storage", onStorage);

    // Poll for changes in the same tab
    const interval = setInterval(updateGameData, 200);

    // Start fireworks animation after a delay
    const fireworksTimer = setTimeout(() => {
      setShowFireworks(true);
    }, 1000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
      clearTimeout(fireworksTimer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-400 mx-auto mb-8"></div>
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 tracking-wider animate-pulse">
            FAMILY FEUD
          </h1>
          <p className="text-xl md:text-3xl text-white/80">Loading Winner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full h-screen flex flex-col overflow-hidden relative bg-cover bg-[url('/secondary-bg.webp')]">
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

      {/* Fireworks effect */}
      {showFireworks && (
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center z-10 max-w-6xl mx-auto bg-red-300 px-4 flex-grow flex flex-col justify-center">
        {/* Main Title */}
        <div className="mt-12">
          <h1 className="text-xl md:text-9xl font-bold text-yellow-400 mb-4  animate-bounce drop-shadow-2xl">
            GRAND WINNER
          </h1>
        </div>
      </div>

      {/* Bottom Box */}
      <div className="w-full flex justify-center z-10">
        <div className="bg-black/50 backdrop-blur-sm  w-[100rem] h-[75vh] flex justify-center items-end">
          {/* Podium Rankings: 2-1-3 */}
          <div className="flex justify-center items-end">
            {/* 2nd Place - Left */}
            <div className="relative">
              {/* Small rectangle above podium */}
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-80 h-6"
                style={{
                  backgroundColor: "rgba(79, 48, 4, 1)",
                  clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              ></div>
              <div
                className=" p-8 h-64 w-80 flex flex-col justify-start items-center"
                style={{ backgroundColor: "rgba(76, 158, 218, 1)" }}
              >
                {/* Small rectangle at lower right corner pointing up  */}
                <div
                  className="absolute z-0 bottom-0 right-0 w-48 h-full"
                  style={{
                    backgroundColor: "rgba(44, 98, 137, 1)",
                    clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)",
                  }}
                ></div>
                <div
                  className="text-white mb-5 text-[170px] bg-black relative"
                  style={{ fontFamily: "Mozaic GEO", fontWeight: "bold" }}
                >
                  2
                </div>
              </div>
            </div>

            {/* 1st Place - Middle (Tallest) */}
            <div className="relative">
              {/* Small rectangle above podium */}
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-96 h-6"
                style={{
                  backgroundColor: "rgba(79, 48, 4, 1)",
                  clipPath: "polygon(15% 0%, 90% 0%, 100% 100%, 0% 100%)",
                }}
              ></div>
              <div
                className=" p-8 h-80 w-96 flex flex-col justify-center items-center"
                style={{ backgroundColor: "rgba(76, 158, 218, 1)" }}
              >
                <div
                  className="text-white mt-10 text-[220px]"
                  style={{ fontFamily: "Mozaic GEO", fontWeight: "800" }}
                >
                  1
                </div>
              </div>
            </div>

            {/* 3rd Place - Right */}
            <div className="relative">
              {/* Small rectangle above podium */}
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-80 h-6"
                style={{
                  backgroundColor: "rgba(79, 48, 4, 1)",
                  clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%)",
                }}
              ></div>
              <div
                className=" p-8 h-48 w-80 flex flex-col justify-center items-center"
                style={{ backgroundColor: "rgba(76, 158, 218, 1)" }}
              >
                <div
                  className="text-white  mt-10 text-[170px]"
                  style={{ fontFamily: "Mozaic GEO", fontWeight: "bold" }}
                >
                  3
                </div>
                {/* Small rectangle at lower left corner pointing up */}
                <div
                  className="absolute bottom-0 left-0 w-32 h-full"
                  style={{
                    backgroundColor: "rgba(41, 118, 175, 1)",
                    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
                  }}
                ></div>
              </div>
            </div>
          </div>
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
