import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserSchema } from "../../modules/validations/user/create";
import { prisma } from "../../lib/prismaclient";
import { hashPassword } from "../../modules/services/bcrypt/hashPassword";


export const CreateUser = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/user/create', {
        schema: {
            body: createUserSchema
        },
    },
        async (req, res) => {
            const { name, email, senha, phone_number, avatar, born, funcao_id } = req.body;

            const userExists = await prisma.users.findFirst({
                where: {
                    OR: [
                        {
                            email,
                        },
                        {
                            phone_number,
                        }
                    ]
                }
            })

            if (userExists) {
                return res.status(400).send({ error: 'Email or Phone Number already exists' });
            }

            const funcao = await prisma.funcao.findUnique({
                where: {
                    id_funcao: funcao_id,
                },
            });

            if (!funcao) {
                return res.status(404).send({ error: 'Funcao not found' });
            }
            const hashedPassword = await hashPassword(senha);

            const user = await prisma.users.create({
                data: {
                    name,
                    email,
                    senha: hashedPassword,
                    phone_number,
                    avatar,
                    born,
                    funcao_id,
                    user_status: 'ACTIVO',
                },
            });
            return res.status(201).send(user);
        }
    )
} 