import { Clock, Eye, Play } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faHashtag } from "@fortawesome/free-solid-svg-icons";
import type { Quiz } from "@/types/quiz";

type QuizCardProps = {
  quiz : Quiz
  onShowQuestions: () => void;
  onCreateLobby: () => void;
};

export const QuizCard = ({
  quiz,
  onShowQuestions,
  onCreateLobby
}: QuizCardProps) => {
  return (
    <Card
      key={quiz.id}
      className="bg-white/95 backdrop-blur hover:bg-white transition-colors"
    >
      <CardHeader>
        <CardTitle className="text-lg">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex text-sm flex-row gap-3 text-muted-foreground">
          <span>
            <FontAwesomeIcon icon={faHashtag} />
            {quiz.questions.length} preguntas
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} /> ~{quiz.totalTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Creado por: {quiz.createdBy}
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowQuestions}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Preguntas
          </Button>
          <Button
            size="sm"
            onClick={onCreateLobby}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-1" />
            Crear Sala
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
