"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  username: z.string().min(4, {
    message: "El nombre de usuario debe tener por lo menos 4 caracteres.",
  }),
  pin : z.string().min(6, {
    message: "El pin debe tener por lo menos 6 caracteres"
  })
})

export const JoinGameForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof FormSchema>) => void }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      pin : ""
    },
  })


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="USERNAME" {...field} className="bg-primary-foreground placeholder:text-gray-300" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="GAME PIN" {...field} className="bg-primary-foreground placeholder:text-gray-300" />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Ingresar</Button>
      </form>
    </Form>
    
  )
}
