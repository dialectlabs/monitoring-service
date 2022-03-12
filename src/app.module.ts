import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MonitoringServiceModule } from './monitoring-service/monitoring-service.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [PrismaModule, MonitoringServiceModule, WalletModule],
  providers: [],
})
export class AppModule {}
