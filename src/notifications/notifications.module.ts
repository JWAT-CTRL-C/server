import { Notification } from 'src/entity/notification.entity';
import { Workspace } from 'src/entity/workspace.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { UserNotificationRead } from 'src/entity/user_notification_read.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Workspace,
      UserNotificationRead,
      User,
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
