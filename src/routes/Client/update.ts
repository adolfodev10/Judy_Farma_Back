import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prismaclient";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UpdateClientBodySchema } from "../../modules/validations/client/update-zodSchema";

export const UpdateClient = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put('/client/update/:id',
        {
            schema: {
                params: z.object({
                    id_client: z.string().uuid(),
                }),
                body: z.object({
                    name: z.string(),
                    telefone: z.string().min(9, { message: 'Telefone must be at least 9 characters long' }).optional(),
                })
            },
        },
        async (req, res) => {
            const { id_client } = req.params;
            const { name, telefone } = req.body;

            if (!id_client) {
                return res.status(400).send({ message: "O campo id é obrigatório" })
            }
            const existingClient = await prisma.clients.findUnique({
                where: {
                    id_client,
                },
            });

            if (!existingClient) {
                return res.status(404).send({ message: "Cliente não encontrado." })
            }

            const client = await prisma.clients.update({
                where: { id_client },
                data: {
                    name,
                    telefone,
                },
            });
            return res.status(200).send(client);
        }
    );
}