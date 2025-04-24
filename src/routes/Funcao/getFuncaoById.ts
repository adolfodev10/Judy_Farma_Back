import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

export const GetFuncaoById = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/funcao/:id', {
        schema: {
            params: z.object({
                id: z.string().uuid(),
            })
        }
    },
        async (request) => {
            const { id } = request.params;

            const funcao = await prisma.funcao.findUnique({
                where: {
                    id_funcao: id,
                },
            });

            if (!funcao) {
                throw new Error('Funcao not found');
            }

            return { funcao };
        })
}