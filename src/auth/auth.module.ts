import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entity/user.entity';
import { Key } from 'src/entity/key.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Key])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
