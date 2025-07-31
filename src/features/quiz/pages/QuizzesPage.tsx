import api from "@/api/axios";
import { PageHeader } from "@/components/PageHeader";
import { QuizCard } from "@/components/QuizCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PaginatedResponse } from "@/types";
import type { Quiz } from "@/types/quiz";
import type { AxiosError } from "axios";
import { ArrowLeft, Clock, Eye, Play, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const QuizzesPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    api
      .get<PaginatedResponse<Quiz>>("/quizzes")
      .then(({ data }) => {
        setQuizzes(data.content);
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

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header */}
        <PageHeader
          title="Quizzes Disponibles"
          handleBack={() => navigate(-1)}
        />
        {/* Search */}
        <div className="max-w-md mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/95 backdrop-blur"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes &&
            filteredQuizzes.map((quiz) => (
              <QuizCard
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                numberOfQuestions={quiz.questions.length}
                avgTime={0}
                createdBy={quiz.createdBy}
                onShowQuestions={() => navigate(`/quizzes/${quiz.id}`)}
                onCreateLobby={() =>
                  navigate("/create-game", {
                    state: { selectedQuiz: quiz },
                  })
                }
              />
            ))}
        </div>

        {filteredQuizzes.length === 0 && quizzes.length > 0 && (
          <div className="text-center py-12">
            <p className="text-lg">
              No se encontraron quizzes que coincidan con tu búsqueda
            </p>
          </div>
        )}

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg">
              No hay quizzes disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
