import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prismaclient";

// ============================================
// SCHEMA DE VALIDAÇÃO
// ============================================

const faturaItemSchema = z.object({
  codigo: z.string().optional(),
  descricao: z.string(),
  quantidade: z.number().positive(),
  precoUnitario: z.number().positive(),
  desconto: z.number().default(0),
  valor: z.number().positive(),
  imposto: z.number().default(0),
  total: z.number().positive(),
  taxaIVA: z.number().default(14),
});

const faturaSchema = z.object({
  numero: z.string(),
  dataEmissao: z.string().datetime(),
  cliente: z.object({
    nome: z.string(),
    nif: z.string().optional(),
    endereco: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().optional(),
    codigoCliente: z.string().optional(),
  }),
  empresa: z.object({
    nome: z.string(),
    nif: z.string(),
    endereco: z.string(),
    telefone: z.string(),
    email: z.string().optional(),
  }),
  itens: z.array(faturaItemSchema),
  totais: z.object({
    semImpostos: z.number(),
    impostos: z.number(),
    descontos: z.number().default(0),
    totalPagar: z.number().positive(),
  }),
  formaPagamento: z.string(),
  operador: z.string(),
  operadorId: z.string().optional(),
  hashFiscal: z.string().optional(),
  qrCodeData: z.string().optional(),
  statusAGT: z.enum(["PENDENTE", "ENVIADO", "ERRO"]).default("PENDENTE"),
  status: z.enum(["EMITIDA", "CANCELADA", "PAGA"]).default("EMITIDA"),
});

// ============================================
// ROTA DE CRIAÇÃO DE FATURA
// ============================================

export const CreateFatura = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/fatura/create',
    {
      schema: {
        body: faturaSchema,
        response: {
          201: z.object({
            id: z.string(),
            numero: z.string(),
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
        const body = req.body;

        // 🔍 Log para debug
        console.log('📦 Criando fatura:', JSON.stringify(body, null, 2));

        // ============================================
        // SALVAR FATURA NO BANCO DE DADOS
        // ============================================

        const fatura = await prisma.fatura.create({
          data: {
            numero: body.numero,
            dataEmissao: new Date(body.dataEmissao),
            clienteNome: body.cliente.nome,
            clienteNif: body.cliente.nif,
            clienteEndereco: body.cliente.endereco,
            clienteTelefone: body.cliente.telefone,
            clienteEmail: body.cliente.email,
            clienteCodigo: body.cliente.codigoCliente,
            empresaNome: body.empresa.nome,
            empresaNif: body.empresa.nif,
            empresaEndereco: body.empresa.endereco,
            empresaTelefone: body.empresa.telefone,
            empresaEmail: body.empresa.email,
            itens: body.itens as any, // Será armazenado como JSON
            semImpostos: body.totais.semImpostos,
            impostos: body.totais.impostos,
            descontos: body.totais.descontos || 0,
            totalPagar: body.totais.totalPagar,
            formaPagamento: body.formaPagamento,
            operador: body.operador,
            operadorId: body.operadorId,
            hashFiscal: body.hashFiscal,
            qrCodeData: body.qrCodeData,
            statusAGT: body.statusAGT || "PENDENTE",
            status: body.status || "EMITIDA",
          },
        });

        console.log('✅ Fatura criada com sucesso:', fatura.id);

        return res.status(201).send({
          id: fatura.id,
          numero: fatura.numero,
          message: "Fatura criada com sucesso!",
        });

      } catch (error: any) {
        console.error('❌ Erro ao criar fatura:', error);

        // Verificar se é erro de unique constraint
        if (error.code === 'P2002') {
          return res.status(409).send({
            error: 'Fatura já existe',
            message: `Já existe uma fatura com o número: ${error.meta?.target}`,
          });
        }

        return res.status(500).send({
          error: 'Erro interno do servidor',
          message: error.message || 'Falha ao criar fatura',
        });
      }
    }
  );
};