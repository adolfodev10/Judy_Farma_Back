-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "public"."TableStatus" AS ENUM ('ACTIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('VENDIDO', 'NAO_VENDIDO', 'EXPIRADO', 'VENDENDO');

-- CreateEnum
CREATE TYPE "public"."StockStatus" AS ENUM ('NAO_VENDIDO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "public"."MethodPayment" AS ENUM ('MULTICAIXA_EXPRESS', 'CACHE', 'TPA');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('PAGAS', 'NAO_PAGAS');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "senha" TEXT NOT NULL,
    "avatar" TEXT,
    "born" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "funcao_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVO',
    "invoicesId_invoice" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "public"."AvatarImagesHistoric" (
    "id_avatar" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarImagesHistoric_pkey" PRIMARY KEY ("id_avatar")
);

-- CreateTable
CREATE TABLE "public"."Funcao" (
    "id_funcao" TEXT NOT NULL,
    "name_funcao" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "public"."TableStatus" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Funcao_pkey" PRIMARY KEY ("id_funcao")
);

-- CreateTable
CREATE TABLE "public"."Products" (
    "id_product" TEXT NOT NULL,
    "name_product" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date_validate" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "methodPayment" "public"."MethodPayment" NOT NULL DEFAULT 'CACHE',
    "totalLucro" TEXT,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'NAO_VENDIDO',

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id_product")
);

-- CreateTable
CREATE TABLE "public"."Stock" (
    "id_stock" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date_validate" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "status" "public"."StockStatus" NOT NULL DEFAULT 'NAO_VENDIDO',

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id_stock")
);

-- CreateTable
CREATE TABLE "public"."Clients" (
    "id_client" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "public"."Invoices" (
    "id_invoice" TEXT NOT NULL,
    "client_id" TEXT,
    "product_id" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "approval" "public"."ApprovalStatus" NOT NULL DEFAULT 'NAO_PAGAS',

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id_invoice")
);

-- CreateTable
CREATE TABLE "public"."Venda" (
    "id" TEXT NOT NULL,
    "name_product" TEXT,
    "description" TEXT,
    "methodPayment" "public"."MethodPayment" NOT NULL DEFAULT 'CACHE',
    "date_validate" TIMESTAMP(3) NOT NULL,
    "price" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'NAO_VENDIDO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "date_venda" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_number_key" ON "public"."Users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Invoices_client_id_key" ON "public"."Invoices"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoices_product_id_key" ON "public"."Invoices"("product_id");

-- AddForeignKey
ALTER TABLE "public"."Users" ADD CONSTRAINT "Users_funcao_id_fkey" FOREIGN KEY ("funcao_id") REFERENCES "public"."Funcao"("id_funcao") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvatarImagesHistoric" ADD CONSTRAINT "AvatarImagesHistoric_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoices" ADD CONSTRAINT "Invoices_id_invoice_fkey" FOREIGN KEY ("id_invoice") REFERENCES "public"."Clients"("id_client") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoices" ADD CONSTRAINT "Invoices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."Products"("id_product") ON DELETE CASCADE ON UPDATE CASCADE;
