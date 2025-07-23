"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import CountUpAnimation from "@/components/CountUpAnimation";
import { motion, AnimatePresence } from "framer-motion";

interface TeamConfig {
  name: string
  color1: string
  color2: string
  icon: string
  logo?: string
  motto?: string
}

interface Question {
  question: string
  answers: { text: string; points: number }[]
}

interface GameData {
  currentRound: 1 | 2 | 3 | 4 | "tiebreaker"
  team1Config: TeamConfig
  team2Config: TeamConfig
  team1Score: number
  team2Score: number
  strikes: number
  showStrikeOverlay: boolean
  currentQuestion: Question | null
  revealedAnswers: boolean[]
  roundScore?: number
  currentTeam?: 'team1' | 'team2'
}

// Sound effect for count-up animation
const playCountUpSound = () => {
  console.log("Attempting to play sound...");
  const audio = new Audio('/sounds/tally-sound.mp3');
  audio.loop = true;
  audio.volume = 0.5;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      console.log("Audio playback started successfully.");
    }).catch(error => {
      console.error("Audio playback failed:", error);
      // Autoplay was prevented. We can't do much here without user interaction.
    });
  }
  return audio;
};

export default function RoundEndRevealPage() {
  const router = useRouter();
  const [roundWinner, setRoundWinner] = useState("");
  const [calculatedRoundPoints, setCalculatedRoundPoints] = useState(0);
  const prevScoresRef = useRef<{ team1: number; team2: number } | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [animatingScore, setAnimatingScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [team1Colors1, setTeam1Colors1] = useState('')
  const [team1Colors2, setTeam1Colors2] = useState('')
  const [team2Colors1, setTeam2Colors1] = useState('')
  const [team2Colors2, setTeam2Colors2] = useState('')
  const soundPlayedRef = useRef(false); // Ref to track if sound has been played

      // Memoize callbacks to prevent re-triggering the animation
  const handleAnimationComplete = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAnimating(false); // Resume polling
  }, []);

  const formatScore = useCallback((value: number) => String(Math.round(value)).padStart(3, "0"), []);

  // Listen for game state changes and navigate instantly
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
      const targetPath = gameStateRoutes[gameState as keyof typeof gameStateRoutes] || "/states/idle";
      if (window.location.pathname !== targetPath) {
        router.replace(targetPath);
      }
    };
    return () => channel.close();
  }, [router]);

    // Play sound and set animation flag
  useEffect(() => {
    if (showScoreAnimation && roundWinner && calculatedRoundPoints > 0 && !soundPlayedRef.current) {
      setIsAnimating(true); // Pause polling and start animation
      audioRef.current = playCountUpSound();
      soundPlayedRef.current = true; // Mark sound as played
    }
  }, [showScoreAnimation, roundWinner, calculatedRoundPoints]);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

      const updateRoundAndPoints = useCallback(() => {
    const gameStateRaw = localStorage.getItem("familyFeudGameState");
    let gameState: any = {};
    if (gameStateRaw) {
      try {
        gameState = JSON.parse(gameStateRaw);
        setGameData(gameState);
      } catch (e) {
        gameState = {};
      }
    }
    setCurrentRound(Number(gameState.currentRound) || 1);
    const newTeam1Score = Number(gameState.team1Score) || 0;
    const newTeam2Score = Number(gameState.team2Score) || 0;
    const team1Colors1 = gameState.team1Config?.color1 || '';
    const team1Colors2 = gameState.team1Config?.color2 || '';
    const team2Colors1 = gameState.team2Config?.color1 || '';
    const team2Colors2 = gameState.team2Config?.color2 || '';
    setTeam1Colors1(team1Colors1);
    setTeam1Colors2(team1Colors2);
    setTeam2Colors1(team2Colors1);
    setTeam2Colors2(team2Colors2);

    if (prevScoresRef.current === null) {
      prevScoresRef.current = { team1: newTeam1Score, team2: newTeam2Score };
    } else {
      const winner = localStorage.getItem("currentTeam") || "";
      let points = 0;
      if (winner === 'team1') {
        points = newTeam1Score - prevScoresRef.current.team1;
      } else if (winner === 'team2') {
        points = newTeam2Score - prevScoresRef.current.team2;
      }
      if (points > 0) {
        setCalculatedRoundPoints(points);
      }
      prevScoresRef.current = { team1: newTeam1Score, team2: newTeam2Score };
    }

    setRoundWinner(localStorage.getItem("currentTeam") || "");
    setTeam1Score(newTeam1Score);
    setTeam2Score(newTeam2Score);
  }, []);

  // Effect for initial data load and storage event listener
  useEffect(() => {
    updateRoundAndPoints();
    setShowScoreAnimation(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "familyFeudGameState" || e.key === "currentTeam") {
        updateRoundAndPoints();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, [updateRoundAndPoints]);

  // Effect to manage the polling interval
  useEffect(() => {
    if (!isAnimating) {
      // Start polling if not animating
      intervalRef.current = setInterval(updateRoundAndPoints, 200);
    } else {
      // Stop polling if animating
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnimating, updateRoundAndPoints]);

  const handleNextRound = () => {
    setHasAnimated(false);
    localStorage.setItem("showRoundSummary", "false");
    router.push("/states/game-play");
  };

  
  return (
    // Main page container
    <div className="min-h-screen flex  items-center justify-center bg-cover bg-[url('/secondary-bg.webp')]">
     
      {/* Main content grid */}
      <div className="w-screen h-screen  grid grid-rows-[2fr_1fr]">
        {/* Top row: Two SVG containers with animated score */}
        <div className="w-full h-full flex mx-auto  flex-row items-center align-middle justify-center   relative">
          {/* Nao SVG + Score Container */}
          <motion.div
            className="w-[42rem] relative h-[35rem] flex flex-col justify-end"
            initial={{ scale: 0.9 }}
            animate={{
              scale: roundWinner === "team1" ? 1.3 : 0.9,
              filter: roundWinner === "team1" ? `drop-shadow(0 0 20px #${team1Colors1})` : 'none',
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.5
            }}
          >
            {/* Nao SVG Wrapper */}
            <div className="relative  flex justify-center flex-col align-middle items-center scale-150">
              {/* <img src="/nao.svg" alt="Nao" className="h-full w-full" /> */}
              {gameData?.team1Config?.logo && (
                <img
                  src={gameData.team1Config.logo}
                  className="w-80 h-80 ml-6 object-contain absolute bottom-10"
                />
              )}
              <div
                style={{
                  
                  minWidth: 120,
                  minHeight: 80,
                  borderRadius: 40,
                  background: `linear-gradient(292deg, #${team1Colors1} 36.24%, #${team1Colors2} 80.85%, #${team1Colors2} 103.71%)`,
                  color: '#000',
                  fontFamily: 'Mozaic GEO, sans-serif',
                  fontWeight: 900,
                  fontSize: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: ' 0px 5.666px 15.299px 0px rgba(0, 0, 0, 0.49) inset',
                  marginLeft: 24,
                }}
              > 
                <div className="m-6 flex justify-center align-middle items-center" 
                  style={{
                    boxShadow: ' 0px 5.666px 15.299px 0px rgba(0, 0, 0, 0.49) inset',
                    borderRadius: 20,
                  }}>
                <span
                  className={`text-4xl md:text-8xl mt-4 mx-6 font-extrabold self-center text-white pb-6 scale-95 transition-all ease-in-out justify-center w-full h-full text-[100px] drop-shadow-2xl text-shadow-lg ${
                    roundWinner === "team1" ? "scale-110" : "scale-95"
                  }`}
                  style={{
                    fontFamily: "Mozaic GEO",
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                    {showScoreAnimation && roundWinner === "team1" && calculatedRoundPoints > 0 ? (
                      <CountUpAnimation
                        end={team1Score}
                        start={team1Score - calculatedRoundPoints}
                        duration={3000}
                        className="text-white"
                        onComplete={handleAnimationComplete}
                        formatter={formatScore}
                      />
                    ) : (
                      String(roundWinner === 'team1' && showScoreAnimation ? team1Score : (prevScoresRef.current?.team1 ?? team1Score)).padStart(3, "0")
                    )}
                </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Siteao SVG + Score Container */}
          <motion.div
            className="w-[42rem] relative h-[35rem] flex flex-col justify-end"
            initial={{ scale: 0.9 }}
            animate={{
              scale: roundWinner === "team2" ? 1.3 : 0.9,
              filter: roundWinner === "team2" ? `drop-shadow(0 0 20px #${team2Colors1})` : 'none',
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.5
            }}
          >
            {/* Team 2 Wrapper (mirrors Team 1 style) */}
            <div className="relative  flex justify-center flex-col align-middle items-center scale-150">
              {/* Team 2 Logo */}
              {gameData?.team2Config?.logo && (
                <img
                  src={gameData.team2Config.logo}
                  className="w-80 h-80 ml-6 object-contain absolute bottom-10"
                />
              )}
              {/* Gradient Score Container */}
              <div
                style={{
                  minWidth: 120,
                  minHeight: 80,
                  borderRadius: 40,
                  background: `linear-gradient(292deg, #${team2Colors1} 36.24%, #${team2Colors2} 80.85%, #${team2Colors2} 103.71%)`,
                  color: '#000',
                  fontFamily: 'Mozaic GEO, sans-serif',
                  fontWeight: 900,
                  fontSize: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: ' 0px 5.666px 15.299px 0px rgba(0, 0, 0, 0.49) inset',
                  marginLeft: 24,
                }}
              >
                <div
                  className="m-6 flex justify-center align-middle items-center"
                  style={{
                    boxShadow: ' 0px 5.666px 15.299px 0px rgba(0, 0, 0, 0.49) inset',
                    borderRadius: 20,
                  }}
                >
                  <span
                    className={`text-4xl md:text-8xl mt-4 mx-6 font-extrabold self-center text-white pb-6 scale-95 transition-all ease-in-out justify-center w-full h-full text-[100px] drop-shadow-2xl text-shadow-lg ${roundWinner === "team2" ? "scale-110" : "scale-95"}`}
                    style={{
                      fontFamily: 'Mozaic GEO',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}
                  >
                    {showScoreAnimation && roundWinner === 'team2' && calculatedRoundPoints > 0 ? (
                      <CountUpAnimation
                        end={team2Score}
                        start={team2Score - calculatedRoundPoints}
                        duration={3000}
                        className="text-white"
                        onComplete={handleAnimationComplete}
                        formatter={formatScore}
                      />
                    ) : (
                      String(
                        roundWinner === 'team2' && showScoreAnimation
                          ? team2Score
                          : prevScoresRef.current?.team2 ?? team2Score,
                      ).padStart(3, '0')
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
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
