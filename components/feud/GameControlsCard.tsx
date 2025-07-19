import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Pause, Play, RotateCcw, X } from "lucide-react"
import CountUpAnimation from "@/components/CountUpAnimation"

interface GameControlsCardProps {
  timerRunning: boolean
  setTimerRunning: (running: boolean) => void
  gameTimer: number
  setGameTimer: (time: number) => void
  formatTime: (seconds: number) => string
  currentGameState: string
  changeGameState: (state: string) => void
  gameStateNames: Record<string, string>
  currentRound: 1 | 2 | 3 | 4 | "tiebreaker"
  nextRound: () => void
  strikes: number
  setStrikes: (fn: (prev: number) => number) => void
  awardPoints: () => void
  roundScore: number
  showScoreAnimation: boolean
  animatingScore: number
  team1Score: number
  team2Score?: number
  currentTeam?: 'team1' | 'team2'
}

const GameControlsCard: React.FC<GameControlsCardProps> = ({
  timerRunning,
  setTimerRunning,
  gameTimer,
  setGameTimer,
  formatTime,
  currentGameState,
  changeGameState,
  gameStateNames,
  currentRound,
  nextRound,
  strikes,
  setStrikes,
  awardPoints,
  roundScore,
  showScoreAnimation,
  animatingScore,
  team1Score,
  team2Score,
  currentTeam = 'team1',
}) => {
  const overallScore = currentTeam === 'team1' ? team1Score : (team2Score ?? 0)
  return (
    <Card className="col-span-4 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <span className="inline-block"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.25L6 21m0 0l-3.75-3.75M6 21V3m12 0l3.75 3.75M18 3l-3.75 3.75M18 3v18" /></svg></span>
          Game Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Round Pool Score */}
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <div className="text-gray-300 text-sm mb-1">Round Pool</div>
          <div className="text-4xl md:text-6xl font-extrabold text-blue-300">
            {showScoreAnimation ? (
              <CountUpAnimation
                end={roundScore + animatingScore}
                start={roundScore}
                duration={2000}
                className="text-blue-300"
              />
            ) : (
              roundScore
            )}
          </div>
          <div className="text-xs text-gray-400 mt-2">Current Team: {currentTeam === 'team1' ? 'Team 1' : 'Team 2'}</div>
          <div className="text-yellow-300 text-lg font-bold mt-2">Overall: {overallScore}</div>
        </div>
        {/* Timer */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm">Game Timer</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTimerRunning(!timerRunning)}
                className="text-gray-400 hover:text-white"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setGameTimer(0)
                  setTimerRunning(false)
                }}
                className="text-gray-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="text-2xl font-mono text-white text-center">{formatTime(gameTimer)}</div>
        </div>
        {/* Game State Control */}
        <div>
          <Label className="text-gray-300 text-sm">Game State</Label>
          <Select value={currentGameState} onValueChange={(value) => changeGameState(value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {Object.entries(gameStateNames).map(([key, name]) => (
                <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Round Control */}
        <div>
          <Label className="text-gray-300 text-sm">Current Round</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              Round {currentRound}
            </Badge>
            <Button
              size="sm"
              onClick={nextRound}
              disabled={currentRound === "tiebreaker"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next Round
            </Button>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setStrikes((prev) => Math.min(3, prev + 1))} variant="destructive" size="sm">
            <X className="w-4 h-4 mr-1" />
            Strike ({strikes}/3)
          </Button>
          <Button onClick={awardPoints} className="bg-green-600 hover:bg-green-700" size="sm">
            Award Points
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default GameControlsCard 