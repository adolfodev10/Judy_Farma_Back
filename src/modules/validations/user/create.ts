import z from "zod";

export const createUserSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .refine((value) => value.trim() !== "", { message: "Name must not be empty" }),
    email: z.string()
        .email({ message: "Invalid email address" })
        .refine((value) => value.trim() !== "", { message: "Email mmust not be empty" }),
    senha: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .refine((value) => value.trim() !== "", { message: "Password must not be empty" }),
    phone_number: z.string()
    .min(9, { message: "Phone number must be at least 9 characters long" }),
    avatar: z.string().optional(),
    born: z.coerce.date({errorMap: () => ({ message: "Invalid date format" }) }),
    funcao_id: z.string().uuid({ message: "Invalid function ID" }),
});
