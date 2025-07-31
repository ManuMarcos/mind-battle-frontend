import { ArrowLeft, Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

type PageHeaderProps = {
  title: string;
  handleBack: () => void;
  rightButton?: React.ReactNode;
};

export const PageHeader = ({
  title,
  handleBack,
  rightButton,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between mb-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          className="bg-white/20 border-black/25 cursor-pointer hover:bg-white/30"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-black">{title}</h1>
      </div>
      <div className="mr-2">
        {rightButton && <div>{rightButton}</div>}
      </div>
    </div>
  );
};
