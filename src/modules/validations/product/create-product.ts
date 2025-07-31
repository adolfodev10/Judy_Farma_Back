import { z } from "zod";

export const createProductSchema = z.object({
    name_product: z.string().min(3, { message: 'Name must be at least 3 characters long' }).refine((value) => value.trim() !== '', { message: 'Name must not be empty' }).optional(),
    price: z.string(),
    description: z.string().optional(),
    date_validate: z.string(),
    quantity: z.string().min(1)
})