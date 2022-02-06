import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DialectDataSource } from './dialect-data-source';
import { MonitorFactory } from './monitor-factory';
import {
  Monitors,
  EventDetectionPipeline,
  Operators,
  PipeLogLevel,
  SubscriberEvent,
} from '@dialectlabs/monitor';

export const welcomeMessagePipeline: EventDetectionPipeline<SubscriberEvent> = (
  source,
) =>
  source
    .pipe(Operators.Utility.log(PipeLogLevel.INFO))
    .pipe(
      Operators.Transform.filter(
        ({ parameterData: { data } }) => data === 'added',
      ),
    )
    .pipe(
      Operators.Event.info(
        'Welcome',
        () =>
          `Welcome to Dialect. This is an example of how you can receive notifications for events that happen on chain. In this case, the creation of a notification thread with Dialect.`,
      ),
    );

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly monitorFactory: MonitorFactory,
    private readonly dialectDataSource: DialectDataSource,
  ) {}

  onModuleInit() {
    const monitor = this.monitorFactory.createSubscriberEventMonitor([
      welcomeMessagePipeline,
    ]);
    monitor.start();
  }

  async onModuleDestroy() {
    await Monitors.shutdown();
  }
}
