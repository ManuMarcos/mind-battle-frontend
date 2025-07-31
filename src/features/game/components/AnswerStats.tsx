import type { QuestionStats } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faHeart, faMoon, faStar } from "@fortawesome/free-solid-svg-icons";

type AnswerStatsProps = {
  stats: QuestionStats[];
};

export const AnswerStats = ({ stats }: AnswerStatsProps) => {
  //Ordeno por el campo order
  const orderedStats = [...stats].sort((a, b) => a.order - b.order);

  const icons = [faHeart, faStar, faCircle, faMoon];

  const letters = ["A", "B", "C", "D"];

  const colors = ["bg-red-500", "bg-blue-500", "bg-orange-300", "bg-green-500"];

  if (!stats || stats.length === 0) return null;

  const total = stats.reduce((sum, s) => sum + s.count, 0);

  
  return (
    <div className="flex justify-center gap-10 mt-4">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={icons[i]} className={`text-white p-2 rounded-full ${colors[i]}`} />
          <div className={`w-10 h-[${orderedStats[i]?.count ?? 0}rem] ${colors[i]} rounded`} />
          <span className="text-sm font-medium">{orderedStats[i]?.count ?? 0} votos</span>
        </div>
      ))}

      {[2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={icons[i]} className={`text-white p-2 rounded-full ${colors[i]}`} />
          <div className={`w-10 h-[${orderedStats[i]?.count ?? 0}rem] ${colors[i]} rounded`} />
          <span className="text-sm font-medium">{orderedStats[i]?.count ?? 0} votos</span>
        </div>
      ))}
    </div>
  );
};
