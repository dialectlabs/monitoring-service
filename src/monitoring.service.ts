import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DialectDataSource } from './dialect-data-source';
import { Monitor } from '@dialectlabs/monitor';
import { MonitorFactory } from './monitor-factory';

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  private readonly monitors: Monitor<any>[] = [];

  constructor(
    private readonly monitorFactory: MonitorFactory,
    private readonly dialectDataSource: DialectDataSource,
  ) {}

  onModuleInit() {}

  async onModuleDestroy() {
    await Promise.all(this.monitors.map((it) => it.stop()));
  }
}
