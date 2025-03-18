import z from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .refine((value:any) => value.trim() !== '', { message: 'Name must not be empty' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }).optional(),
  logo: z.string().optional(),
  userId: z.string().uuid(),
  telefone:z.string().min(9, {message: 'Número de Telefone dev ser 9 caracteres'})
});