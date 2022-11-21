-- CreateTable
CREATE TABLE `whitelistedPlayers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `whitelistedPlayers` ADD CONSTRAINT `whitelistedPlayers_pid_fkey` FOREIGN KEY (`pid`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
