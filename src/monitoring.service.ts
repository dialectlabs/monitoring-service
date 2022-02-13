import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Monitors, Pipelines } from '@dialectlabs/monitor';
import { DialectConnection } from './dialect-connection';

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly dialectConnection: DialectConnection) {}

  onModuleInit() {
    const monitor = Monitors.builder({
      monitorKeypair: this.dialectConnection.getKeypair(),
      dialectProgram: this.dialectConnection.getProgram(),
    })
      .subscriberEvents()
      .transform({
        keys: ['state'],
        pipelines: [
          Pipelines.notifyNewSubscribers({
            messageBuilder: () =>
              'Welcome to Dialect. This is an example of how you can receive notifications for events that happen on chain. In this case, the creation of a notification thread with Dialect.',
          }),
        ],
      })
      .dispatch('unicast')
      .build();
    monitor.start();
  }

  async onModuleDestroy() {
    await Monitors.shutdown();
  }
}
