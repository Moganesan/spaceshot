/*
  Warnings:

  - You are about to drop the column `pid` on the `whitelistedPlayers` table. All the data in the column will be lost.
  - Added the required column `walletAddress` to the `whitelistedPlayers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `whitelistedPlayers` DROP FOREIGN KEY `whitelistedPlayers_pid_fkey`;

-- AlterTable
ALTER TABLE `whitelistedPlayers` DROP COLUMN `pid`,
    ADD COLUMN `walletAddress` VARCHAR(191) NOT NULL;
