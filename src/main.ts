import { NestFactory } from '@nestjs/core';
import { MonitoringServiceModule } from './monitoring-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MonitoringServiceModule, {
    logger: ['log', 'warn', 'error'],
  });

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
