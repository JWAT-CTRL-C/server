import helmet from 'helmet';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import * as winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Synergy Server', {
              colors: true,
              prettyPrint: true,
              processId: true,
            }),
          ),
        }),
        new DailyRotateFile({
          filename: 'application-%DATE%.log',
          datePattern: 'HH-DD-MM-YYYY',
          zippedArchive: true,
          auditFile: './audit/hash-audit.json',
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
  });

  const config = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

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
