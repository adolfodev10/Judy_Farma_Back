import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

export const EditStock = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put('/stock/update/:id_stock', {
        schema: {
            params: z.object({
                id_stock: z.string().uuid(),
            }),
            body: z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                price: z.string().optional(),
                quantity: z.string().optional(),
                date_validate: z.string(),
            }),
        },
    }, async (req, reply) => {
        const { id_stock } = req.params;
        const { name, description, price, quantity, date_validate } = req.body;
        if (!id_stock) {
            return reply.status(400).send({ message: "O campo id é obrigatório" });
        }
        const stockExists = await prisma.stock.findUnique({
            where: {
                id_stock: id_stock,
            },
        });

        if (!stockExists) {
            return reply.status(404).send({ message: "Produto não encontrado" });
        }
        const stock = await prisma.stock.update({
            where: {
                id_stock: stockExists.id_stock,
            },
            data: {
                name,
                description,
                price,
                quantity,
                date_validate,
            },
        });

        if (Number(stock.quantity) <= 0) {
            await prisma.stock.delete({
                where: {
                    id_stock: stockExists.id_stock,
                },
            });
            return reply.status(200).send({ message: "Produto apagado com sucesso" });
        }
        return reply.status(200).send({ message: "Produto atualizado com sucesso" });
    });
}