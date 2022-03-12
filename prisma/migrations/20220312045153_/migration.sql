/*
  Warnings:

  - You are about to drop the `dapp_web2_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `web2_entities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dapp_web2_entries" DROP CONSTRAINT "dapp_web2_entries_dappId_fkey";

-- DropForeignKey
ALTER TABLE "dapp_web2_entries" DROP CONSTRAINT "dapp_web2_entries_web2AddressId_fkey";

-- DropForeignKey
ALTER TABLE "web2_entities" DROP CONSTRAINT "web2_entities_walletId_fkey";

-- DropTable
DROP TABLE "dapp_web2_entries";

-- DropTable
DROP TABLE "web2_entities";

-- CreateTable
CREATE TABLE "web2_addresses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "walletId" UUID NOT NULL,

    CONSTRAINT "web2_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dapp_web2_addresses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL,
    "web2AddressId" UUID NOT NULL,
    "dappId" UUID NOT NULL,

    CONSTRAINT "dapp_web2_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Web2Address_walletId_key_unique_constraint" ON "web2_addresses"("walletId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "DappWeb2Address_web2AddressId_dappId_unique_constraint" ON "dapp_web2_addresses"("web2AddressId", "dappId");

-- AddForeignKey
ALTER TABLE "web2_addresses" ADD CONSTRAINT "web2_addresses_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_web2_addresses" ADD CONSTRAINT "dapp_web2_addresses_web2AddressId_fkey" FOREIGN KEY ("web2AddressId") REFERENCES "web2_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_web2_addresses" ADD CONSTRAINT "dapp_web2_addresses_dappId_fkey" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
