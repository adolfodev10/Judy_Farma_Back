import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

// ============================================
// SCHEMA DE VALIDAÇÃO PARA QUERY PARAMS
// ============================================

const getFaturasQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  numero: z.string().optional(),
  clienteNome: z.string().optional(),
  status: z.enum(["EMITIDA", "CANCELADA", "PAGA"]).optional(),
  statusAGT: z.enum(["PENDENTE", "ENVIADO", "ERRO"]).optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  operador: z.string().optional(),
});

// ============================================
// SCHEMA DE RESPOSTA
// ============================================

const faturaResponseSchema = z.object({
  id: z.string(),
  numero: z.string(),
  dataEmissao: z.string().datetime(),
  dataVencimento: z.string().datetime().nullable(),
  clienteNome: z.string(),
  clienteNif: z.string().nullable(),
  clienteTelefone: z.string().nullable(),
  empresaNome: z.string(),
  itens: z.any(),
  semImpostos: z.number(),
  impostos: z.number(),
  descontos: z.number(),
  totalPagar: z.number(),
  formaPagamento: z.string(),
  operador: z.string(),
  operadorId: z.string().nullable(),
  hashFiscal: z.string().nullable(),
  qrCodeData: z.string().nullable(),
  status: z.string(),
  statusAGT: z.string(),
  observacoes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

const getFaturasResponseSchema = z.object({
  data: z.array(faturaResponseSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

// ============================================
// ROTA GET - LISTAR FATURAS
// ============================================

export const GetFaturas = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/fatura',
    {
      schema: {
        querystring: getFaturasQuerySchema,
        response: {
          200: getFaturasResponseSchema,
          500: z.object({
            error: z.string(),
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const {
          page,
          limit,
          numero,
          clienteNome,
          status,
          statusAGT,
          dataInicio,
          dataFim,
          operador,
        } = req.query;

        // ============================================
        // CONSTRUIR FILTROS
        // ============================================

        const where: any = {};

        if (numero) {
          where.numero = { contains: numero, mode: 'insensitive' };
        }

        if (clienteNome) {
          where.clienteNome = { contains: clienteNome, mode: 'insensitive' };
        }

        if (status) {
          where.status = status;
        }

        if (statusAGT) {
          where.statusAGT = statusAGT;
        }

        if (operador) {
          where.operador = { contains: operador, mode: 'insensitive' };
        }

        if (dataInicio || dataFim) {
          where.dataEmissao = {};
          if (dataInicio) {
            where.dataEmissao.gte = new Date(dataInicio);
          }
          if (dataFim) {
            where.dataEmissao.lte = new Date(dataFim);
          }
        }

        // ============================================
        // BUSCAR FATURAS COM PAGINAÇÃO
        // ============================================

        const skip = (page - 1) * limit;

        const [faturas, total] = await Promise.all([
          prisma.fatura.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
              dataEmissao: 'desc',
            },
          }),
          prisma.fatura.count({ where }),
        ]);

        // ============================================
        // FORMATAR RESPOSTA
        // ============================================

        const formattedData = faturas.map((fatura) => ({
          ...fatura,
          dataEmissao: fatura.dataEmissao.toISOString(),
          dataVencimento: fatura.dataVencimento?.toISOString() || null,
          created_at: fatura.created_at.toISOString(),
          updated_at: fatura.updated_at.toISOString(),
        }));

        return res.status(200).send({
          data: formattedData,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });

      } catch (error: any) {
        console.error('❌ Erro ao buscar faturas:', error);
        
        return res.status(500).send({
          error: 'Erro interno do servidor',
          message: error.message || 'Falha ao buscar faturas',
        });
      }
    }
  );
};