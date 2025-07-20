import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import CountUpAnimation from "@/components/CountUpAnimation"
import { Button } from "@/components/ui/button"

interface Team {
  name: string
}

interface TeamScoresCardProps {
  team1Name: string
  team2Name: string
  team1Score: number // overall score
  team2Score: number // overall score
  showScoreAnimation: boolean
  animatingScore: number
  roundScore: number // current round pool
  currentTeam: 'team1' | 'team2'
  onPlay?: () => void
  onPass?: () => void
  showPlayPass?: boolean
  onSwitchTeam?: () => void
  onActivatePassOrPlay?: () => void
}

const TeamScoresCard: React.FC<TeamScoresCardProps> = ({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  showScoreAnimation,
  animatingScore,
  roundScore,
  currentTeam,
  onPlay,
  onPass,
  showPlayPass,
  onSwitchTeam,
  onActivatePassOrPlay,
}) => {
  const [showStealOverlay, setShowStealOverlay] = useState(false);

  const handleActivate = () => {
    if (onActivatePassOrPlay) onActivatePassOrPlay()
    if (onSwitchTeam) onSwitchTeam()
  }

  // Fade out the STEAL overlay after 1.5s
  React.useEffect(() => {
    if (showStealOverlay) {
      const timeout = setTimeout(() => setShowStealOverlay(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [showStealOverlay]);

  return (
    <Card className="col-span-4 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
      {/* STEAL Overlay */}
      {showStealOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-out">
          <h1 className="text-8xl font-extrabold text-yellow-400 drop-shadow-2xl animate-pulse">STEAL</h1>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-2 gap-2">
          <Button size="sm" variant="outline" className="border-blue-600 text-blue-400" onClick={onSwitchTeam}>
            Switch Team
          </Button>
          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600" onClick={handleActivate}>
            Activate Pass or Play
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Team 1 */}
          <div className={`bg-gray-800/50 rounded-lg p-4 ${currentTeam === 'team1' ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="text-center">
              <div className="text-white font-medium mb-2">{team1Name}</div>
              <div className="text-3xl font-bold text-white">
                {showScoreAnimation ? (
                  <CountUpAnimation
                    end={team1Score + animatingScore}
                    start={team1Score}
                    duration={2000}
                    className="text-green-400"
                  />
                ) : (
                  team1Score
                )}
              </div>
              <div className="text-sm text-gray-400 mt-1">Overall Score</div>
              <div className="text-xl font-bold text-yellow-400 mt-2">+{currentTeam === 'team1' ? roundScore : 0}</div>
              <div className="text-xs text-gray-400">Current Round</div>
              {showPlayPass && currentTeam === 'team1' && (
                <>
                  <div className="mt-3 text-xl font-bold text-yellow-400 animate-pulse">PASS OR PLAY</div>
                  <div className="mt-2 flex gap-2 justify-center">
                    <Button onClick={onPlay} className="bg-green-600 hover:bg-green-700">Play</Button>
                    <Button onClick={onPass} className="bg-yellow-500 hover:bg-yellow-600">Pass</Button>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Team 2 */}
          <div className={`bg-gray-800/50 rounded-lg p-4 ${currentTeam === 'team2' ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="text-center">
              <div className="text-white font-medium mb-2">{team2Name}</div>
              <div className="text-3xl font-bold text-white">{team2Score}</div>
              <div className="text-sm text-gray-400 mt-1">Overall Score</div>
              <div className="text-xl font-bold text-yellow-400 mt-2">+{currentTeam === 'team2' ? roundScore : 0}</div>
              <div className="text-xs text-gray-400">Current Round</div>
              {showPlayPass && currentTeam === 'team2' && (
                <>
                  <div className="mt-3 text-xl font-bold text-yellow-400 animate-pulse">PASS OR PLAY</div>
                  <div className="mt-2 flex gap-2 justify-center">
                    <Button onClick={onPlay} className="bg-green-600 hover:bg-green-700">Play</Button>
                    <Button onClick={onPass} className="bg-yellow-500 hover:bg-yellow-600">Pass</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Round Score */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1">Round Score</div>
            <div className="text-white font-medium">{roundScore}</div>
          </div>
        </div>
        {/* Steal Button */}
        <div className="mt-4 flex justify-center">
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              localStorage.setItem('showStealVisualOverlay', 'true');
            }}
          >
            Steal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamScoresCard 