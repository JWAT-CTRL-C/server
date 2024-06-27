import { Notification } from 'src/entity/notification.entity';
import { Workspace } from 'src/entity/workspace.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { UserNotificationRead } from 'src/entity/user_nofitication_read.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Workspace, UserNotificationRead]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService],
})
export class NotificationsModule {}
