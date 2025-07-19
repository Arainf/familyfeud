import { useState, useEffect } from "react"

export const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; text: string; glow: string; shadow: string } } = {
    red: {
      bg: "bg-red-600",
      text: "text-red-600",
      glow: "shadow-red-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]",
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-600",
      glow: "shadow-blue-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    },
    green: {
      bg: "bg-green-600",
      text: "text-green-600",
      glow: "shadow-green-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]",
    },
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-600",
      glow: "shadow-purple-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]",
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-600",
      glow: "shadow-orange-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]",
    },
    pink: {
      bg: "bg-pink-600",
      text: "text-pink-600",
      glow: "shadow-pink-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    },
    cyan: {
      bg: "bg-cyan-600",
      text: "text-cyan-600",
      glow: "shadow-cyan-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(8,145,178,0.5)]",
    },
    yellow: {
      bg: "bg-yellow-600",
      text: "text-yellow-600",
      glow: "shadow-yellow-500/50",
      shadow: "drop-shadow-[0_0_15px_rgba(202,138,4,0.5)]",
    },
  }
  return colorMap[color] || colorMap.blue
}

export const getTeamIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    crown: "👑",
    star: "⭐",
    heart: "❤️",
    zap: "⚡",
    shield: "🛡️",
    trophy: "🏆",
    target: "🎯",
    flame: "🔥",
    gamepad: "🎮",
  }
  return iconMap[iconName] || "👑"
}

export const roundNames = {
  1: "Round 1",
  2: "Round 2 - Double Points",
  3: "Round 3 - Triple Points",
  4: "Round 4 - Triple Points",
  tiebreaker: "Tie Breaker",
}

export const getPointMultiplier = (round: number | "tiebreaker"): number => {
  switch (round) {
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 3
    case "tiebreaker":
      return 1
    default:
      return 1
  }
}

export const useGameData = () => {
  const [gameData, setGameData] = useState<any>(null)

  useEffect(() => {
    const loadGameState = () => {
      const saved = localStorage.getItem("familyFeudGameState")
      if (saved) {
        try {
          const parsedData = JSON.parse(saved)
          setGameData(parsedData)
        } catch (error) {
          console.error("Error parsing game state:", error)
        }
      }
    }

    loadGameState()
    const interval = setInterval(loadGameState, 100)
    return () => clearInterval(interval)
  }, [])

  return gameData
} 