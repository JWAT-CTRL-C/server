import { RolesGuard } from 'src/guard/roles.guard';

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

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

  @Get(':user_id')
  async getNotifications(
    @Param('user_id') user_id: number,
    @Query('page') page: number,
  ) {
    return this.notificationsService.getNotifications(user_id, page);
  }

  @Get(':user_id/:wksp_id')
  async getWorkspaceNotifications(
    @Param('user_id') user_id: number,
    @Param('wksp_id') wksp_id: string,
    @Query('page') page: number,
  ) {
    return this.notificationsService.getWorkspaceNotifications(
      user_id,
      wksp_id,
      page,
    );
  }
}
