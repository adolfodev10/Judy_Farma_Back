/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `client_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `funcao` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `venda` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `venda` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `venda` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `venda` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_validate` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `born` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funcao_id` to the `Users` table without a default value. This is not possible if the table is not empty.
  - The required column `id_user` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `senha` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `product_id` to the `Venda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clients` DROP FOREIGN KEY `Clients_invoice_id_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `Products_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_product_id_fkey`;

-- DropIndex
DROP INDEX `Clients_invoice_id_key` ON `clients`;

-- DropIndex
DROP INDEX `Products_client_id_fkey` ON `products`;

-- DropIndex
DROP INDEX `Users_client_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `Users_product_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `clients` DROP COLUMN `invoice_id`;

-- AlterTable
ALTER TABLE `invoices` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `client_id`,
    ADD COLUMN `date_validate` VARCHAR(191) NOT NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('VENDIDO', 'NAO_VENDIDO', 'EXPIRADO', 'VENDENDO') NOT NULL DEFAULT 'NAO_VENDIDO',
    MODIFY `price` VARCHAR(191) NOT NULL,
    MODIFY `quantity` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `client_id`,
    DROP COLUMN `funcao`,
    DROP COLUMN `id`,
    DROP COLUMN `password`,
    DROP COLUMN `product_id`,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `born` DATETIME(3) NOT NULL,
    ADD COLUMN `funcao_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `id_user` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NULL,
    ADD COLUMN `senha` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_status` ENUM('ACTIVO', 'INATIVO') NOT NULL DEFAULT 'ACTIVO',
    MODIFY `email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_user`);

-- AlterTable
ALTER TABLE `venda` DROP COLUMN `date`,
    DROP COLUMN `name`,
    DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `product_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `AvatarImagesHistoric` (
    `id_avatar` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_avatar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcao` (
    `id_funcao` VARCHAR(191) NOT NULL,
    `name_funcao` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVO', 'INATIVO') NOT NULL DEFAULT 'ACTIVO',

    PRIMARY KEY (`id_funcao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stock` (
    `id_stock` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `date_validate` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `status` ENUM('NAO_VENDIDO', 'EXPIRADO') NOT NULL DEFAULT 'NAO_VENDIDO',

    PRIMARY KEY (`id_stock`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Users_phone_number_key` ON `Users`(`phone_number`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_funcao_id_fkey` FOREIGN KEY (`funcao_id`) REFERENCES `Funcao`(`id_funcao`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvatarImagesHistoric` ADD CONSTRAINT `AvatarImagesHistoric_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venda` ADD CONSTRAINT `Venda_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Products`(`id_product`) ON DELETE RESTRICT ON UPDATE CASCADE;
