import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
import { NextFunction, Request, Response } from 'express';
import nacl from 'tweetnacl';
import { PrismaService } from 'src/prisma/prisma.service';

function base64ToUint8(string: string): Uint8Array {
  return new Uint8Array(
    atob(string)
      .split('')
      .map(function (c) {
        return c.charCodeAt(0);
      }),
  );
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(new Date(), req.method, req.url, req.params);
    next();
  }
}

// TODO: Consider using https://docs.nestjs.com/guards
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let public_key: PublicKey;
    try {
      public_key = new PublicKey(req.params.public_key);
    } catch (e: any) {
      throw new HttpException(
        `Invalid format wallet public_key ${req.params.public_key}, please check your inputs and try again.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let now: number;
    try {
      now = parseInt(req.headers['x-timestamp'] as string, 10);
    } catch (e: any) {
      throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
    }

    let signature: Uint8Array;
    try {
      signature = base64ToUint8(req.headers['authorization'] || '');
    } catch (e: any) {
      throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
    }

    const wallet = await this.prisma.wallet.upsert({
      where: {
        publicKey: public_key.toBase58(),
      },
      create: {
        publicKey: public_key.toBase58(),
      },
      update: {},
    });

    // const wallet = await this.prisma.wallet.findUnique({
    //   where: {
    //     publicKey: public_key.toBase58(),
    //   },
    // });

    if (!wallet)
      throw new HttpException(
        `Invalid wallet public_key ${public_key.toBase58()}. Please check your inputs and try again.`,
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const dateEncoded = new TextEncoder().encode(btoa(JSON.stringify(now)));
      const signatureVerified = nacl.sign.detached.verify(
        dateEncoded,
        signature,
        public_key.toBytes(),
      );
      if (!signatureVerified) {
        throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
      }
    } catch (e: any) {
      throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
    }

    res.locals.wallet = wallet;
    next();
  }
}

@Injectable()
export class DappMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const dapp = req.params.dapp;
    const dapp_ = await this.prisma.dapp.findUnique({
      where: {
        name: dapp,
      },
    });
    if (!dapp_)
      throw new HttpException(
        `Unrecognized dapp '${dapp}'. Please provide a valid dapp and try again`,
        HttpStatus.BAD_REQUEST,
      );
    res.locals.dapp = dapp_;
    next();
  }
}
