import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DappAddress } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { DappAddressDto } from "./wallet.controller.dto";

@ApiTags('Wallets')
@Controller({
  path: 'wallets',
  version: '0',
})
export class WalletController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':public_key/:dapp/addresses')
  async get(@Param('public_key') public_key: string, @Param('dapp') dapp: string): Promise<DappAddressDto[]> {
    const dappAddresses = await this.prisma.dappAddress.findMany({
      where: {
        AND: [
          {
            dapp: {
              name: {
                equals: dapp,
              }
            }
          },
          {
            address: {
              wallet: {
                publicKey: {
                  equals: public_key,
                }
              }
            }
          },
        ],
      },
      include: {
        address: true,
        dapp: true,
      }
    });
    return dappAddresses.map((dappAddress) => ({
      key: dappAddress.address.key,
      verified: dappAddress.address.verified,
      dapp: dappAddress.dapp.name,
      enabled: dappAddress.enabled,
    }));
  }
}
