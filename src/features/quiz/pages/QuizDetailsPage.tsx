import api from "@/api/axios";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Quiz } from "@/types/quiz";
import { AxiosError } from "axios";
import { ArrowLeft, Clock, Hash, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const QuizDetailsPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Quiz>(`/quizzes/${id}`)
      .then(({ data }) => {
        setQuiz(data);
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error(
            "Respuesta del servidor con error",
            error.response.data
          );
        } else if (error.request) {
          console.error("No hubo respuesta del servidor", error.request);
        } else {
          console.error("Ocurrio un error inesperado", error);
        }
      });
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Vista Previa del Quiz"
        handleBack={() => navigate(-1)}
      />
      <div className="max-w-4xl mx-auto">
        {quiz && (
          <div>
            <Card className="mb-6 bg-white/95 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {quiz.title}
                    </CardTitle>
                    <p className="text-muted-foreground mb-4">
                      {quiz.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">
                        <Hash className="h-3 w-3 mr-1" />
                        {quiz.questions.length} preguntas
                      </Badge>
                      <Badge>
                        <Clock className="h-3 w-3 mr-1" />~{} min
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      navigate("/create-game", {
                        state: { selectedQuiz: quiz },
                      })
                    }
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Crear Sala con este Quiz
                  </Button>
                </div>
              </CardHeader>
            </Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Todas las Preguntas ({quiz.questions.length})
              </h2>
              {quiz.questions.map((question, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">
                      Pregunta {index + 1}: {question.text}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border-2 ${
                            option.correct
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <span className="font-medium">
                            {String.fromCharCode(65 + optionIndex)}.{" "}
                            {option.text}
                          </span>
                          {option.correct && (
                            <Badge className="ml-2 bg-green-500">
                              Correcta
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
