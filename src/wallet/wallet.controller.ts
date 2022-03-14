import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { AddressDto, DappAddressDto, PostAddressDto, PostDappAddressDto, PutAddressDto, PutDappAddressDto } from "./wallet.controller.dto";

@ApiTags('Wallets')
@Controller({
  path: 'wallets',
  version: '0',
})
export class WalletController {
  constructor(private readonly prisma: PrismaService) {}

  /*
  Addresses
  */

  // Create an address
  @Post(':public_key/addresses')
  async post_address(@Param('public_key') public_key: string, @Body() postAddressDto: PostAddressDto): Promise<AddressDto> {
    const type = postAddressDto.type;
    const value = postAddressDto.value;

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

    let address;
    try {
      address = await this.prisma.address.create({
        data: {
          type,
          value,
          walletId: wallet.id,
        }
      });
    } catch (e: any) {
      console.log('e', e);
      if (e?.message?.includes('Unique constraint failed')) throw new HttpException(`Wallet ${public_key} already has a ${type} address on file. Use PUT method instead.`, HttpStatus.BAD_REQUEST)
      throw new HttpException('Something went wrong, please try again or contact support at hello@dialect.to.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      id: address.id,
      type: address.type,
      verified: address.verified,
    }
  }

  // Update an address
  @Put(':public_key/addresses/:id')
  async put_address(@Param('public_key') public_key: string, @Param('id') id: string, @Body() putAddressDto: PutAddressDto): Promise<AddressDto> {
    const value = putAddressDto.value;
    if (!value) throw new HttpException('You must provide a valid address value. None provided.', HttpStatus.BAD_REQUEST);

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
    
    // TODO: Ensure this can't be done by non-owner.
    await this.prisma.address.updateMany({
      where: {
        id,
        walletId: wallet.id,
      },
      data: {
        value,
      },
    });

    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) throw new HttpException(`Address ${id} not found. Check your inputs and try again.`, HttpStatus.NOT_FOUND);

    return {
      id: address.id,
      type: address.type,
      verified: address.verified,
    };
  }

  // Delete an address. N.b. this will delete all corresponding dapp address configurations.
  @Delete(':public_key/addresses/:id')
  async delete(@Param('public_key') public_key: string, @Param('id') id: string) { // TODO: Resolve return type
    // Delete *ALL* dappAddresses associated with a given address
    await this.prisma.dappAddress.deleteMany({
      where: {
        addressId: id,
      }
    });

    // Delete address
    // TODO: Support record does not exist failure
    await this.prisma.address.delete({
      where: {
        id,
      }
    });
  }

  /*
  Dapp Addresses
  */

  // Get a list of addresses on file for a given dapp. N.b. this only returns the type (e.g. 'email'), and whether it's verified and enabled; it does *NOT* return the value (e.g. 'chris@dialect.to').
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
      id: dappAddress.id,
      addressId: dappAddress.address.id,
      type: dappAddress.address.type,
      verified: dappAddress.address.verified,
      dapp: dappAddress.dapp.name,
      enabled: dappAddress.enabled,
    }));
  }

  // Create a dapp address, enable it for a specific dapp.
  @Post(':public_key/dapps/:dapp/addresses')
  async post(@Param('public_key') public_key: string, @Param('dapp') dapp: string, @Body() postDappAddressDto: PostDappAddressDto): Promise<DappAddressDto> {
    const enabled = postDappAddressDto.enabled;
    const addressId = postDappAddressDto.addressId;
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

    // TODO: Move to middleware
    // Dapp must already exist
    const dapp_ = await this.prisma.dapp.findUnique({
      where: {
        name: dapp,
      }
    });
    if (!dapp_) throw new HttpException(`Unrecognized dapp '${dapp}'. Please provide a valid dapp and try again`, HttpStatus.BAD_REQUEST);

    const addresses = await this.prisma.address.findMany({
      where: {
        id: addressId,
        walletId: wallet.id,
      }
    });

    if (addresses.length < 1) throw new HttpException(`Could not find address ${addressId} for wallet ${wallet.publicKey}. Check your inputs and try again.`, HttpStatus.BAD_REQUEST);

    const dappAddress = await this.prisma.dappAddress.create({
      data: {
        enabled: postDappAddressDto.enabled,
        dappId: dapp_.id,
        addressId,
      },
      include: {
        address: true,
        dapp: true,
      }
    });

    return {
      id: dappAddress.id,
      addressId: dappAddress.address.id,
      type: dappAddress.address.type,
      verified: dappAddress.address.verified,
      dapp: dapp_.name,
      enabled: dappAddress.enabled,
    };
  }

  // Update a dapp address by enabling or disabling it
  @Put(':public_key/dapps/:dapp/addresses/:id')
  async put(@Param('public_key') public_key: string, @Param('dapp') dapp: string, @Param('id') id: string, @Body() putDappAddressDto: PutDappAddressDto): Promise<DappAddressDto> {
    const enabled = putDappAddressDto.enabled;

    // TODO: Retire to auth middleware
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        publicKey: public_key,
      }
    });

    if (!wallet) throw new HttpException(`Invalid wallet public_key ${public_key}. Please check your inputs and try again.`, HttpStatus.UNAUTHORIZED);

    let dappAddress = await this.prisma.dappAddress.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        dapp: true,
      }
    });

    if (dappAddress?.address.walletId !== wallet.id) throw new HttpException(`Could not find dapp address ${id} owned by wallet ${wallet.publicKey}.`, HttpStatus.BAD_REQUEST);

    dappAddress = await this.prisma.dappAddress.update({
      where: {
        id,
      },
      data: {
        enabled,
      },
      include: {
        address: true,
        dapp: true,
      }
    });

    return {
      id: dappAddress.id,
      addressId: dappAddress.address.id,
      type: dappAddress.address.type,
      verified: dappAddress.address.verified,
      dapp: dappAddress.dapp.name,
      enabled: dappAddress.enabled,
    }
  }
}
