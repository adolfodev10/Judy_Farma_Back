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

export const GetAllFuncaoNotAdmin = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/funcao/getAllNotAdmin', {},
        async () => {
            const funcoes = await prisma.funcao.findMany({
                where: {
                    name_funcao: {
                        not: "ADMINISTRADOR"
                    }
                }
            });
            return { funcoes };
        });
}