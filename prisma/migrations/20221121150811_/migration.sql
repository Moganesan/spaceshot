/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `whitelistedPlayers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `whitelistedPlayers_walletAddress_key` ON `whitelistedPlayers`(`walletAddress`);
