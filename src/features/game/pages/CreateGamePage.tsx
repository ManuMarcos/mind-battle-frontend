import api from "@/api/axios";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import {
  type GameSession,
  type GameSessionRequest,
  type PaginatedResponse,
} from "@/types";
import type { Quiz } from "@/types/quiz";
import type { AxiosError } from "axios";
import { ArrowLeft, Clock, GamepadIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

type LocationState = {
  selectedQuiz?: Quiz;
};

export const CreateGamePage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const state = location.state as LocationState;
  const [gameRequest, setGameRequest] = useState<GameSessionRequest>({
    name: "",
    quizId: state.selectedQuiz?.id ?? "",
  });
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(
    state?.selectedQuiz ?? null
  );

  useEffect(() => {
    api
      .get<PaginatedResponse<Quiz>>("/quizzes")
      .then(({ data }) => setQuizzes(data.content))
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error(
            "Respuesta del servidor con error: ",
            error.response.data
          );
        } else if (error.request) {
          console.error("No hubo respuesta del servidor: ", error.request);
        } else {
          console.log("Error desconocido", error);
        }
      });
  }, []);

  const handleCreateRoom = () => {
    api
      .post<GameSession>("/sessions", gameRequest)
      .then((response) => {
        if (response.status === 201) {
          toast.success("Juego creado correctamente!");
          if (auth.isAuthenticated && auth.user) {
            const username = auth.user;
            api
              .post<GameSession>(`/sessions/${response.data.pin}/join`, {
                username: username,
              })
              .then((response) => {
                if (response.status === 200) {
                  sessionStorage.setItem("username", username);
                  sessionStorage.setItem("gameSessionId", response.data.id);
                  navigate(`/game`);
                }
              });
          }
        }
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error(
            "Respuesta del servidor con error: ",
            error.response.data
          );
        } else if (error.request) {
          console.error("No hubo respuesta del servidor: ", error.request);
        } else {
          console.log("Error desconocido", error);
        }
      });
  };

  const handleQuizSelect = (quizId: string) => {
    setGameRequest({ ...gameRequest, quizId: quizId });
    const quiz = quizzes?.find((q) => q.id === quizId);
    setSelectedQuiz(quiz ?? null);
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Crear Sala" handleBack={() => navigate(-1)} />

      <div className="flex justify-center">
        <Card className="w-full max-w-2xl bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GamepadIcon className="h-6 w-6" />
              Nueva Sala de Juego
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nombre de la sala */}
            <div className="space-y-2">
              <Label>Nombre de la Sala</Label>
              <Input
                value={gameRequest?.name}
                onChange={(e) =>
                  setGameRequest({ ...gameRequest, name: e.target.value })
                }
                placeholder="Ej: Sala de Historia - Secundaria"
                className="bg-background"
              />
            </div>

            {/* Selección de quiz */}
            <div className="space-y-2">
              {quizzes && (
                <>
                  <Label>Seleccionar Quiz</Label>
                  <Select
                    value={gameRequest.quizId}
                    onValueChange={(e) => handleQuizSelect(e)}
                  >
                    <SelectTrigger className="bg-background w-full">
                      <SelectValue placeholder="Selecciona un quiz existente" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizzes.map((quiz) => (
                        <SelectItem key={quiz.id} value={quiz.id}>
                          {quiz.title} ({quiz.questions.length} preguntas)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!quizzes && (
                    <p className="text-sm text-muted-foreground">
                      No hay quizzes disponibles.
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => navigate("/create-quiz")}
                      >
                        Crea uno aquí
                      </Button>
                    </p>
                  )}
                </>
              )}
            </div>
            {/* Vista previa del quiz seleccionado */}
            {selectedQuiz && (
              <Card className="bg-muted/50">
                <CardContent className="px-4">
                  <h4 className="font-semibold mb-2">Quiz Seleccionado</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Título:</strong> {selectedQuiz.title}
                    </p>
                    <p>
                      <strong>Preguntas:</strong>{" "}
                      {selectedQuiz.questions.length}
                    </p>
                    <p>
                      <strong>Duración estimada:</strong> {0} minutos
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleCreateRoom}
              className="w-full"
              disabled={!gameRequest.name.trim() || !selectedQuiz}
            >
              <GamepadIcon className="h-4 w-4 mr-2" />
              Crear Sala
            </Button>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </div>
  );
};
