-- CreateTable
CREATE TABLE `players` (
    `id` VARCHAR(191) NOT NULL,
    `walletAddress` VARCHAR(191) NOT NULL,
    `balance` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
