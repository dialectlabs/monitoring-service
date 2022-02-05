import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DialectDataSource } from './dialect-data-source';
import { MonitorFactory } from './monitor-factory';
import { Monitors } from '@dialectlabs/monitor';

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly monitorFactory: MonitorFactory,
    private readonly dialectDataSource: DialectDataSource,
  ) {}

  onModuleInit() {}

  async onModuleDestroy() {
    await Monitors.shutdown();
  }
}
