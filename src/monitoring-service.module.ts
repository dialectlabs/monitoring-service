import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { DialectConnection } from './dialect-connection';

@Module({
  controllers: [],
  providers: [
    {
      provide: DialectConnection,
      useValue: DialectConnection.initialize(),
    },
    MonitoringService,
  ],
})
export class MonitoringServiceModule {}
