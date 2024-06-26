import { Namespace, Socket } from 'socket.io';
import { NotificationType } from 'src/lib/type';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { CreateNotificationDTO } from './dto/create-notification.dto';
import { CreateSystemNotificationDTO } from './dto/create-system-notification.dto';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  namespace: 'notifications',
  transports: ['websocket'],
})
export class NotificationsGateway {
  @WebSocketServer() io: Namespace;

  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage(NotificationType.SETUP_WORKSPACE)
  setupWorkspace(
    @ConnectedSocket() socket: Socket,
    @MessageBody() wksp_id: string,
  ) {
    socket.join(wksp_id);

    return { event: NotificationType.SETUP_WORKSPACE, data: wksp_id };
  }

  @SubscribeMessage(NotificationType.SETUP_USER)
  setupUser(@ConnectedSocket() socket: Socket, @MessageBody() user_id: string) {
    socket.join(user_id);

    return { event: NotificationType.SETUP_USER, data: user_id };
  }

  @SubscribeMessage(NotificationType.CREATE_GLOBAL)
  async createGlobalNotification(
    @MessageBody() createNotificationDTO: CreateNotificationDTO,
  ) {
    return await this.notificationsService.createGlobalNotification(
      this.io,
      createNotificationDTO,
    );
  }

  @SubscribeMessage(NotificationType.CREATE_WORKSPACE)
  async createWorkspaceNotification(
    @MessageBody() createNotificationDTO: CreateNotificationDTO,
  ) {
    return await this.notificationsService.createWorkspaceNotification(
      this.io,
      createNotificationDTO,
    );
  }

  @SubscribeMessage(NotificationType.CREATE_SYSTEM_GLOBAL)
  async createSystemGlobalNotification(
    @MessageBody() createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    return await this.notificationsService.createSystemGlobalNotification(
      this.io,
      createSystemNotificationDTO,
    );
  }

  @SubscribeMessage(NotificationType.CREATE_SYSTEM_WORKSPACE)
  async createSystemWorkspaceNotification(
    @MessageBody() createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    return await this.notificationsService.createSystemWorkspaceNotification(
      this.io,
      createSystemNotificationDTO,
    );
  }
}
