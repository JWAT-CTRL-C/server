import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthGuard } from './guard/auth.guard';
import { AppLoggerMiddleware } from './logger/app.logger';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { NotificationsModule } from './notifications/notifications.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get<string>('REDIS_URL'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: configService.get<number>('PGPORT'),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        database: configService.get<string>('PGDATABASE'),
        autoLoadEntities: true,
        schema: configService.get<string>('PGSCHEMA'),
        entities: [__dirname + '/entity/*.entity{.ts,.js}'],
        migrations: [__dirname + '/db/migrations/*{.ts,.js}'],
        // synchronize: true,
        logging: true,
        ssl: true,
        cli: {
          migrationsDir: __dirname + '/db/migrations/',
        },
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    CloudinaryModule,
    NotificationsModule,
    WorkspacesModule,
    ResourcesModule,
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
