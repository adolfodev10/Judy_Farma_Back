import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";

export const GetAllInvoice = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/invoice/getAll', {},
        async () => {
            const invoices = await prisma.invoices.findMany();
            return { invoices };
        });
}