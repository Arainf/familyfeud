"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountUpAnimation from "@/components/CountUpAnimation";

export default function RoundEndRevealPage() {
  const router = useRouter();
  const [roundWinner, setRoundWinner] = useState("");
  const [roundPoints, setRoundPoints] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [animatingScore, setAnimatingScore] = useState(0);

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
      setRoundWinner(localStorage.getItem("currentTeam")|| "");
      setRoundPoints(Number(localStorage.getItem("roundPoints") || 0));
      setTeam1Score(Number(gameState.team1Score) || 0);
      setTeam2Score(Number(gameState.team2Score) || 0);
    };
    updateRoundAndPoints();

    // Listen for changes in localStorage (from other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "familyFeudGameState" ||
        e.key === "roundWinner" ||
        e.key === "roundPoints" ||
        e.key === "currentTeam"
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
    // Main page container
    <div className="min-h-screen flex  items-center justify-center bg-cover bg-[url('/secondary-bg.webp')]">
     
      {/* Main content grid */}
      <div className="w-screen h-screen   grid grid-rows-[2fr_1fr]">
        {/* Top row: Two SVG containers with animated score */}
        <div className="w-full h-full flex   items-center justify-center gap-x-18 relative">
          {/* Nao SVG + Score Container */}
          <div
            className={`w-[42rem] relative h-[35rem] flex flex-col  transition-all ease-in-out items-end justify-center ${
              roundWinner === "team1" ? "scale-125" : "scale-95"
            }`}
          >
            {/* Nao SVG Wrapper */}
            <div className="relative  flex items-end align-middle justify-center">
              <img src="/nao.svg" alt="Nao" className="h-full w-full" />
              <span
                className={`absolute inset-0 flex items-end pb-6 scale-95 transition-all ease-in-out justify-center w-full h-full text-[100px] drop-shadow-2xl text-shadow-lg ${
                  roundWinner === "team1" ? "scale-110" : "scale-95"
                }`}
                style={{
                  fontFamily: "Mozaic GEO",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                  {showScoreAnimation ? (
                    <CountUpAnimation
                      end={team1Score + (roundWinner === "team1" ? roundPoints : 0)}
                      start={team1Score}
                      duration={2000}
                      className="text-green-400"
                    />
                  ) : (
                    String(team1Score).padStart(3, "0")
                  )}
              </span>
            </div>
          </div>
          {/* Siteao SVG + Score Container */}
          <div
            className={`w-[40rem] flex flex-col items-center  transition-all ease-in-out justify-center ${
              roundWinner === "team2" ? "scale-125" : "scale-95"
            }`}
          >
            {/* Siteao SVG Wrapper */}
            <div className="relative flex  items-end align-middle justify-center">
              <img src="/siteao.svg" alt="Siteao" className="h-auto w-full" />
              <span
                className={`absolute inset-0 flex items-end pb-8  scale-95 transition-all ease-in-out justify-center w-full h-full text-[100px] drop-shadow-2xl  text-shadow-lg ${
                  roundWinner === "team2" ? "scale-110" : "scale-95"
                }`}
                style={{
                  fontFamily: "Mozaic GEO",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {String(team2Score).padStart(3, "0")}
              </span>
            </div>
          </div>
        </div>
        {/* Bottom row: Round images */}
        <div className="w-full justify-center content-center items-center flex h-full">
          {/* Round Image */}
          <div className="bg-[url('/round.webp')] scale-125 ml-14 w-56 h-44 md:w-80 md:h-30 bg-cover bg-no-repeat bg-center" />
          {/* Round 1 Image */}
          {currentRound === 1 && (
            <div className="w-40 h-36 md:w-56 md:h-52 scale-100 bg-cover bg-[url('/1.webp')] flex bg-no-repeat bg-fit rounded-lg ml-4" />
          )}
          {/* Round 2 Image */}
          {currentRound === 2 && (
            <div className="w-40 h-36 md:w-56 md:h-52 scale-100 bg-cover bg-[url('/2.webp')] flex bg-no-repeat bg-fit rounded-lg ml-4" />
          )}
          {/* Round 3 Image */}
          {currentRound === 3 && (
            <div className="w-40 h-40 md:w-56 md:h-52 scale-100 bg-cover bg-[url('/3.webp')] flex bg-no-repeat bg-fit rounded-lg ml-4" />
          )}
          {/* Round 4 Image */}
          {currentRound === 4 && (
            <div className="w-40 h-40 md:w-34 md:h-48 scale-100 bg-cover bg-[url('/4.webp')] flex bg-no-repeat bg-center ml-14 mr-10" />
          )}
        </div>
        {/* Watermark */}
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
