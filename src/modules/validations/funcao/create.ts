import { z } from "zod";

export const createFuncaoSchema = z.object({
    name:z.string()
    .min(3, {message: 'Name must be at least 3 characters long'})
    .refine((value) => value.trim() !== '', { message: 'Name must not be empty' }),

    description:z.string()
    .min(10, {message: 'Description must be at least 10 characters long'})
    .optional(),

    user:z.string().uuid().optional(),
})