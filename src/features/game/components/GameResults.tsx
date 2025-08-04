import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlayerResult } from "@/types";
import { Award, Home, Medal, RotateCcw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockResults = [
  { username: "Juan123", score: 85, correctAnswers: 17, totalQuestions: 20 },
  { username: "Maria_Gamer", score: 75, correctAnswers: 15, totalQuestions: 20 },
  { username: "Carlos_Pro", score: 70, correctAnswers: 14, totalQuestions: 20 },
  { username: "Ana_Quiz", score: 60, correctAnswers: 12, totalQuestions: 20 },
  { username: "Luis_Smart", score: 45, correctAnswers: 9, totalQuestions: 20 },
];

type GameResultsProps = {
    gameResults : PlayerResult[] 
}

export const GameResults = ({gameResults} : GameResultsProps) => {
  const navigate = useNavigate();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-white"  />;
      default:
        return <span className="font-bold text-lg">{position}</span>;
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-200 to-yellow-300 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-200 to-gray-300 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-500/50 to-amber-600 border-amber-200";
      default:
        return "bg-card";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">🎉 Resultados Finales</h1>
          <p className="text-muted-foreground">¡Excelente juego! Aquí están los resultados:</p>
        </div>

        {/* Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Tabla de Posiciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gameResults.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${getRankBg(index + 1)}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{player.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.correctAnswers}/{player.totalQuestions} correctas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{player.score}</p>
                  <p className="text-sm text-muted-foreground">puntos</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            size="lg"
          >
            <Home className="h-5 w-5" />
            Ir al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};