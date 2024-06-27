import { User } from 'src/entity/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserNotificationRead } from 'src/entity/user_notification_read.entity';
import { Notification } from 'src/entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserNotificationRead, Notification]),
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
