import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createProductSchema } from "../../modules/validations/product/create-product";
import { prisma } from "../../lib/prismaclient";

export const CreateProduct = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/product/create', {
        schema: {
            body: createProductSchema
        },
    },
        async (request, reply) => {
            const { name, price, description, user_id } = request.body;


            const productExists = await prisma.products.findFirst({
                where: {
                    OR: [
                        {
                            description,
                        },
                        {
                            user_id,
                        }
                    ],
                }
            })
        })
}