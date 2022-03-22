import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Dapp } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestScopedDApp, RequestScopedWallet } from './decorators';

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
    console.log('req.headers', req.headers);
    let public_key: PublicKey;
    try {
      public_key = new PublicKey(req.params.public_key);
    } catch (e: any) {
      throw new HttpException(
        `Invalid format wallet public_key ${req.params.public_key}, please check your inputs and try again.`,
        HttpStatus.BAD_REQUEST,
      );
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

    req.wallet = wallet;
    next();
  }
}

@Injectable()
export class DappMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: RequestScopedDApp, res: Response, next: NextFunction) {
    const dapp = req.params.dapp;
    const dapp_: Dapp | null = await this.prisma.dapp.findUnique({
      where: {
        name: dapp,
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
