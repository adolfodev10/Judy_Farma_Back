import z from "zod";

export const createUserSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .trim()
        .nonempty({ message: "Name must not be empty" }),

    client: z.string().uuid().nullable().optional(),

    senha: z.string()
        .min(6, { message: "Password must be at least 6 characters long" }),
        
  funcao_id: z.string(),

});
