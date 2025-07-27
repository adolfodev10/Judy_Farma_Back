import { z } from "zod";

export const createInvoiceSchema = z.object({
    client_id: z.string().uuid().optional(),
    product_id: z.string().uuid(),
    price: z.string(),
    approval: z.string().optional(),
    date: z.coerce.date(),
})