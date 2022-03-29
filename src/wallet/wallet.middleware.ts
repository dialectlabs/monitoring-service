import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
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
    const singerPublicKey = AuthMiddleware.requireValidPublicKey(
      req.params.public_key,
    );
    const authToken = req.headers['authorization'];
    if (!authToken) {
      throw new UnauthorizedException('fdsafas');
    }
    AuthMiddleware.checkTokenValid(authToken, singerPublicKey);
    req.wallet = await this.upsertWallet(singerPublicKey);
    next();
  }

  private upsertWallet(publicKey: PublicKey) {
    return this.prisma.wallet.upsert({
      where: {
        publicKey: publicKey.toBase58(),
      },
      create: {
        publicKey: publicKey.toBase58(),
      },
      update: {},
    });
  }

  private static requireValidPublicKey(publicKey: string) {
    try {
      return new PublicKey(publicKey);
    } catch (e: any) {
      throw new BadRequestException(
        `Invalid format wallet public_key ${publicKey}, please check your inputs and try again.`,
      );
    }
  }

  private static checkTokenValid(
    authToken: string,
    signerPublicKey: PublicKey,
  ) {
    const expiresAtUtcMs = this.extractExpirationTime(authToken);
    const signature = this.extractSignature(authToken);
    this.validateSignature(expiresAtUtcMs, signature, signerPublicKey);

    const nowUtcMs = new Date().getTime();
    if (expiresAtUtcMs > nowUtcMs) {
      throw new UnauthorizedException('Token expired');
    }
  }

  private static validateSignature(
    expiresAtUtcMs: number,
    signature: Uint8Array,
    signerPublicKey: PublicKey,
  ) {
    try {
      const dateEncoded = new TextEncoder().encode(
        btoa(JSON.stringify(expiresAtUtcMs)),
      );
      const signatureVerified = nacl.sign.detached.verify(
        dateEncoded,
        signature,
        signerPublicKey.toBytes(),
      );
      if (!signatureVerified) {
        throw new UnauthorizedException('Signature verification failed');
      }
    } catch (e: any) {
      throw new UnauthorizedException('Signature verification failed');
    }
  }

  private static extractSignature(authToken: string) {
    try {
      return base64ToUint8(authToken.split('.')[1] || '');
    } catch (e: any) {
      throw new UnauthorizedException('Signature verification failed');
    }
  }

  private static extractExpirationTime(authToken: string) {
    try {
      return parseInt(authToken.split('.')[0], 10);
    } catch (e: any) {
      throw new UnauthorizedException('Signature verification failed');
    }
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
