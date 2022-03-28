import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Dapp } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import { NextFunction, Request, Response } from 'express';
import nacl from 'tweetnacl';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestScopedDApp, RequestScopedWallet } from './decorators';

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
  async use(req: RequestScopedWallet, res: Response, next: NextFunction) {
    let public_key: PublicKey;
    try {
      public_key = new PublicKey(req.params.public_key);
    } catch (e: any) {
      throw new HttpException(
        `Invalid format wallet public_key ${req.params.public_key}, please check your inputs and try again.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let expirationTime: number;
    try {
      expirationTime = parseInt(
        (req.headers['authorization'] as string).split('.')[0],
        10,
      );
    } catch (e: any) {
      throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
    }

    let signature: Uint8Array;
    try {
      signature = base64ToUint8(
        (req.headers['authorization'] as string).split('.')[1] || '',
      );
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

    if (!wallet)
      throw new HttpException(
        `Invalid wallet public_key ${public_key.toBase58()}. Please check your inputs and try again.`,
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const dateEncoded = new TextEncoder().encode(
        btoa(JSON.stringify(expirationTime)),
      );
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

    req.wallet = wallet;
    next();
  }
}

@Injectable()
export class DappMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: RequestScopedDApp, res: Response, next: NextFunction) {
    const dapp = req.params.dapp;
    try {
      new PublicKey(dapp);
    } catch (e: any) {
      throw new HttpException(
        `Invalid format dapp public_key ${dapp}, please check your inputs and try again.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const dapp_: Dapp | null = await this.prisma.dapp.findUnique({
      where: {
        publicKey: dapp,
      },
    });
    if (!dapp_)
      throw new HttpException(
        `Unrecognized dapp '${dapp}'. Please provide a valid dapp and try again`,
        HttpStatus.BAD_REQUEST,
      );
    req.dapp = dapp_;
    next();
  }
}
