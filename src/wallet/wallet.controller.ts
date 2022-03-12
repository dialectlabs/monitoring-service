import { Body, ConsoleLogger, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { DappAddressDto, DeleteDappAddressDto, PostDappAddressDto, PutDappAddressDto } from "./wallet.controller.dto";

@ApiTags('Wallets')
@Controller({
  path: 'wallets',
  version: '0',
})
export class WalletController {
  constructor(private readonly prisma: PrismaService) {}

  // Get a list of addresses on file for a given dapp. N.b. this only returns the type (e.g. 'email'), and whether it's verified/enabled; it does *NOT* return the value (e.g. 'chris@dialect.to').
  @Get(':public_key/dapps/:dapp/addresses')
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

  // Create an address, and/or enable it for a specific dapp.
  @Post(':public_key/dapps/:dapp/addresses')
  async post(@Param('public_key') public_key: string, @Param('dapp') dapp: string, @Body() postDappAddressDto: PostDappAddressDto): Promise<DappAddressDto> {

    // TODO: TODO: Retire to auth middleware
    const wallet = await this.prisma.wallet.upsert({
      where: {
        publicKey: public_key,
      },
      create: {
        publicKey: public_key,
      },
      update: {},
    });

    let address;
    
    // Address must already exist
    try {
      address = await this.prisma.address.create({
        data: {
          key: postDappAddressDto.key,
          value: postDappAddressDto.value,
          walletId: wallet.id,
        }
      });
    } catch (e: any) {
      console.log('e', e);
      if (e?.message?.includes('Unique constraint failed')) throw new HttpException(`Address ${public_key} already has a ${postDappAddressDto.key} address on file. Use PUT method instead.`, HttpStatus.BAD_REQUEST)
      throw new HttpException('Something went wrong, please try again or contact support at hello@dialect.to', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // TODO: Move to middleware
    // Dapp must already exist
    const dapp_ = await this.prisma.dapp.findUnique({
      where: {
        name: dapp,
      }
    });
    if (!dapp_) throw new HttpException(`Unrecognized dapp '${dapp}'. Please provide a valid dapp and try again`, HttpStatus.BAD_REQUEST);

    const dappAddress = await this.prisma.dappAddress.create({
      data: {
        enabled: postDappAddressDto.enabled,
        dappId: dapp_.id,
        addressId: address.id,
      }
    });

    return {
      key: address.key,
      verified: address.verified,
      dapp: dapp_.name,
      enabled: dappAddress.enabled,
    };
  }

  // Potentially update an address, and enable or disable it for a specific dapp
  @Put(':public_key/dapps/:dapp/addresses')
  async put(@Param('public_key') public_key: string, @Param('dapp') dapp: string, @Body() putDappAddressDto: PutDappAddressDto): Promise<DappAddressDto> {
    const key = putDappAddressDto.key;
    const value = putDappAddressDto.value;
    const enabled = putDappAddressDto.enabled;

    // TODO: Retire to auth middleware
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        publicKey: public_key,
      }
    });

    if (!wallet) throw new HttpException(`Invalid wallet public_key ${public_key}. Please check your inputs and try again.`, HttpStatus.UNAUTHORIZED);

    // Update the address
    let address;
    if (key && value) {
      address = await this.prisma.address.update({
        where: {
          walletId_key: { walletId: wallet.id, key },
        },
        data: {
          key,
          value,
        }
      })
    } else {
      address = await this.prisma.address.findUnique({
        where: {
          walletId_key: { walletId: wallet.id, key }
        }
      })
    }

    if (!address) throw new HttpException(`No ${key} address found for wallet ${public_key}. Check your inputs and try again, or create a ${key} address first.`, HttpStatus.BAD_REQUEST);

    // TODO: Move to middleware
    // Dapp must already exist
    const dapp_ = await this.prisma.dapp.findUnique({
      where: {
        name: dapp,
      }
    });

    if (!dapp_) throw new HttpException(`Unrecognized dapp '${dapp}'. Please provide a valid dapp and try again`, HttpStatus.BAD_REQUEST);

    // Set enabled appropriately
    console.log('dapp_', dapp_);
    console.log('address', address);
    const dappAddress = await this.prisma.dappAddress.update({
      where: {
        addressId_dappId: { addressId: address.id, dappId: dapp_.id }
      },
      data: {
        enabled,
      }
    });

    return {
      key: address.key,
      verified: address.verified,
      dapp: dapp_.name,
      enabled: dappAddress.enabled,
    }
  }

  // Delete an address. N.b. this will delete all corresponding dapp address configurations.
  @Delete(':public_key/dapps/:dapp/addresses')
  async delete(@Param('public_key') public_key: string, @Param('dapp') dapp: string, @Body() deleteDappAddressDto: DeleteDappAddressDto) { // TODO: Resolve return type
    const key = deleteDappAddressDto.key;

    // TODO: Retire to auth middleware
    const wallet = await this.prisma.wallet.upsert({
      where: {
        publicKey: public_key,
      },
      create: {
        publicKey: public_key,
      },
      update: {},
    });

    if (!wallet) throw new HttpException(`Invalid wallet public_key ${public_key}. Please check your inputs and try again.`, HttpStatus.UNAUTHORIZED);

    // TODO: Move to middleware
    // Dapp must already exist
    const dapp_ = await this.prisma.dapp.findUnique({
      where: {
        name: dapp,
      }
    });

    if (!dapp_) throw new HttpException(`Unrecognized dapp '${dapp}'. Please provide a valid dapp and try again`, HttpStatus.BAD_REQUEST);

    const address = await this.prisma.address.findUnique({
      where: {
        walletId_key: { walletId: wallet.id, key }
      }
    });

    if (!address) throw new HttpException(`No ${key} address found for wallet ${public_key}. Check your inputs and try again.`, HttpStatus.BAD_REQUEST);

    // Delete *ALL* dappAddresses associated with a given address
    await this.prisma.dappAddress.deleteMany({
      where: {
        addressId: address.id,
      }
    });

    // Delete address
    await this.prisma.address.delete({
      where: {
        walletId_key: { walletId: wallet.id, key }
      }
    });
  }
}
