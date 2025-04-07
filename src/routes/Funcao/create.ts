import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createFuncaoSchema } from "../../modules/validations/funcao/create";
import { prisma } from "../../lib/prismaclient";

export const CreateFuncao = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/funcao/create', {
        schema: {
            body: createFuncaoSchema
        }
    },
        async (req) => {
            const { name, description, user } = req.body

            const funcao = await prisma.funcao.create({
                data: {
                    name,
                    description,
                    ...(user && {
                        user: {
                            connect: {
                                id: user
                            }
                        }
                    })
                }
            })

            return funcao;
        }
    )
}