import { FastifyInstance } from "fastify";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../../lib/prismaclient";

export const DeleteClient = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().delete('/client/delete/:id', {
        schema: {
            params: z.object({
                id: z.string().nonempty("O campo id é obrigatório."),
            }),
        },
    },
        async (req, res) => {
            const { id } = req.params;

            const clients = await prisma.clients.findUnique({
                where: { id_client: id },
            });

            if (!clients) {
                return res.status(404).send({ message: 'Cliente não encontrado' });
            }
            await prisma.clients.delete({
                where: {
                    id_client: id,
                },
            });

            return res.status(200).send({ message: "Cliente Eliminado com sucesso" });
        }
    );
}
