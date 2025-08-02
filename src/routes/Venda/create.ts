import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prismaclient";
import { createVendaSchema } from "../../modules/validations/venda/create-venda";
// import { fastify } from "../../lib/fastify";

export const CreateVenda = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post('/venda/create', {
        schema: {
            body: createVendaSchema
        },
    },
        async (req, res) => {
            const { id, description, status, date_venda, methodPayment, price, date_validate, name_product, quantity, created_at, updated_at } = req.body;
            const venda = await prisma.venda.create({
                data: {
                    id,
                    name_product: name_product ?? "",
                    description: description ?? "",
                    status:status ?? "VENDIDO",
                    methodPayment,
                    price: price ?? 0,
                    date_validate: date_validate,
                    quantity: quantity ?? "",
                    date_venda: date_venda,
                    created_at: new Date(created_at),
                    updated_at: new Date(updated_at),
                }
            });
            // fastify.io.emit("admin_notificatin", {
            //     type: "venda",
            //     title: "Produto Vendido",
            //     message: `O produto ${vendaExists.name_product} foi vendido.`,
            //     vendaId: vendaExists.id
            // })
            return res.status(200).send(venda);
        })
}