import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotifyModule } from './notify/notify.module';
import { entities } from './entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('PGHOST'),
    //     port: configService.get('PG_PORT'),
    //     database: configService.get('PGDATABASE'),
    //     username: configService.get('PGUSER'),
    //     password: configService.get('PGPASSWORD'),
    //     entities: entities,
    //     synchronize: true,
    //     logging: true,
    //     ssl: true,
    //   }),
    //   inject: [ConfigService],
    // }),
    AuthModule,
    UsersModule,
    NotifyModule,
  ],
})
export class AppModule {}
