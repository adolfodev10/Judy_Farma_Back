import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { addProductSchema } from "../../modules/validations/product/add-product";
import { prisma } from "../../lib/prismaclient";

export const AddProductInStock = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/product/add', {
        schema: {
            body: addProductSchema
        },
    },
        async (req, reply) => {
            const { name_product, price, quantity, date_validate, description, user_id } = req.body;
            const addProduct = await prisma.products.create({
                data: {
                    name_product: name_product ?? "",
                    description,
                    date_validate: date_validate ?? "",
                    price,
                    quantity
                }
            })
            return reply.status(200).send({ addProduct });
        })
}