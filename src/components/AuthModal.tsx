import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ isOpen, onOpenChange }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  const onSuccess = () => {
    onOpenChange(false);
  }

  return (
    <Dialog  open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center">
          <DialogTitle>
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={isLogin ? "login" : "signup"}>
          <TabsList className="w-full ">
            <TabsTrigger className="cursor-pointer" onClick={() => setIsLogin(false)} value="signup">
              Registrarse
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" onClick={() => setIsLogin(true)} value="login">
              Iniciar Sesión
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <SignUpForm/>
          </TabsContent>
          <TabsContent value="login">
            <LoginForm onSuccess={onSuccess}/>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
