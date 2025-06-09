import type { PlayerSession } from "@/types";
import { Badge } from "./ui/badge";

type PlayersListProps = {
  playersUsername : string[]
};

export const PlayersList = ({ playersUsername }: PlayersListProps) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {playersUsername.map((username, index) => (
        <Badge key={index} variant={"default"} className="h-8">
          {username}
        </Badge>
      ))}
    </div>
  );
};
