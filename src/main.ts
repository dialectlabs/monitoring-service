import { NestFactory } from '@nestjs/core';
import { MonitoringServiceModule } from './monitoring-service.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(MonitoringServiceModule, {
    logger: ['log', 'warn', 'error'],
  });

  const config = new DocumentBuilder()
    .setTitle('Monitoring service example')
    .setDescription('Monitoring service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
