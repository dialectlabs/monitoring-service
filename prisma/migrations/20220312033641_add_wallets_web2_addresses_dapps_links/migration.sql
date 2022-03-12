-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public_key" TEXT NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web2_entities" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "walletId" UUID NOT NULL,

    CONSTRAINT "web2_entities_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "dapp_web2_entries" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL,
    "web2AddressId" UUID NOT NULL,
    "dappId" UUID NOT NULL,

    CONSTRAINT "dapp_web2_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_public_key_key" ON "wallets"("public_key");

-- CreateIndex
CREATE UNIQUE INDEX "Web2Address_walletId_key_unique_constraint" ON "web2_entities"("walletId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "dapps_name_key" ON "dapps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DappWeb2Entry_web2AddressId_dappId_unique_constraint" ON "dapp_web2_entries"("web2AddressId", "dappId");

-- AddForeignKey
ALTER TABLE "web2_entities" ADD CONSTRAINT "web2_entities_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_web2_entries" ADD CONSTRAINT "dapp_web2_entries_web2AddressId_fkey" FOREIGN KEY ("web2AddressId") REFERENCES "web2_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapp_web2_entries" ADD CONSTRAINT "dapp_web2_entries_dappId_fkey" FOREIGN KEY ("dappId") REFERENCES "dapps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
