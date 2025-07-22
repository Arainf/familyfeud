import React, { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Answer {
  text: string
  points: number
}

interface QuestionCardProps {
  question: string
  answers: Answer[]
  revealedAnswers: boolean[]
  onReveal: (answerIndex: number) => void
  onAwardPoints: (answerIndex: number) => void
  currentTeam: string
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  revealedAnswers,
  onReveal,
  onAwardPoints,
  currentTeam,
}) => {
  const [showAll, setShowAll] = useState(false);
  const revealSound = useRef(typeof Audio !== 'undefined' ? new Audio('/sounds/reveal.mp3') : null);

  const playSound = () => {
    if (revealSound.current) {
      revealSound.current.currentTime = 0; // Reset the sound to start
      revealSound.current.play();
    }
  };

  return (
    <Card className="col-span-4 bg-gray-900/90 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Current Question
        </CardTitle>
        <div className="text-gray-300 mt-2">{question}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
        {answers.map((answer, idx) => {
          const isRevealed = revealedAnswers[idx];
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded transition-colors ${
                isRevealed ? "bg-green-700 text-white" : "bg-gray-800 text-gray-300"
              }`}
            >
              <div className="flex-1">
                <span className="font-bold">{answer.text}</span>
                <Badge className="ml-2 bg-blue-600">{answer.points} pts</Badge>
              </div>
              {!isRevealed && (
                <>
                  <Button
                    onClick={() => {
                      playSound();
                      onReveal(idx);
                      onAwardPoints(idx);
                    }}
                    size="sm"
                    className="bg-blue-600 ml-2"
                  >
                    Reveal & Score
                  </Button>
                  <Button
                    onClick={() => {
                      playSound();
                      onReveal(idx);
                    }}
                    size="sm"
                    className="bg-gray-600 ml-2"
                  >
                    Reveal Only
                  </Button>
                </>
              )}
            </div>
          );
        })}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionCard 