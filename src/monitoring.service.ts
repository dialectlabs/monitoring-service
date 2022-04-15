import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Monitors, Pipelines, SubscriberState } from '@dialectlabs/monitor';
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
    .transform<SubscriberState, SubscriberState>({
      keys: ['state'],
      pipelines: [Pipelines.notifyNewSubscribers()],
    })
    .notify()
    .and()
    .dispatch('unicast')
    .build();
    monitor.start();
  }

  async onModuleDestroy() {
    await Monitors.shutdown();
  }
}
