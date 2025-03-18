import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prismaclient";
import { ERROR_MESSAGES } from "../../modules/validations/client/create";
import { UpdateClientBodySchema } from "../../modules/validations/client/update-zodSchema";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const UpdateClient = async (app : FastifyInstance) =>  {
    const paramsSchema = z.object({
        id:  z.string().uuid(),
    })

    const validateClientUpdate = async (id: string, name?: string, telefone?:string) => {
        if (name) {
          const nameExists = await prisma.clients.findFirst({ where: { name } });
          if (nameExists) throw new Error(ERROR_MESSAGES.CLIENT_NAME_EXISTS);
        }
        if(telefone){
            const phone_number = await prisma.clients.findFirst({where:{ telefone } });
            if (phone_number) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        } 
    
        const client = await prisma.clients.findUnique({ where: { id_client: id } });
        if (!client) throw new Error(ERROR_MESSAGES.USER_HAS_CLIENT);
    
        return client;
      };

      
  app.withTypeProvider<ZodTypeProvider>().put(
    '/client/update/:id',
    {
      schema: {
        params: paramsSchema,
        body: UpdateClientBodySchema,
      },
    },
    async (req, res) => {
      try {
        const { id } = req.params;
        const { name, telefone } = req.body;

        const existingClient = await validateClientUpdate(id, name, telefone);

        const updatedClient = await prisma.clients.update({
          where: { id_client: id },
          data:{
            name:name || existingClient.name,
            telefone:telefone || existingClient.telefone,
          }
        });

        return res.status(200).send(updatedClient);
      } catch (error) {
        return res.status(400).send({ error: (error as Error).message });
      }
    }
  );
}