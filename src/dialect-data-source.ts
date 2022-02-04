import {
  DataPackage,
  DataSourceMetadata,
  PollableDataSource,
  ResourceId,
} from '@dialectlabs/monitor';

const DATASOURCE_METADATA: DataSourceMetadata = {
  id: 'Dialect',
  parameters: [],
};

export class DialectDataSource implements PollableDataSource<number> {
  async connect(): Promise<DataSourceMetadata> {
    return Promise.resolve(DATASOURCE_METADATA);
  }

  disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async extract(subscribers: ResourceId[]): Promise<DataPackage<number>> {
    return [];
  }
}
