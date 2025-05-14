import { z } from "zod";

export const createVendaSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).refine((value) => value.trim() !== '', { message: 'Name must not be empty' }),
    price: z.string(),
    description: z.string().optional(),
})