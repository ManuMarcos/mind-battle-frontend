import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";
import type { LoginResponse } from "@/types";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";


const FormSchema = z.object({
  username: z.string().min(1, {
    message: "Debe ingresar un usuario",
  }),
  password: z.string().min(1, {
    message: "Debe ingresar una contraseña",
  }),
});

interface LoginFormProps {
  onSuccess : () => void;
}

export const LoginForm = ({ onSuccess } : LoginFormProps) => {
  const {login} = useAuth();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      try{
        const response = await api.post<LoginResponse>("/auth/login", {
          username: data.username,
          password: data.password
        });
        login(response.data.token, data.username);
      }  
      catch(error){
          if(axios.isAxiosError(error)){
            const status = error.response?.status;
            const message = error.response?.data.message;
            console.error("Error HTTP: ", status, message);
          }
          else{
            console.error("Error inesperado: ", error)
          }
      }
      onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre de usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Tu contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">Iniciar Sesión</Button>
      </form>
    </Form>
  );
};
