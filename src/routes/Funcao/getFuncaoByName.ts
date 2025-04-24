import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

export const GetFuncaoByName = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get("/funcao/getByName/:name", {
        schema: {
            params: z.object({
                name: z.string()
            })
        }
    },
        async (request) => {
            const { name } = request.params;
            const funcao = await prisma.funcao.findFirst({
                where: {
                    name_funcao: name,
                }
            })
            return funcao?.id_funcao
        }
    )
}