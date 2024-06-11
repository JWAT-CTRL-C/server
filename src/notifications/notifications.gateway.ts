import { Socket } from 'socket.io';
import { NotificationType } from 'src/lib/type';

import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { CreateNotificationDTO } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  namespace: 'notifications',
  transports: ['websocket'],
})
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @SubscribeMessage(NotificationType.SETUP_WORKSPACE)
  setup(socket: Socket, wksp_id: string) {
    socket.join(wksp_id);

    return { event: NotificationType.SETUP_WORKSPACE, wksp_id };
  }

  @SubscribeMessage(NotificationType.CREATE_NORMAL)
  createNormalNotification(
    socket: Socket,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    return this.notificationsService.createNormalNotification(
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
}
