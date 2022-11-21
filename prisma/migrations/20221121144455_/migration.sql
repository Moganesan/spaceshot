/*
  Warnings:

  - A unique constraint covering the columns `[pid]` on the table `whitelistedPlayers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `whitelistedPlayers_pid_key` ON `whitelistedPlayers`(`pid`);
