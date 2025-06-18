import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../../lib/prismaclient";
import { createClientSchema } from "../../modules/validations/client/create-zodSchema";

export const CreateClient = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/client/create',
        {
            schema: {
                body: createClientSchema
            },
        },
        async (req, res) => {
            try {
                const { name, telefone } = req.body;

                const clientExists = await prisma.clients.findFirst({
                    where: {
                        OR: [
                            { name },
                            { telefone }
                        ]
                    }
                });
                if (clientExists) {
                    return res.status(400).send({ error: 'Nome  ou telefone já existe' })
                }
                const newClient = await prisma.clients.create({
                    data: {
                        name,
                        telefone: telefone ?? "",
                    }
                });

                return res.status(201).send(newClient);
            } catch (error) {
                return res.status(400).send({ error: (error as Error).message });
            }
        }
    )
}