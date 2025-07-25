import api from "@/api/axios";
import { PageHeader } from "@/components/PageHeader";
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
      .catch((error : AxiosError) => {
        if(error.response){
          console.error("Respuesta del servidor con error: ", error.response.data)
        }
        else if(error.request){
          console.error("No hubo respuesta del servidor: ", error.request);
        }
        else{
          console.log("Error desconocido", error);
        }
      });
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400">
      <div className="container mx-auto p-6">
        {/* Header */}
        <PageHeader title="Quizzes Disponibles" handleBack={() => navigate('/')}/>

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
              <Card
                key={quiz.id}
                className="bg-white/95 backdrop-blur hover:bg-white transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="bg-violet-300">
                  <p className="text-sm  bg-red-300 text-muted-foreground mb-4">
                    {quiz.description}
                  </p>

                  <div className="flex gap-2 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {quiz.questions?.length} #preguntas
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />~{0} min
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Creado por: {quiz.createdBy}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedQuiz(quiz.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Preguntas
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => console.log("LLamando a crear Partida")}
                      className="flex-1"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Crear Sala
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-lg">
              No se encontraron quizzes que coincidan con tu búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
