import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletController } from './wallet.controller';
import {
  AuthMiddleware,
  DappMiddleware,
  LoggerMiddleware,
} from './wallet.middleware';

@Module({
  imports: [PrismaModule],
  exports: [],
  controllers: [WalletController],
})
export class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(WalletController);
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'wallets/:public_key/dapps/:dapp/addresses',
        method: RequestMethod.GET,
      })
      .forRoutes(WalletController);
    consumer.apply(DappMiddleware).forRoutes('*/dapps/:dapp*');
  }
}
