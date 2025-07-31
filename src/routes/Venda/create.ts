import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";
import { createVendaSchema } from "../../modules/validations/venda/create-venda";
import { fastify } from "../../lib/fastify";

export const CreateVenda = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/venda/create', {
        schema: {
            body: createVendaSchema
        },
    },
        async (req, res) => {
            const { product_id, description, methodPayment, price, date_validate, name_product, quantity, created_at, updated_at } = req.body;

            const produto = await prisma.venda.findUnique({
                where: {
                    id: product_id
                }
            });
            if (!produto) {
                return res.status(404).send({ message: "Produto nao encontrado" });
            }

            const vendaExists = await prisma.venda.create({
                data: {
                    status: "VENDIDO",
                    product_id,
                    description: description ?? "",
                    methodPayment,
                    price,
                    date_validate,
                    name_product: name_product ?? "",
                    quantity: quantity ?? "",
                    created_at,
                    updated_at
                }
            });
            // fastify.io.emit("admin_notificatin", {
            //     type: "venda",
            //     title: "Produto Vendido",
            //     message: `O produto ${vendaExists.name_product} foi vendido.`,
            //     vendaId: vendaExists.id
            // })
            return res.status(200).send(vendaExists);
        })
}