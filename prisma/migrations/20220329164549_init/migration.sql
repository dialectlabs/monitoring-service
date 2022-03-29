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
    "wallet_id" UUID NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dapps" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public_key" TEXT NOT NULL,

    CONSTRAINT "dapps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dapp_addresses" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL,
    "address_id" UUID NOT NULL,
    "dapp_id" UUID NOT NULL,

    CONSTRAINT "dapp_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_public_key_key" ON "wallets"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_wallet_id_type_key" ON "addresses"("wallet_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "dapps_public_key_key" ON "dapps"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "dapp_addresses_address_id_dapp_id_key" ON "dapp_addresses"("address_id", "dapp_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_addresses" ADD CONSTRAINT "dapp_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_addresses" ADD CONSTRAINT "dapp_addresses_dapp_id_fkey" FOREIGN KEY ("dapp_id") REFERENCES "dapps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
