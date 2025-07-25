import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "./ui/dropdown-menu";
  import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";



export const UserDropdown = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const getInitials = (username : string) => {
        console.log(username.substring(0, 2).toUpperCase())
        return username.substring(0, 2).toUpperCase();
    }

    const onLogOut = () => {
        logout();
    }

    return(
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="mt-2 mr-3">
            <Button variant="ghost" className="rounded-full w-8 bg-black text-white">{user ? getInitials(user) : ""}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-3">
            <DropdownMenuLabel>{user}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/quizzes")}>Crear Partida</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/createQuiz')}>Crear Quizz</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLogOut()}>Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    )
}