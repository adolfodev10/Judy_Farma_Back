import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

// ============================================
// SCHEMA DE VALIDAÇÃO
// ============================================

const getFaturaByIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const getFaturaByIdResponseSchema = z.object({
  id: z.string(),
  numero: z.string(),
  dataEmissao: z.string().datetime(),
  dataVencimento: z.string().datetime().nullable(),
  cliente: z.object({
    nome: z.string(),
    nif: z.string().nullable(),
    endereco: z.string().nullable(),
    telefone: z.string().nullable(),
    email: z.string().nullable(),
    codigoCliente: z.string().nullable(),
  }),
  empresa: z.object({
    nome: z.string(),
    nif: z.string(),
    endereco: z.string(),
    telefone: z.string(),
    email: z.string().nullable(),
    regimeIVA: z.string().nullable(),
    codigoEstabelecimento: z.string().nullable(),
  }),
  itens: z.any(),
  totais: z.object({
    semImpostos: z.number(),
    impostos: z.number(),
    descontos: z.number(),
    totalPagar: z.number(),
  }),
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

// ============================================
// ROTA GET - BUSCAR FATURA POR ID
// ============================================

export const GetFaturaById = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/fatura/:id',
    {
      schema: {
        params: getFaturaByIdParamsSchema,
        response: {
          200: getFaturaByIdResponseSchema,
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
        const { id } = req.params;

        const fatura = await prisma.fatura.findUnique({
          where: { id },
        });

        if (!fatura) {
          return res.status(404).send({
            error: 'Fatura não encontrada',
            message: `Fatura com ID ${id} não foi encontrada`,
          });
        }

        // ============================================
        // FORMATAR RESPOSTA
        // ============================================

        const formattedResponse = {
          id: fatura.id,
          numero: fatura.numero,
          dataEmissao: fatura.dataEmissao.toISOString(),
          dataVencimento: fatura.dataVencimento?.toISOString() || null,
          cliente: {
            nome: fatura.clienteNome,
            nif: fatura.clienteNif || null,
            endereco: fatura.clienteEndereco || null,
            telefone: fatura.clienteTelefone || null,
            email: fatura.clienteEmail || null,
            codigoCliente: fatura.clienteCodigo || null,
          },
          empresa: {
            nome: fatura.empresaNome,
            nif: fatura.empresaNif,
            endereco: fatura.empresaEndereco,
            telefone: fatura.empresaTelefone,
            email: fatura.empresaEmail || null,
            regimeIVA: fatura.empresaRegimeIVA || null,
            codigoEstabelecimento: fatura.empresaCodigoEstabelecimento || null,
          },
          itens: fatura.itens,
          totais: {
            semImpostos: fatura.semImpostos,
            impostos: fatura.impostos,
            descontos: fatura.descontos || 0,
            totalPagar: fatura.totalPagar,
          },
          formaPagamento: fatura.formaPagamento,
          operador: fatura.operador,
          operadorId: fatura.operadorId || null,
          hashFiscal: fatura.hashFiscal || null,
          qrCodeData: fatura.qrCodeData || null,
          status: fatura.status,
          statusAGT: fatura.statusAGT,
          observacoes: fatura.observacoes || null,
          created_at: fatura.created_at.toISOString(),
          updated_at: fatura.updated_at.toISOString(),
        };

        return res.status(200).send(formattedResponse);

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