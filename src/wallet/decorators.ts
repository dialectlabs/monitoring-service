import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Dapp as DappDb, Wallet as WalletDb } from '@prisma/client';

export type RequestScopedDApp = Request & { dapp: DappDb };

export const InjectDapp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestScopedDApp>();
    return request.dapp;
  },
);

export type RequestScopedWallet = Request & { wallet: WalletDb };

export const InjectWallet = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestScopedWallet>();
    return request.wallet;
  },
);
