import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { idl, programs, Wallet_ } from '@dialectlabs/web3';

export abstract class DialectConnection {
  abstract getKeypair(): Keypair;

  abstract getProgram(): Program;

  static initialize(): DialectConnection {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const keypair: Keypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(PRIVATE_KEY as string)),
    );
    const wallet = Wallet_.embedded(keypair.secretKey);
    const RPC_URL = process.env.RPC_URL || 'http://localhost:8899';
    console.log('RPC url', RPC_URL);
    const dialectConnection = new Connection(RPC_URL, 'recent');
    const dialectProvider = new Provider(
      dialectConnection,
      wallet,
      Provider.defaultOptions(),
    );
    // @ts-ignore
    const NETWORK_NAME: 'mainnet-beta' | 'devnet' | 'localnet' =
      process.env.NETWORK_NAME || 'localnet';

    const network_key: 'mainnet' | 'devnet' | 'localnet' =
      NETWORK_NAME === 'mainnet-beta' ? 'mainnet' : NETWORK_NAME;
    console.log('Network name', NETWORK_NAME);
    const DIALECT_PROGRAM_ADDRESS = programs[network_key].programAddress;
    const program = new Program(
      idl as Idl,
      new PublicKey(DIALECT_PROGRAM_ADDRESS),
      dialectProvider,
    );
    return new DialectConnectionImpl(keypair, program);
  }
}

export class DialectConnectionImpl {
  constructor(
    private readonly keypair: Keypair,
    private readonly program: Program,
  ) {}

  getKeypair(): Keypair {
    return this.keypair;
  }

  getProgram(): Program {
    return this.program;
  }
}
