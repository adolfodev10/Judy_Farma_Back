import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";

export const GetAllVenda = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get("/venda/getAll", {},
        async (req, reply) => {
            const vendas = await prisma.venda.findMany();
            return reply.status(200).send(vendas);
        });
}