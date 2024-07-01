import { RolesGuard } from 'src/guard/roles.guard';

import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';
import { Roles } from 'src/decorator/roles.decorator';

@ApiBearerAuth()
@ApiHeader({
  name: 'x-user-id',
  required: true,
})
@ApiTags('Notifications')
@UseGuards(RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @User() user: DecodeUser,
    @Query('page') page: number,
  ) {
    return this.notificationsService.getNotifications(user.user_id, page);
  }
  @Get('unread')
  async getUnreadNotifications(@User() user: DecodeUser) {
    return this.notificationsService.getUnreadNotificationAmount(user.user_id);
  }
  @Get(':wksp_id')
  @ApiParam({
    name: 'wksp_id',
    required: true,
    description: 'Workspace ID',
  })
  async getWorkspaceNotifications(
    @User() user: DecodeUser,
    @Param('wksp_id') wksp_id: string,
    @Query('page') page: number,
  ) {
    return this.notificationsService.getWorkspaceNotifications(
      user,
      wksp_id,
      page,
    );
  }

  @Roles('MA', 'HM')
  @Delete(':noti_id')
  @ApiParam({
    name: 'noti_id',
    required: true,
    description: 'Notification ID',
  })
  async deleteNotification(@Param('noti_id') noti_id: string) {
    return this.notificationsService.deleteGlobalNotification(noti_id);
  }

  @Roles('MA', 'HM', 'PM')
  @Delete(':noti_id/workspaces/:wksp_id')
  @ApiParam({
    name: 'noti_id',
    required: true,
    description: 'Notification ID',
  })
  @ApiParam({
    name: 'wksp_id',
    required: true,
    description: 'Workspace ID',
  })
  async deleteWorkspaceNotification(
    @Param('noti_id') noti_id: string,
    @Param('wksp_id') wksp_id: string,
  ) {
    return this.notificationsService.deleteWorkspaceNotification(
      noti_id,
      wksp_id,
    );
  }
}
