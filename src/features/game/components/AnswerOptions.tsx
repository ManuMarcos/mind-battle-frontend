
import {
  faCircle,
  faHeart,
  faMoon,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AnswerButton } from "./AnswerButton";
import { useWebSocket } from "@/context/WebSocketProvider";
import type { Option } from "@/types/quiz";

const icons = [
  { icon: faHeart, color: "bg-red-500" },
  { icon: faStar, color: "bg-blue-500" },
  { icon: faCircle, color: "bg-orange-300" },
  { icon: faMoon, color: "bg-green-500" },
];

type AnswerProps = {
  options: Option[];
  onAnswerSelected: (optionId: string) => void;
  revealCorrectAnswer: boolean;
};

export const AnswerOptions = ({
  options,
  onAnswerSelected,
  revealCorrectAnswer,
}: AnswerProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const {sendMessage} = useWebSocket()

  const handleOptionClick = (optionId: string) => {
    setSelectedOptionId(optionId);
    onAnswerSelected(optionId);
  };

  useEffect(() => {
    if (revealCorrectAnswer) {
      setShowCorrect(true);
    }
  }, [revealCorrectAnswer]);

  return (
    <>
      {options.map((option, index) => {
        const isSelected = selectedOptionId === option.id;
        const isCorrect = option.correct;
        const { icon, color } = icons[index];

        let baseColor = `${color}`;
        if (selectedOptionId && !showCorrect) {
          //El usuario eligio algo pero el tiempo no termino -> Muestro esta en gris
          baseColor = isSelected
            ? baseColor + " border-2 border-black"
            : "bg-gray-300";
        } else if (showCorrect) {
          if (isSelected && isCorrect) {
            baseColor = "bg-green-500 border-2 border-black";
          } else if (isSelected && !isCorrect) {
            baseColor = "bg-red-500 border-2 border-black";
          } else if (!isSelected && isCorrect) {
            baseColor = "bg-green-500";
          } else {
            baseColor = "bg-gray-300";
          }
        }

        return (
          <AnswerButton
            key={option.id}
            optionId={option.id}
            text={option.text}
            isCorrect={option.correct}
            selectedOptionId={selectedOptionId}
            showCorrect={showCorrect}
            icon={icons[index].icon}
            color={icons[index].color}
            onSelect={(id) => handleOptionClick(id)}
          />
        );
      })}
    </>
  );
};
