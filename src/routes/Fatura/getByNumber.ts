import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

// ============================================
// SCHEMA DE VALIDAÇÃO
// ============================================

const getFaturaByNumberParamsSchema = z.object({
  numero: z.string(),
});

// ============================================
// ROTA GET - BUSCAR FATURA POR NÚMERO
// ============================================

export const GetFaturaByNumber = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/fatura/numero/:numero',
    {
      schema: {
        params: getFaturaByNumberParamsSchema,
        response: {
          200: z.object({
            id: z.string(),
            numero: z.string(),
            dataEmissao: z.string().datetime(),
            clienteNome: z.string(),
            totalPagar: z.number(),
            status: z.string(),
            statusAGT: z.string(),
          }),
          404: z.object({
            error: z.string(),
            message: z.string(),
          }),
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const { numero } = req.params;

        const fatura = await prisma.fatura.findUnique({
          where: { numero },
          select: {
            id: true,
            numero: true,
            dataEmissao: true,
            clienteNome: true,
            totalPagar: true,
            status: true,
            statusAGT: true,
          },
        });

        if (!fatura) {
          return res.status(404).send({
            error: 'Fatura não encontrada',
            message: `Fatura com número ${numero} não foi encontrada`,
          });
        }

        return res.status(200).send({
          ...fatura,
          dataEmissao: fatura.dataEmissao.toISOString(),
        });

      } catch (error: any) {
        console.error('❌ Erro ao buscar fatura:', error);
        
        return res.status(500).send({
          error: 'Erro interno do servidor',
          message: error.message || 'Falha ao buscar fatura',
        });
      }
    }
  );
};