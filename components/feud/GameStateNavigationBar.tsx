import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, Circle, ChevronRight, ExternalLink } from "lucide-react"

interface GameStateNavigationBarProps {
  currentGameState: string
  gameStateNames: Record<string, string>
  gameStateRoutes: Record<string, string>
  changeGameState: (state: string) => void
}

const GameStateNavigationBar: React.FC<GameStateNavigationBarProps> = ({
  currentGameState,
  gameStateNames,
  gameStateRoutes,
  changeGameState,
}) => (
  <Card className="bg-gray-900/90 border-gray-800 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Game State Navigation
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            Current: {gameStateNames[currentGameState]}
          </Badge>
          <a href={gameStateRoutes[currentGameState]} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Page
            </Button>
          </a>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {Object.entries(gameStateNames).map(([state, name], index) => (
          <div key={state} className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                currentGameState === state
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => changeGameState(state)}
            >
              {currentGameState === state ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="text-sm font-medium">{name}</span>
              <a
                href={gameStateRoutes[state]}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 opacity-60 hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {index < Object.keys(gameStateNames).length - 1 && <ChevronRight className="w-4 h-4 text-gray-600" />}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export default GameStateNavigationBar 