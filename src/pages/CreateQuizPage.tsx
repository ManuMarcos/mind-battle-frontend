import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { mapQuizFormToRequest, type QuestionForm } from "@/types/quiz";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const initialOptions: QuestionForm = {
  id: "",
  text: "",
  options: [
    { id: 0, text: "", correct: false },
    { id: 1, text: "", correct: false },
    { id: 2, text: "", correct: false },
    { id: 3, text: "", correct: false },
  ],
  timeLimitSeconds: 30,
};


export const CreateQuizPage = () => {
  //Sacar luego
  const { user } = useAuth();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescr, setQuizDescr] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionForm>(initialOptions);
  const navigate = useNavigate();

  const addQuestion = () => {
    if (
      !currentQuestion.text.trim() ||
      currentQuestion.options.some((option) => !option.text.trim())
    ) {
      toast.error("Error", {
        description: "Por favor completa la pregunta y todas las opciones",
      });
    }
    else if(currentQuestion.options.every((option) => option.correct === false)){
      toast.error("Error", {
        description: "Alguna de las opciones tiene que estar seleccionada como la correcta"
      })
    }
    else if (questions.length >= 20) {
      toast.error("Error", {
        description: "Máximo 20 preguntas por quiz",
      });
    } else {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion(initialOptions);
      toast.success("Pregunta agregada", {
        description: `Pregunta ${questions.length + 1} agregada correctamente`,
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success("Pregunta eliminada", {
      description: "La pregunta ha sido eliminada correctamente",
    });
  };

  const cleanForm = () => {
    setQuizTitle("");
    setQuizDescr("");
    setQuestions([]);
    setCurrentQuestion(initialOptions);
  }


  const saveQuiz = async () => {
    if (questions.length === 0) {
      toast.error("Error", {
        description: "Por favor agregue al menos una pregunta",
      });
    } else {
      try {
        await api.post(
          "/quizzes",
          mapQuizFormToRequest({
            title: quizTitle,
            description: quizDescr,
            questions: questions,
          })
        );
        toast.success("Quizz creada exitosamente");
        cleanForm();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const message = error.response?.data.message;
          toast.error("Error al crear Quiz", {
            description: status + " - " + message,
          });
        } else {
          toast.error("Error inesperado");
        }
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index].text = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <div className=" bg-gradient-to-br ">
      <Toaster richColors />
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/")}
              className="bg-white/30 border-black/25 hover:bg-white/30"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <h1 className="text-3xl font-bold">Crear Quiz</h1>
          </div>
          <Button
            onClick={saveQuiz}
            className="bg-white text-primary cursor-pointer hover:bg-white/90"
          >
            Guardar Quiz
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de nueva pregunta */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Nueva Pregunta
                <span className="text-sm text-muted-foreground">
                  {questions.length}/20
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Título del Quiz */}
              {questions.length === 0 && (
                <>
                  <div>
                    <Label htmlFor="quiz-title">Título del Quiz</Label>
                    <Input
                      id="quiz-title"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      placeholder="Ingresa el título del quiz"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiz-title">Descripción</Label>
                    <Input
                      id="quiz-description"
                      value={quizDescr}
                      onChange={(e) => setQuizDescr(e.target.value)}
                      placeholder="Ingresa la descripción del quiz"
                      className="bg-background"
                    />
                  </div>
                </>
              )}

              {/* Pregunta */}
              <div className="space-y-2">
                <Label htmlFor="question">Pregunta</Label>
                <Textarea
                  id="question"
                  value={currentQuestion.text}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      text: e.target.value,
                    })
                  }
                  placeholder="Escribe tu pregunta aquí..."
                  className="bg-background min-h-[100px]"
                />
              </div>

              {/* Opciones */}
              <div className="space-y-4">
                <Label>Opciones de respuesta</Label>
                <RadioGroup
                  value={
                    currentQuestion.options
                      .find((opt) => opt.correct)
                      ?.id.toString() ?? ""
                  }
                  onValueChange={(value) => {
                    console.log("Seleccionado:", value);

                    const updatedOptions = currentQuestion.options.map(
                      (opt) => ({
                        ...opt,
                        correct: opt.id.toString() === value,
                      })
                    );

                    setCurrentQuestion({
                      ...currentQuestion,
                      options: updatedOptions,
                    });
                  }}
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3"
                    >
                      <RadioGroupItem
                        value={option.id.toString()}
                        id={`option-${option.id}`}
                      />
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          updateOption(option.id, e.target.value)
                        }
                        placeholder="Opción"
                      />
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-sm text-muted-foreground">
                  Selecciona la opción correcta marcando el círculo
                  correspondiente
                </p>
              </div>

              <Button
                onClick={addQuestion}
                className="w-full"
                disabled={questions.length >= 20}
              >
                Agregar Pregunta
              </Button>
            </CardContent>
          </Card>

          {/* Lista de preguntas agregadas */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle>Preguntas del Quiz</CardTitle>
              {quizTitle && (
                <p className="text-lg font-semibold text-primary">
                  {quizTitle}
                </p>
              )}
              {quizDescr && <p className="text-md text-primary">{quizDescr}</p>}
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay preguntas agregadas aún
                </p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {questions.map((question, index) => (
                    <Card key={question.id} className="border border-border">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 bg-green">
                            <h4 className="font-medium mb-2">
                              {index + 1}. {question.text}
                            </h4>
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm p-2 rounded ${
                                    option.correct
                                      ? "bg-green-100 text-green-800 font-medium"
                                      : "bg-muted"
                                  }`}
                                >
                                  {option.correct && "✓ "}
                                  {option.text}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeQuestion(question.id)}
                            className="shrink-0"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
