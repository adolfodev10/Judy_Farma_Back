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
            const body = req.body

            if(Array.isArray(body)){
                const funcoes = await prisma.$transaction(
                    body.map(funcao => prisma.funcao.create({
                        data:{
                            name_funcao : funcao.name_funcao,
                            description: funcao.description,
                            ...(funcao.user && {
                                user:{
                                    connect: {
                                        id_user: funcao.user,
                                    },
                                },
                            }),
                        },
                    }))
                );
                return funcoes;
            }
            else {
                const {name_funcao, description, user} = body;

                const funcao = await prisma.funcao.create({
                    data: {
                        name_funcao,
                        description,
                        ...(user && {
                            user: {
                                connect:{
                                    id_user:user,
                                },
                                
                            },
                        }),
                    },
                });
                return funcao;
            }
        });
};