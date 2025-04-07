import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserSchema } from "../../modules/validations/user/create";
import { prisma } from "../../lib/prismaclient";
import { randomUUID } from "crypto";
import { hashPassword } from "../../modules/services/bcrypt/hashPassword";


export const CreateUser = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/user/create', {
        schema: {
            body: createUserSchema
        },
    },
        async (req, res) => {
            const { name, funcao_id, senha } = req.body;

            const userExists = await prisma.users.findFirst({
                where: {
                    OR: [
                        {
                            name,
                        },
                    ]
                }
            })

            if (userExists) {
                res.status(400).send({ error: 'Name already exists' });
                return;
            }

            const funcao = prisma.users.findUnique({
                where: {
                    id: funcao_id,
                }
            })

            if (!funcao) {
                res.status(400).send({ error: 'Funcionário not found' });
                return;
            }
            const hashedPassword = await hashPassword(senha);

            const user = await prisma.users.create({
                data: {
                    name,
                    senha: hashedPassword,
                    funcao: {
                        connect:{
                            id_funcao : funcao_id
                        }
                    }
                },
            });
            if(!user){
                res.status(404).send({message:"User not found"});
            }
            return res.status(201).send(user);

        }
    )
} 