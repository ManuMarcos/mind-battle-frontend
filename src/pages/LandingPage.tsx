import { JoinGameForm } from "@/components/JoinGameForm";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleJoinGame = async(formData : {username : string, pin : string}) => {
    try{
      const response = await fetch(`http://localhost:8084/api/sessions/${formData.pin}/join`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({username : formData.username})
      })
      const username = formData.username;
      
      if(!response.ok){
        throw new Error("No se pudo unir a la partida");
      }
      const gameSession = await response.json();

      navigate(`/lobby/${gameSession.id}`, {state : {username}});
    }
    catch(err){
      console.log("Error al unirse: ", err);
    }
  }




  return (
    <div className="flex flex-col  lg:w-1/5 space-y-3">
      <div className="flex flex-row justify-center ">
        <Logo className="w-50"/>
      </div>
      <div className="flex flex-row justify-center">
        <JoinGameForm onSubmit={handleJoinGame} />
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">o</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-row gap-3">
      <Button className="w-1/2">
        Crear Quiz
      </Button>
      <Button  className="w-1/2">
        Crear Partida
      </Button>
      </div>
    </div>
  );
};
