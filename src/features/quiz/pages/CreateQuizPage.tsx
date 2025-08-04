import api from "@/api/axios";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  mapQuizFormToRequest,
  type Quiz,
  type QuestionForm,
} from "@/types/quiz";
import { handleApiError } from "@/utils/handleApiError";
import { faArrowLeft, faClock, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

const createEmptyQuestion = (): QuestionForm => ({
  id: "",
  text: "",
  options: [
    { id: 0, text: "", correct: false },
    { id: 1, text: "", correct: false },
    { id: 2, text: "", correct: false },
    { id: 3, text: "", correct: false },
  ],
  timeLimitSeconds: 15,
});

export const CreateQuizPage = () => {
  //Sacar luego
  const { user } = useAuth();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescr, setQuizDescr] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    useState<QuestionForm>(createEmptyQuestion());
  const questionTimes = [];
  const navigate = useNavigate();

  for (let i = 5; i <= 60; i += 5) {
    questionTimes.push(i);
  }

  const addQuestion = () => {
    if (
      !currentQuestion.text.trim() ||
      currentQuestion.options.some((option) => !option.text.trim())
    ) {
      toast.error("Error", {
        description: "Por favor completa la pregunta y todas las opciones",
      });
    } else if (
      currentQuestion.options.every((option) => option.correct === false)
    ) {
      toast.error("Error", {
        description:
          "Alguna de las opciones tiene que estar seleccionada como la correcta",
      });
    } else if (questions.length >= 20) {
      toast.error("Error", {
        description: "Máximo 20 preguntas por quiz",
      });
    } else {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion(createEmptyQuestion());
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
    setCurrentQuestion(createEmptyQuestion());
  };

  const saveQuiz = async () => {
    if (questions.length === 0) {
      toast.error("Error", {
        description: "Por favor agregue al menos una pregunta",
      });
    } else {
      api
        .post<Quiz>(
          "/quizzes",
          mapQuizFormToRequest({
            title: quizTitle,
            description: quizDescr,
            questions: questions,
          })
        )
        .then((response) => {
          if (response.status === 201) {
            toast.success("Quizz creada exitosamente");
            cleanForm();
            navigate(`/quizzes/${response.data.id}`);
          }
        })
        .catch(handleApiError);
    }
  };

  const onTimeSelected = (value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      timeLimitSeconds: Number(value),
    });
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
        <PageHeader
          handleBack={() => navigate(-1)}
          title="Crear Quiz"
          rightButton={
            <Button onClick={saveQuiz} className="text-white cursor-pointer">
              Guardar Quiz
            </Button>
          }
        />

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
              <div className="flex flex-row items-center justify-between gap-2">
                <Label className="h-10 flex items-center mr-5">
                  Tiempo de respuesta
                </Label>
                <Select
                  onValueChange={onTimeSelected}
                  defaultValue={"15"}
                >
                  <SelectTrigger className="w-[180px] h-10 flex items-center grow">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTimes.map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {`${time} segundos`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <CardContent>
                        <div className="flex flex-row">
                          <div className="flex-3/4">
                            <div className="flex-col bg-green">
                              <div className="flex flex-row font-medium justify-between">
                                <h4 className="flex items-center mb-2">
                                  {index + 1}. {question.text}
                                </h4>
                                <h6 className="text-sm">
                                  <FontAwesomeIcon icon={faClock} className="mr-1"/>
                                  {question.timeLimitSeconds}
                                </h6>
                              </div>

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
                          </div>
                          <div className="ml-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeQuestion(question.id)}
                              className="bg-red-300 cursor-pointer hover:bg-red-500"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
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
