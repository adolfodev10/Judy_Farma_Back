// import z from "zod";

// export const createClientSchema = z.object({
//   name: z.string()
//     .min(3, { message: 'Name must be at least 3 characters long' })
//     .refine((value) => value.trim() !== '', { message: 'Name must not be empty' }),
//   email: z.string().
//   email({ message: 'Invalid Email Address' }).
//   refine((value)=> value.trim() !== '', {message: 'Email must not be empty'}),
//   password: z.string()
//   .min(6, {message: 'Password must be at least 6 characters long'})
//   .refine((value)=> value.trim() !== '', {message: 'Password must not be empty'}),
//   telefone:z.string(),
//   foto:z.string().optional(),
//   user_id: z.string(),
// });