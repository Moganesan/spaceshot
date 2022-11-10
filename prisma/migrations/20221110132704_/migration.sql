/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `players` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `players_walletAddress_key` ON `players`(`walletAddress`);
