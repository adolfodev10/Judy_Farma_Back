import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../../lib/prismaclient"


export const GetAllProduct = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get('/product/getAll', {},
        async () => {
            const products = await prisma.products.findMany({
                where: {
                    user: {
                        user_status: "ACTIVO"
                    }
                }
            })
            return { products };
        }
    )
}