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
      sinks: {
        sms: {
          twilioUsername: process.env.TWILIO_ACCOUNT_SID!,
          twilioPassword: process.env.TWILIO_AUTH_TOKEN!,
          senderSmsNumber: process.env.TWILIO_SMS_SENDER!,
        },
        email: {
          apiToken: process.env.SENDGRID_KEY!,
          senderEmaiwl: process.env.SENDGRID_EMAIL!,
        },
        telegram: {
          telegramBotToken: process.env.TELEGRAM_TOKEN!,
        }
      },
      web2SubscriberRepositoryUrl: process.env.POSTGRES_BASE_URL,
    })
    .subscriberEvents() // TODO - is hacky version to write a new version of this step? To get SubscriberInfo
    .transform<SubscriberState, SubscriberState>({
      keys: ['state'],
      pipelines: [Pipelines.notifyNewSubscribers()],
    })
    .notify()
    .dialectThread(({ value }) => ({
      message: `Say hello to the future of web3 messaging. Thanks for subscribing to Dialect notifications!`,
    }))
    .email(({ value }) => ({
      subject: 'Hello from Dialect',
      text: `Say hello to the future of web3 messaging. Thanks for subscribing to Dialect notifications!`,
    }))
    .sms(({ value }) => ({
      body: `Say hello to the future of web3 messaging. Thanks for subscribing to Dialect notifications!`,
    }))
    .telegram(({ value }) => ({
      body: `Say hello to the future of web3 messaging. Thanks for subscribing to Dialect notifications!`,
    }))
    .and()
    .dispatch('unicast')
    .build();
    monitor.start();
  }

  async onModuleDestroy() {
    await Monitors.shutdown();
  }
}
