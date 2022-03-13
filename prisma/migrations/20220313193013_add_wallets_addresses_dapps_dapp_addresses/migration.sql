-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public_key" TEXT NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "walletId" UUID NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dapps" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "dapps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dapp_addresses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL,
    "addressId" UUID NOT NULL,
    "dappId" UUID NOT NULL,

    CONSTRAINT "dapp_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_public_key_key" ON "wallets"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "Address_walletId_type_unique_constraint" ON "addresses"("walletId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "dapps_name_key" ON "dapps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DappAddress_addressId_dappId_unique_constraint" ON "dapp_addresses"("addressId", "dappId");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_addresses" ADD CONSTRAINT "dapp_addresses_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_addresses" ADD CONSTRAINT "dapp_addresses_dappId_fkey" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
