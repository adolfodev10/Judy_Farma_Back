import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

export const UpdateUser = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put('/user/edit/:id', {
        schema: {
            params: z.object({
                id: z.string(),
            }),
            body: z.object({
                name: z.string(),
                email: z.string(),
                phone_number: z.string(),
                avatar: z.string().optional(),
                user_status: z.string(),
                funcao_id: z.string(),
            })
        },
    },
        async (req, res) => {
            const { id } = req.params;
            const { name, email, phone_number, avatar, user_status, funcao_id } = req.body;

            if (!id) {
                return res.status(400).send({ message: "O campo id é obrigatório" });
            }

            const existingUser = await prisma.users.findUnique({
                where: {
                    id_user: id,
                },
            });

            if (!existingUser) {
                return res.status(404).send({ message: "User not found" });
            }

            const user = await prisma.users.update({
                where: {
                    id_user: id,
                },
                data: {
                    name,
                    email,
                    phone_number,
                    avatar,
                    user_status: user_status as any,
                    funcao_id,
                },
            });

            return res.status(200).send({
                message: "User updated successfully",
                user,
            })
        }
    );
}