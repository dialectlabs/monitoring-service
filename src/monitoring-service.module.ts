import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { DialectDataSource } from './dialect-data-source';
import {
  MonitorFactory,
  MonitorsFactoryPropsProvider,
} from './monitor-factory';
import { Monitors } from '@dialectlabs/monitor';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: MonitorFactory,
      useValue: Monitors.factory(
        MonitorsFactoryPropsProvider.createMonitorFactoryProps(),
      ),
    },
    DialectDataSource,
    MonitoringService,
  ],
})
export class MonitoringServiceModule {}
