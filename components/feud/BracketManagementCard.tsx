import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface BracketManagementCardProps {
  currentTournament: any
  currentMatch: any
}

const getNextMatchIndex = (matches: any[]) => matches.findIndex((m) => m.status !== 'completed');
const getRoundLabel = (idx: number, total: number, mode: string) => {
  if (mode === 'roundrobin') return `Match ${idx + 1}`;
  if (mode === 'single' || mode === 'double') {
    if (total <= 2) return 'Final';
    if (total <= 4) return idx < 2 ? 'Semifinal' : 'Final';
    if (total <= 8) return idx < 4 ? 'Quarterfinal' : idx < 6 ? 'Semifinal' : 'Final';
    // Add more as needed
  }
  return `Match ${idx + 1}`;
};

const BracketManagementCard: React.FC<BracketManagementCardProps> = ({ currentTournament, currentMatch }) => {
  if (!currentTournament) {
    return (
      <Card className="col-span-6 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Bracket Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No active tournament</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { matches, mode } = currentTournament;
  const nextMatchIdx = getNextMatchIndex(matches);

  return (
    <Card className="col-span-6 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Bracket Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Bracket</h3>
          {nextMatchIdx !== -1 && (
            <div className="mb-2 p-2 bg-blue-900/60 rounded text-blue-200 font-bold">
              Next Match: {matches[nextMatchIdx].team1Id} vs {matches[nextMatchIdx].team2Id} ({getRoundLabel(nextMatchIdx, matches.length, mode)})
            </div>
          )}
          <div className="space-y-2">
            {matches.map((match: any, idx: number) => (
              <div
                key={match.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${currentMatch?.id === match.id ? 'bg-blue-800/60' : 'bg-gray-800/60'}`}
              >
                <div>
                  <span className="font-bold text-white">{getRoundLabel(idx, matches.length, mode)}:</span> <span className="text-gray-200">{match.team1Id} vs {match.team2Id}</span>
                </div>
                <Badge className={match.status === 'completed' ? 'bg-green-600' : nextMatchIdx === idx ? 'bg-yellow-500 text-black' : 'bg-blue-600'}>{match.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BracketManagementCard 