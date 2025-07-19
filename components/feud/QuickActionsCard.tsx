import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Rocket, Monitor, Play } from "lucide-react"

interface QuickActionsCardProps {
  currentGameState: string
  gameStateRoutes: Record<string, string>
  changeGameState: (state: string) => void
  onRoundStart?: () => void
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  currentGameState,
  gameStateRoutes,
  changeGameState,
  onRoundStart,
}) => (
  <Card className="col-span-6 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Rocket className="w-5 h-5" />
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <a href={gameStateRoutes[currentGameState]} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Monitor className="w-4 h-4 mr-2" />
            Open Current State
          </Button>
        </a>
        <Button
          onClick={() => changeGameState("tournament-start")}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Tournament
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => changeGameState("team-vs")}
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-gray-800 text-white bg-slate-600"
        >
          Team VS
        </Button>
        <Button
          onClick={() => changeGameState("round-start")}
          variant="outline"
          size="sm"
          className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
        >
          Round Start
        </Button>
        <Button
          onClick={() => {
            if (onRoundStart) onRoundStart()
          }}
          variant="outline"
          size="sm"
          className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
        >
          Go to Game Play
        </Button>
      </div>
    </CardContent>
  </Card>
)

export default QuickActionsCard 