import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prismaclient";

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const GetClient = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/client",
    {
      schema: {
        querystring: querySchema,
      },
    },
    async (req, res) => {
      try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "10", 10);

        const clients = await prisma.clients.findMany({
          skip: (page - 1) * limit,
          take: limit,
        });

        res.status(200).send({
          page,
          limit,
          clients,
        });
      } catch (error) {
        res.status(500).send({ message: "Error fetching clients", error });
      }
    }
  );
};
