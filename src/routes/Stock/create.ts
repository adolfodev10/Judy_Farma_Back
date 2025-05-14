import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createProductSchema } from "../../modules/validations/product/create-product";
import { prisma } from "../../lib/prismaclient";

export const CreateStockProduct = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/stock/create', {
        schema: {
            body: createProductSchema
        },
    },
        async (request, reply) => {
            const { name_product, price, description, quantity, date_validate } = request.body;
            const productExists = await prisma.products.findFirst({
                where: {
                    OR: [
                        {
                            name_product,
                        },
                    ],
                }
            })
            if (productExists) return reply.status(400).send({ error: "Product name already exists" })
            const products = await prisma.products.create({
                data: {
                    name_product,
                    price,
                    description:description,
                    date_validate:date_validate,
                    quantity: quantity,
                }
            })
            return reply.code(201).send({ products });
        })
}