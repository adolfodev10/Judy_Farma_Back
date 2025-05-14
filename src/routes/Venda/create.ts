import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";
import { createVendaSchema } from "../../modules/validations/venda/create-venda";

export const CreateVenda = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/venda/create', {
        schema: {
            body: createVendaSchema
        },
    },
        async (req, res) => {
            const { name, price, description } = req.body;

            const vendaExists = await prisma.venda.findFirst({
                where: {
                    OR: [
                        {
                            description
                        },
                    ],
                }
            });
            return res.status(200).send(vendaExists);
        })
}