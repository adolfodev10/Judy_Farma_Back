import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";

export const GetAllFuncao = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/funcao/getAll', {},
        async () => {
            const funcoes = await prisma.funcao.findMany();
            return { funcoes };
        });
}