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
        sub: user.id,
        name: user.name
      });

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
      }
      return { user: userWithoutPassword, token };
    }
  )
}