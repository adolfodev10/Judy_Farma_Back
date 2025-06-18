import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

export const EditStock = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put('/stock/update/:id', {
        schema: {
            params: z.object({
                id: z.string().uuid(),
            }),
            body: z.object({
                name_product: z.string().optional(),
                description: z.string().optional(),
                price: z.string().optional(),
                quantity: z.string().optional(),
                date_validate: z.string(),
            }),
        },
    }, async (req, reply) => {
        const { id } = req.params;
        const { name_product, description, price, quantity, date_validate } = req.body;
        if (!id) {
            return reply.status(400).send({ message: "O campo id é obrigatório" });
        }
        const stockExists = await prisma.products.findUnique({
            where: {
                id_product: id,
            },
        });

        if (!stockExists) {
            return reply.status(404).send({ message: "Produto não encontrado" });
        }
        const stock = await prisma.products.update({
            where: {
                id_product: stockExists.id_product,
            },
            data: {
                name_product,
                description,
                price,
                quantity,
                date_validate,
            },
        });

        if (Number(stock.quantity) <= 0) {
            await prisma.products.delete({
                where: {
                    id_product: stockExists.id_product,
                },
            });
            return reply.status(200).send({ message: "Produto apagado com sucesso" });
        }
        return reply.status(200).send({ message: "Produto atualizado com sucesso" });
    });
}