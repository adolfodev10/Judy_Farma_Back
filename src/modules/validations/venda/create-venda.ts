import { z } from "zod";

export const createVendaSchema = z.object({
    product_id: z.string().uuid(),
    description: z.string().optional(),
    methodPayment: z.enum(["MULTICAIXA_EXPRESS", "CACHE", "TPA"]),
    price: z.string(),
    date_validate: z.string(),
    name_product:z.string().optional(),
    quantity:z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});
