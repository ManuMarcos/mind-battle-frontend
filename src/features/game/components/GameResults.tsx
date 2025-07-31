import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Home, Medal, RotateCcw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data - esto vendría de la base de datos
const mockResults = [
  { id: 1, username: "Juan123", score: 85, correctAnswers: 17, totalQuestions: 20 },
  { id: 2, username: "Maria_Gamer", score: 75, correctAnswers: 15, totalQuestions: 20 },
  { id: 3, username: "Carlos_Pro", score: 70, correctAnswers: 14, totalQuestions: 20 },
  { id: 4, username: "Ana_Quiz", score: 60, correctAnswers: 12, totalQuestions: 20 },
  { id: 5, username: "Luis_Smart", score: 45, correctAnswers: 9, totalQuestions: 20 },
];


export const GameResults = () => {
  const navigate = useNavigate();

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="font-bold text-lg">{position}</span>;
    }
  };

  const getRankBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
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
            {mockResults.map((player, index) => (
              <div
                key={player.id}
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
            onClick={() => navigate("/create-room")}
            className="flex items-center gap-2"
            size="lg"
          >
            <RotateCcw className="h-5 w-5" />
            Nueva Partida
          </Button>
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