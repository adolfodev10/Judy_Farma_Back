import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prismaclient";
import { verifyPassword } from "../../modules/services/bcrypt/verifyPassword";
import { generateToken } from "../../modules/services/jwt/generateToken";

export const Login = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    },
  },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.users.findUnique({
        where: {
          email,
          user_status: "ACTIVO"
        },
      });

      if (!user) {
        reply.status(404).send({ error: 'User not found' });
        return;
      }

      const isPasswordValid = await verifyPassword(password, user.senha);

      if (!isPasswordValid) {
        reply.status(401).send({ error: 'Credentials invalid' });
        return;
      }

      const token = await generateToken({
        id_user: user.id_user,
        email: user.email
      });

      const userWithoutPassword = {
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        phone_number:user.phone_number,
        born: user.born,
        id_funcao: user.funcao_id
      }
      return { user: userWithoutPassword, token };
    }
  )
}