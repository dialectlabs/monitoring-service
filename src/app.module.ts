import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MonitoringServiceModule } from './monitoring-service/monitoring-service.module';
import { UserExampleModule } from './user-example/user-example.module';

@Module({
  imports: [PrismaModule, MonitoringServiceModule, UserExampleModule],
  providers: [],
})
export class AppModule {}
