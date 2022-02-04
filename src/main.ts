import { NestFactory } from '@nestjs/core';
import { MonitoringServiceModule } from './monitoring-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MonitoringServiceModule, {
    logger: ['log', 'warn', 'error'],
  });

  // TODO: smth hangs in monitor itself, need to gracefully shutdown it
  process.on('SIGINT', function () {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
  });

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
