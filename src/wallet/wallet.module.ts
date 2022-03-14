import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletController } from './wallet.controller';

@Module({
  imports: [PrismaModule],
  exports: [],
  controllers: [WalletController],
})
export class WalletModule {}
