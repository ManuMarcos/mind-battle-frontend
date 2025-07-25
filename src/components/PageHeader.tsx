import { ArrowLeft, Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./logo";

type PageHeaderProps = {
  title: string;
  handleBack: () => void;
  showLogo?: boolean
};

export const PageHeader = ({title, handleBack, showLogo = false} : PageHeaderProps) => {
  
    return (
    <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {showLogo && <Logo className="w-15"/>}
        </div>
  );
};
