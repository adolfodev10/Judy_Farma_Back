import { z } from "zod";

export const createVendaSchema = z.object({
    id: z.string().uuid(),
    name_product:z.string().optional(),
    description: z.string().optional(),
    methodPayment: z.enum(["MULTICAIXA_EXPRESS", "CACHE", "TPA"]),
    date_validate: z.string(),
    price: z.string(),
    quantity:z.string().optional(),
    status: z.enum(["VENDIDO", "VENDENDO", "NAO_VENDIDO", "EXPIRADO"]).optional(),
    date_venda: z.string().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});
