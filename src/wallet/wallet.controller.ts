import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { DappWeb2AddressDto } from "./wallet.controller.dto";

@ApiTags('Wallet')
@Controller({
  path: 'wallets',
  version: '0',
})
export class WalletController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':public_key/:dapp/dqpp_web2_addresses')
  async get(public_key: string, dapp: string): Promise<DappWeb2AddressDto[]> {
    const dappWeb2Addresses = await this.prisma.dappWeb2Address.findMany({
      where: {
        AND: [
          {
            dapp: {
              name: {
                equals: dapp,
              },
            },
          },
          {
            web2Address: {
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
        web2Address: true,
        dapp: true,
      }
    });
    return dappWeb2Addresses.map((address) => ({
      key: address.web2Address.key,
      verified: address.web2Address.verified,
      dapp: address.dapp.name,
      enabled: address.enabled,
    }));
  }
}
