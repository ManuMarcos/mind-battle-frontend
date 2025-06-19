import { JoinGameForm } from "@/components/JoinGameForm";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";

export const JoinPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const handleJoinGame = async(formData : {enteredUsername : string, enteredPin : string}) => {
    try{
      const response = await fetch(`${API_BASE_URL}/api/sessions/${formData.enteredPin}/join`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({username : formData.enteredUsername})
      })
      
      if(!response.ok){
        throw new Error("No se pudo unir a la partida");
      }
      const gameSession = await response.json();

      sessionStorage.setItem("username", formData.enteredUsername);
      sessionStorage.setItem("gameSessionId", gameSession.id);


      navigate(`/game`);
      /*, {state : {
        username : formData.enteredUsername,
        gameSessionId : gameSession.id
      }*/
      
    }
    catch(err){
      console.log("Error al unirse: ", err);
    }
  }




  return (
    <div className="flex flex-col  w-1/2 lg:w-2/7 space-y-3">
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
      <Button onClick={() => navigate(`/quizzes`)} className="w-1/2">
        Ver Quizzes
      </Button>
      </div>
    </div>
  );
};
