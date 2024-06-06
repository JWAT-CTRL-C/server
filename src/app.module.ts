import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppLoggerMiddleware } from './logger/app.logger';
import { AuthGuard } from './guard/auth.guard';
import { BlogsModule } from './blogs/blogs.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PGHOST'),
        port: parseInt(configService.get('PG_PORT'), 10),
        database: configService.get('PGDATABASE'),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        entities: ['dist/entity/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
        // synchronize: true,
        logging: true,
        ssl: true,
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    CloudinaryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
