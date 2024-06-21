import { RolesGuard } from 'src/guard/roles.guard';

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { User } from 'src/decorator/user.decorator';
import { DecodeUser } from 'src/lib/type';

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

  @Get(':wksp_id')
  async getWorkspaceNotifications(
    @User() user: DecodeUser,
    @Param('wksp_id') wksp_id: string,
    @Query('page') page: number,
  ) {
    return this.notificationsService.getWorkspaceNotifications(
      user.user_id,
      wksp_id,
      page,
    );
  }
}
