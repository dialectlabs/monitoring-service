import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(new Date(), req.method, req.url, req.params);
    next();
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const public_key = req.params.public_key;
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        publicKey: public_key,
      },
    });

    if (!wallet)
      throw new HttpException(
        `Invalid wallet public_key ${public_key}. Please check your inputs and try again.`,
        HttpStatus.UNAUTHORIZED,
      );

    res.locals.wallet = wallet;
    next();
  }
}
