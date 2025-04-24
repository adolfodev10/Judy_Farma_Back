// import { FastifyInstance } from "fastify";
// import { ZodTypeProvider } from "fastify-type-provider-zod"
// import { prisma } from "../../lib/prismaclient";
// import { createClientSchema } from "../../modules/validations/client/create-zodSchema";
// import { ERROR_MESSAGES } from "../../modules/validations/client/create";

// export const CreateClient = async (app: FastifyInstance) => {
//     // const validateCreation = async (name: string, telefone: string, invoiceId: string, productId: string) => {
//     //     const [nameExists, phone_number, id_invoice, id_product] = await Promise.all([
//     //         prisma.clients.findFirst({ where: { name } }),
//     //         prisma.clients.findUnique({
//     //             where: {
//     //                 id_client: productId
//     //             },
//     //         }),
//     //         prisma.invoices.findUnique({ where: { id_invoice: invoiceId } }),
//     //         prisma.products.findUnique({ where: { id_product: productId } })
//     //     ])

//     //     if (nameExists) throw new Error(ERROR_MESSAGES.CLIENT_NAME_EXISTS);
//     //     if (!phone_number) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
//     //     if (!id_invoice) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
//     //     if (!id_product) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

//     //     return nameExists;
//     // }

//     app.withTypeProvider<ZodTypeProvider>().post(
//         '/client/create',
//         {
//             schema: {
//                 body: createClientSchema
//             },
//         },
//         async (req, res) => {
//             try {
//                 const { name, email, password, telefone, foto, user_id } = req.body;

//                 const  clientExists = await prisma.clients.findFirst({
//                     where:{
//                         OR:[
//                             {
//                                 name,
//                             },
//                             {
//                                 telefone,
//                             }
//                         ]
//                     }
//                 });           
//                 if(clientExists){
//                     res.status(400).send({error: 'Email or phone number already exists'})
//                     return;
//                 }
//                 const user = prisma.users.findUnique({
//                     where:{
//                         id_user: user_id,
//                     },
//                 });

//                 if(!user){
//                     return res.status(404).send({message:"Usuário não encontrado"});
//                 }
//             } catch (error) {
//                 return res.status(400).send({ error: (error as Error).message });
//             }
//         }
//     )
// }