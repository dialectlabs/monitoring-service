import {
  EventDetectionPipeline,
  Monitor,
  MonitorFactory as IMonitorFactory,
  ParameterId,
  PollableDataSource,
  SubscriberEvent,
} from '@dialectlabs/monitor';
import { MonitorFactoryProps } from '@dialectlabs/monitor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { idl, programs, Wallet_ } from '@dialectlabs/web3';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { Duration } from 'luxon';

export abstract class MonitorFactory implements IMonitorFactory {
  abstract createSubscriberEventMonitor(
    eventDetectionPipelines: EventDetectionPipeline<SubscriberEvent>[],
  ): Monitor<SubscriberEvent>;

  abstract createUnicastMonitor<T>(
    dataSource: PollableDataSource<T>,
    eventDetectionPipelines: Record<ParameterId, EventDetectionPipeline<T>[]>,
    pollInterval: Duration,
  ): Monitor<T>;
}

export class MonitorsFactoryPropsProvider {
  static createMonitorFactoryProps(): MonitorFactoryProps {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const keypair: Keypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(PRIVATE_KEY as string)),
    );
    const wallet = Wallet_.embedded(keypair.secretKey);
    const dialectConnection = new Connection(
      process.env.RPC_URL || 'http://localhost:8899',
      'recent',
    );
    const dialectProvider = new Provider(
      dialectConnection,
      wallet,
      Provider.defaultOptions(),
    );
    const dialectProgram = new Program(
      idl as Idl,
      new PublicKey(programs['localnet'].programAddress),
      dialectProvider,
    );
    return {
      dialectProgram,
      monitorKeypair: keypair,
    };
  }
}
