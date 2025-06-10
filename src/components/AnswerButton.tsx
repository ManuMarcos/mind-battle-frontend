import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

type Props = {
  optionId: string;
  text: string;
  isCorrect: boolean;
  selectedOptionId: string | null;
  showCorrect: boolean;
  icon: any;
  color: string;
  onSelect: (optionId: string) => void;
};

export const AnswerButton = ({
  optionId,
  text,
  isCorrect,
  selectedOptionId,
  showCorrect,
  icon,
  color,
  onSelect,
}: Props) => {
  const isSelected = selectedOptionId === optionId;

  let baseColor = color;
  let iconFeedback = null;

  if (selectedOptionId && !showCorrect) {
    baseColor = isSelected ? baseColor : "bg-gray-300";
  } else if (showCorrect) {
    if (isSelected && isCorrect) {
      baseColor = "bg-green-500";
      iconFeedback = faCircleCheck;
    } else if (isSelected && !isCorrect) {
      baseColor = "bg-red-500";
      iconFeedback = faCircleXmark;
    } else if (!isSelected && isCorrect) {
      baseColor = "bg-green-500";
      iconFeedback = faCircleCheck;
    } else {
      baseColor = "bg-gray-300";
    }
  }

  return (
    <button
      onClick={() => onSelect(optionId)}
      disabled={selectedOptionId !== null || showCorrect}
      className={twMerge(
        `w-full flex items-center justify-between gap-4 px-4 py-3 rounded-lg text-left text-white font-semibold transition-colors`,
        baseColor
      )}
    >
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={icon} size="lg" />
        <span className="text-lg">{text}</span>
      </div>

      {iconFeedback && (
        <FontAwesomeIcon icon={iconFeedback} size="lg" className="text-white" />
      )}
    </button>
  );
};
