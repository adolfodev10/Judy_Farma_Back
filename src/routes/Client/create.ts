import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../../lib/prismaclient";
import { clientSchema } from "../../modules/validations/client/create-zodSchema";
import { ERROR_MESSAGES } from "../../modules/validations/client/create";

export const CreateClient = async (app: FastifyInstance) => {
    const validateCreation = async (name: string, telefone: string, invoiceId: string, productId: string) => {
        const [nameExists, phone_number, id_invoice, id_product] = await Promise.all([
            prisma.clients.findFirst({ where: { name } }),
            prisma.clients.findUnique({
                where: {
                    id_client: productId
                },
            }),
            prisma.invoices.findUnique({ where: { id_invoice: invoiceId } }),
            prisma.products.findUnique({ where: { id_product: productId } })
        ])

        if (nameExists) throw new Error(ERROR_MESSAGES.CLIENT_NAME_EXISTS);
        if (!phone_number) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        if (!id_invoice) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        if (!id_product) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

        return nameExists;
    }

    app.withTypeProvider<ZodTypeProvider>().post(
        '/client/create',
        {
            schema: {
                body: clientSchema
            },
        },
        async (req, res) => {
            try {
                const { name, telefone, invoice_id, product_id } = req.body as unknown as { name: string, telefone: string, invoice_id: string, product_id: string };

                await validateCreation(name, telefone, invoice_id, product_id);

                const client = await prisma.clients.create({
                    data: {
                        name,
                        telefone,
                        invoice_id: invoice_id,
                        id_client: product_id
                    }
                })
                return res.status(201).send(client);
            } catch (error) {
                return res.status(400).send({ error: (error as Error).message })
            }
        }
    )
}