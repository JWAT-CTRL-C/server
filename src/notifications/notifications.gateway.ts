import { Socket } from 'socket.io';
import { NotificationType } from 'src/lib/type';

import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { CreateNotificationDTO } from './dto/create-notification.dto';
import { CreateSystemNotificationDTO } from './dto/create-system-notification.dto';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  namespace: 'notifications',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  connectTimeout: 60000,
})
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage(NotificationType.SETUP_WORKSPACE)
  setup(socket: Socket, wksp_id: string) {
    socket.join(wksp_id);

    return { event: NotificationType.SETUP_WORKSPACE, wksp_id };
  }

  @SubscribeMessage(NotificationType.SETUP_USER)
  setupNormal(socket: Socket, user_id: string) {
    if (user_id) socket.join(user_id);

    return { event: NotificationType.SETUP_USER, user_id };
  }

  @SubscribeMessage(NotificationType.CREATE_GLOBAL)
  createGlobalNotification(
    socket: Socket,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    return this.notificationsService.createGlobalNotification(
      socket,
      createNotificationDTO,
    );
  }

  @SubscribeMessage(NotificationType.CREATE_WORKSPACE)
  createWorkspaceNotification(
    socket: Socket,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    return this.notificationsService.createWorkspaceNotification(
      socket,
      createNotificationDTO,
    );
  }

  @SubscribeMessage(NotificationType.CREATE_SYSTEM_GLOBAL)
  createSystemGlobalNotification(
    socket: Socket,
    createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    return this.notificationsService.createSystemGlobalNotification(
      socket,
      createSystemNotificationDTO,
    );
  }

  @SubscribeMessage(NotificationType.CREATE_SYSTEM_WORKSPACE)
  createSystemWorkspaceNotification(
    socket: Socket,
    createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    return this.notificationsService.createSystemWorkspaceNotification(
      socket,
      createSystemNotificationDTO,
    );
  }
}
