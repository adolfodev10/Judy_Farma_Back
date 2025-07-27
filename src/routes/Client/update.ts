import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prismaclient";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const UpdateClient = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put(
        "/client/update/:id_client",
        {
            schema: {
                params: z.object({
                    id_client: z.string().uuid(),
                }),
                body: z.object({
                    name: z.string(),
                    telefone: z.string()
                        .optional(),
                }),
            },
        },
        async (req, res) => {
            const { id_client } = req.params;
            const { name, telefone } = req.body;

            if (!id_client) {
                return res
                    .status(400)
                    .send({ message: "O campo id é obrigatório" });
            }

            const existingClient = await prisma.clients.findUnique({
                where: { id_client },
            });

            if (!existingClient) {
                return res
                    .status(404)
                    .send({ message: "Cliente não encontrado." });
            }

            // Prepara os dados a atualizar
            const updateData: { name: string; telefone?: string } = {
                name,
            };

            if (typeof telefone === "string" && telefone.trim() !== "") {
                updateData.telefone = telefone;
            }

            const client = await prisma.clients.update({
                where: { id_client },
                data: updateData,
            });

            return res.status(200).send(client);
        }
    );
};
