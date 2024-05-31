import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entity/user.entity';
import { UsersModule } from './users/users.module';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('PGHOST'),
    //     port: configService.get('DATABASE_PORT') || 5432,
    //     password: configService.get('PGPASSWORD'),
    //     username: configService.get('PGUSER'),
    //     entities: [User],
    //     database: configService.get('PGDATABASE'),
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
