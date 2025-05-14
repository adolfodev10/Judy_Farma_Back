import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../../lib/prismaclient"


export const GetAllProduct = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/product/getAll', {},
        async (req, reply) => {
            const products = await prisma.products.findMany();
            return reply.status(200).send(products);
        });
}