/*
  Warnings:

  - A unique constraint covering the columns `[pid]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `sessions_token_key` ON `sessions`;

-- CreateIndex
CREATE UNIQUE INDEX `sessions_pid_key` ON `sessions`(`pid`);
