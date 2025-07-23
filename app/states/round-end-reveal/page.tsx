"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RoundEndRevealPage() {
  const router = useRouter();
  const [roundWinner, setRoundWinner] = useState("");
  const [roundPoints, setRoundPoints] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    // Function to update current round, points, and score from localStorage
    const updateRoundAndPoints = () => {
      const gameStateRaw = localStorage.getItem("familyFeudGameState");
      let gameState: any = {};
      if (gameStateRaw) {
        try {
          gameState = JSON.parse(gameStateRaw);
        } catch (e) {
          gameState = {};
        }
      }
      setCurrentRound(Number(gameState.currentRound) || 1);
      setRoundWinner(localStorage.getItem("roundWinner") || "");
      setRoundPoints(localStorage.getItem("roundPoints") || "");
      setCurrentScore(Number(gameState.roundScore) || 0);
    };
    updateRoundAndPoints();

    // Listen for changes in localStorage (from other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "familyFeudGameState" ||
        e.key === "roundWinner" ||
        e.key === "roundPoints"
      ) {
        updateRoundAndPoints();
      }
    };
    window.addEventListener("storage", onStorage);

    // Poll for changes in the same tab
    const interval = setInterval(updateRoundAndPoints, 200);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  const handleNextRound = () => {
    localStorage.setItem("showRoundSummary", "false");
    router.push("/states/game-play");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-[url('/secondary-bg.webp')]">
      <div className="w-[1280px] h-[720px] grid grid-rows-[2fr_1fr] outline outline-8 outline-blue-800">
        <div className="outline outline-8 outline-red-800 w-full h-full flex items-center justify-around  relative">
          <div className="flex flex-col items-center justify-center m">
            <div className="w-fit h-fit flex items-center justify-center absolute ml-16 left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2">
              <img
                src="/siteao.svg"
                alt="Siteao"
                className="max-w-full max-h-full"
                style={{ width: "180%", height: "140%" }}
              />
              <div className="absolute inset-0 flex items-end mb-8 justify-center">
                <span
                  className="text-[100px] drop-shadow-lg"
                  style={{
                    fontFamily: "Mozaic GEO",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {String(currentScore).padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-fit h-fit flex items-center justify-center mr-16 absolute right-1/4  top-1/3 translate-x-1/2 -translate-y-1/2">
              <img
                src="/nao.svg"
                alt="Nao"
                className="max-w-full max-h-full"
                style={{ width: "180%", height: "140%" }}
              />
              <div className="absolute inset-0 flex items-end mb-8 justify-center">
                <span
                  className="text-[100px] drop-shadow-lg"
                  style={{
                    fontFamily: "Mozaic GEO",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  {String(currentScore).padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full justify-center  content-center items-end flex h-full">
          <div className="bg-[url('/round.webp')]  scale-125 ml-14 w-56 h-44 md:w-80 md:h-30 bg-cover bg-no-repeat bg-center"></div>
          {currentRound === 1 && (
            <div className="w-40 h-36 md:w-56 md:h-52 scale-100 bg-cover bg-[url('/1.webp')] flex bg-no-repeat bg-fit rounded-lg ml-4"></div>
          )}
          {currentRound === 2 && (
            <div className="w-40 h-36 md:w-56 md:h-52 scale-100 bg-cover bg-[url('/2.webp')] flex bg-no-repeat bg-fit rounded-lg ml-4"></div>
          )}
          {currentRound === 3 && (
            <div className="w-40 h-40 md:w-56 md:h-52 scale-100 bg-cover bg-[url('/3.webp')] flex bg-no-repeat bg-fit rounded-lg ml-4"></div>
          )}
          {currentRound === 4 && (
            <div className="w-40 h-40 md:w-34 md:h-48 scale-100 bg-cover bg-[url('/4.webp')] flex bg-no-repeat bg-center ml-14 mr-10"></div>
          )}
        </div>
        <img
          src="/watermark.svg"
          alt="Watermark"
          className="fixed right-4 bottom-4 w-72 h-auto z-50 pointer-events-none select-none"
          style={{ position: "fixed" }}
        />
      </div>
    </div>
  );
}
