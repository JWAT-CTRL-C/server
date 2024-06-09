import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/entity/user.entity';
import { Key } from 'src/entity/key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Key])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
