import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, PaletteIcon, FileText, Plus, CheckCircle } from "lucide-react"

interface TournamentManagementCardProps {
  currentTournament: any
  currentMatch: any
  setShowTournamentDialog: (open: boolean) => void
  setShowTeamCustomization: (open: boolean) => void
  setShowMatchQuestions: (open: boolean) => void
  setCurrentMatch: (match: any) => void
  onCompleteMatch: (matchId: string) => void
}

const TournamentManagementCard: React.FC<TournamentManagementCardProps> = ({
  currentTournament,
  currentMatch,
  setShowTournamentDialog,
  setShowTeamCustomization,
  setShowMatchQuestions,
  setCurrentMatch,
  onCompleteMatch,
}) => (
  <Card className="col-span-6 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Tournament Management
        </div>
        <Button
          onClick={() => setShowTournamentDialog(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Tournament
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {currentTournament ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{currentTournament.name}</h3>
            <p className="text-gray-400 text-sm">
              {currentTournament.teams.length} teams • {currentTournament.matches.length} matches
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowTeamCustomization(true)}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
            >
              <PaletteIcon className="w-4 h-4 mr-2" />
              Customize Teams
            </Button>
            <Button
              onClick={() => setShowMatchQuestions(true)}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 bg-slate-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Match Questions
            </Button>
          </div>

          {/* All Matches List */}
          <div className="mt-4">
            <h4 className="text-white font-medium mb-2">Matches</h4>
            <div className="space-y-2">
              {currentTournament.matches.map((match: any, idx: number) => (
                <div
                  key={match.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${currentMatch?.id === match.id ? 'bg-blue-800/60' : 'bg-gray-800/60 hover:bg-gray-700'}`}
                  onClick={() => setCurrentMatch(match)}
                >
                  <div>
                    <span className="font-bold text-white">Match {idx + 1}:</span> <span className="text-gray-200">{match.team1Id} vs {match.team2Id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={match.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}>{match.status}</Badge>
                    {match.status !== 'completed' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={e => { e.stopPropagation(); onCompleteMatch(match.id); }}>
                        <CheckCircle className="w-4 h-4 mr-1" /> Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Match Info */}
          {currentMatch && (
            <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
              <h4 className="text-white font-medium mb-2">Current Match</h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  {currentMatch.team1Id} vs {currentMatch.team2Id}
                </span>
                <Badge className="bg-blue-600 text-white">{currentMatch.status}</Badge>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No active tournament</p>
          <Button onClick={() => setShowTournamentDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            Create Tournament
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
)

export default TournamentManagementCard 