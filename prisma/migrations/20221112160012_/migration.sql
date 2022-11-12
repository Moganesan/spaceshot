/*
  Warnings:

  - You are about to alter the column `balance` on the `players` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `players` MODIFY `balance` DOUBLE NOT NULL;
