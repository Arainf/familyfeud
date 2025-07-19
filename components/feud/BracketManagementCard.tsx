import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface BracketManagementCardProps {
  currentTournament: any
  currentMatch: any
}

const BracketManagementCard: React.FC<BracketManagementCardProps> = ({ currentTournament, currentMatch }) => (
  <Card className="col-span-6 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Bracket Management
      </CardTitle>
    </CardHeader>
    <CardContent>
      {currentTournament ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Bracket</h3>
          <div className="space-y-2">
            {currentTournament.matches.map((match: any, idx: number) => (
              <div
                key={match.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${currentMatch?.id === match.id ? 'bg-blue-800/60' : 'bg-gray-800/60'}`}
              >
                <div>
                  <span className="font-bold text-white">Match {idx + 1}:</span> <span className="text-gray-200">{match.team1Id} vs {match.team2Id}</span>
                </div>
                <Badge className={match.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}>{match.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No active tournament</p>
        </div>
      )}
    </CardContent>
  </Card>
)

export default BracketManagementCard 