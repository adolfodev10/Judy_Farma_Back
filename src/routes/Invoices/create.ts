import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";
import { createInvoiceSchema } from "../../modules/validations/invoices/create-invoice-schema";

export const CreateInvoice = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post("/invoice/create", {
        schema: {
            body: createInvoiceSchema
        },
    },
async (req, reply) => {
    const {client_id,product_id, approval, price, date} = req.body;

    const invoiceExists = await prisma.invoices.findFirst({
        where: {
            OR: [
                {
                    client_id,
                    product_id,
                    price: price,
                },
            ],
        }
    }) 
    if(invoiceExists) return reply.status(400).send({error : "Cliente Já tem dívida"});
    const invoice = await prisma.invoices.create({
        data:{
            client_id,
            product_id,
            price,
            date,
        }
    })
    return reply.code(201).send({invoice});
}
)
}