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

type QuizCardProps = {
  id: string;
  title: string;
  description: string;
  numberOfQuestions: number;
  avgTime: number;
  createdBy: string;
  onShowQuestions: () => void;
  onCreateLobby: () => void;
};

export const QuizCard = ({
  id,
  title,
  description,
  numberOfQuestions,
  avgTime,
  createdBy,
  onShowQuestions
}: QuizCardProps) => {
  return (
    <Card
      key={id}
      className="bg-white/95 backdrop-blur hover:bg-white transition-colors"
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex text-sm flex-row gap-3 text-muted-foreground">
          <span>
            <FontAwesomeIcon icon={faHashtag} />
            {numberOfQuestions} preguntas
          </span>
          <span>
            <FontAwesomeIcon icon={faClock} /> ~{avgTime}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Creado por: {createdBy}
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
            onClick={() => console.log("LLamando a crear Partida")}
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
