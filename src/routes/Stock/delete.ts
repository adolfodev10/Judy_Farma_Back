import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

export const deleteProduct = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().delete("/stock/delete/:id_stock", {
        schema: {
            params: z.object({
                id_stock: z.string().nonempty("O Campo id é obrigatório."),
            }),
        },
    }, async (req, reply) => {
        const { id_stock } = req.params;

        const product = await prisma.stock.findUnique({
            where: {
                id_stock,
            },
        });

        if (!product) {
            return reply.status(404).send({ message: "Produto não encontrado" });
        }
        await prisma.stock.delete({
            where: {
                id_stock,
            },
        });

        return reply.status(200).send({ message: "Produto apagado com sucesso" });
    })
}