import helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  app.enableCors();
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configSwagger = new DocumentBuilder()
    .setTitle('Synergy API')
    .setDescription('API for Synergy')
    .setVersion('1.0')
    .addTag('Auth', 'Endpoints for authentication')
    .addTag('Users', 'Endpoints for users management')
    .addTag('Blogs', 'Endpoints for blogs management')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.get<number>('PORT'));
}

bootstrap();
