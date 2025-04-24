// import { FastifyInstance } from "fastify";
// import z from "zod";
// import { ZodTypeProvider } from "fastify-type-provider-zod"
// import { prisma } from "../../lib/prismaclient";

// export const DeleteClient = async (app: FastifyInstance) => {
//     app.withTypeProvider<ZodTypeProvider>().delete<{ Params: { id: string } }>(
//         '/client/delete/:id',
//         {
//             schema: {
//                 params: z.object({
//                     id: z.string().uuid(),
//                 }),
//             },
//         },
//         async (req, res) => {
//             const { id } = req.params;
//             const clientExists = await prisma.clients.findUnique({
//                 where: { id_client: id },
//             });

//             if (!clientExists) {
//                 return res.status(404).send({ message: 'Cliente não encontrado' });
//             }

//             const getInvoiceWhereIdClient = await prisma.invoices.findMany({
//                 where: {
//                     client_id: clientExists.invoice_id,
//                 },
//             });

//             const getProductWhereIdClient = await prisma.products.findMany({
//                 where: {
//                     id_product: clientExists.id_client,
//                 },
//             });

//             if (getProductWhereIdClient.length > 0) {
//                 await prisma.products.deleteMany({
//                     where: {
//                         id_product : clientExists.id_client,
//                     },
//                 });
//             }

//             if (getInvoiceWhereIdClient.length > 0) {
//                 await prisma.invoices.deleteMany({
//                     where: {
//                         id_invoice: clientExists.id_client,
//                     },
//                 });
//             }

//             const client = await prisma.clients.delete({
//                 where: {
//                     id_client: id,
//                 },
//             });

//             return res.status(200).send({ client });
//         }
//     );
// }
