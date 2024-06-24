import { Socket } from 'socket.io';
import { Notification } from 'src/entity/notification.entity';
import { Workspace } from 'src/entity/workspace.entity';
import {
  relationNotification,
  selectNotification,
} from 'src/lib/constant/notification';
import { relationWorkspace } from 'src/lib/constant/workspace';
import { NotificationType } from 'src/lib/type';
import { generateUUID } from 'src/lib/utils';
import { In, IsNull, Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateNotificationDTO } from './dto/create-notification.dto';
import { CreateSystemNotificationDTO } from './dto/create-system-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly LIMIT = 20;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async createGlobalNotification(
    socket: Socket,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    const newNotification = this.notificationRepository.create({
      ...createNotificationDTO,
      noti_id: generateUUID('notification', createNotificationDTO.user_id),
      user: { user_id: createNotificationDTO.user_id },
      workspace: null,
    });

    await this.notificationRepository.save(newNotification);

    socket.emit(NotificationType.NEW, newNotification);

    return {
      event: NotificationType.CREATE_GLOBAL,
      notification: newNotification,
    };
  }

  async createWorkspaceNotification(
    socket: Socket,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    const workspace = await this.workspaceRepository.findOne({
      where: { wksp_id: createNotificationDTO.wksp_id },
      relations: relationWorkspace,
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const newNotification = this.notificationRepository.create({
      ...createNotificationDTO,
      noti_id: generateUUID('notification', createNotificationDTO.user_id),
      user: { user_id: createNotificationDTO.user_id },
      workspace,
    });

    workspace.notifications.push(newNotification);

    await Promise.all([
      this.notificationRepository.save(newNotification),
      this.workspaceRepository.save(workspace),
    ]);

    socket.to(workspace.wksp_id).emit(NotificationType.NEW, newNotification);

    return {
      event: NotificationType.CREATE_WORKSPACE,
      notification: newNotification,
    };
  }

  async createSystemGlobalNotification(
    socket: Socket,
    createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    const newNotification = this.notificationRepository.create({
      ...createSystemNotificationDTO,
      noti_id: generateUUID('notification', 'system'),
      user: null,
      workspace: null,
    });

    await this.notificationRepository.save(newNotification);

    socket.emit(NotificationType.NEW, newNotification);

    return {
      event: NotificationType.CREATE_GLOBAL,
      notification: newNotification,
    };
  }

  async createSystemWorkspaceNotification(
    socket: Socket,
    createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    const workspace = await this.workspaceRepository.findOne({
      where: { wksp_id: createSystemNotificationDTO.wksp_id },
      relations: relationWorkspace,
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const newNotification = this.notificationRepository.create({
      ...createSystemNotificationDTO,
      noti_id: generateUUID('notification', 'system'),
      user: null,
      workspace,
    });

    workspace.notifications.push(newNotification);

    await Promise.all([
      this.notificationRepository.save(newNotification),
      this.workspaceRepository.save(workspace),
    ]);

    socket.to(workspace.wksp_id).emit(NotificationType.NEW, newNotification);

    return {
      event: NotificationType.CREATE_WORKSPACE,
      notification: newNotification,
    };
  }

  async getNotifications(user_id: number, page = 0) {
    const skip = page * this.LIMIT;

    const workspaces = await this.workspaceRepository.find({
      where: { users: { user: { user_id: user_id } } },
    });

    const notifications = await this.notificationRepository.find({
      where: [
        {
          workspace: IsNull(),
        },
        {
          workspace: {
            wksp_id: In(workspaces.map((wksp) => wksp.wksp_id)),
          },
        },
      ],
      order: { crd_at: 'DESC' },
      relations: relationNotification,
      select: selectNotification,
      skip,
      take: this.LIMIT,
    });

    return notifications;
  }

  async getWorkspaceNotifications(
    user_id: number,
    wksp_id: string,
    page: number,
  ) {
    const skip = page * this.LIMIT;

    const workspace = await this.workspaceRepository.findOne({
      where: { wksp_id, users: { user: { user_id } } },
    });

    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const notifications = await this.notificationRepository.find({
      where: { workspace: { wksp_id: workspace.wksp_id } },
      order: { crd_at: 'DESC' },
      relations: relationNotification,
      select: selectNotification,
      skip,
      take: this.LIMIT,
    });

    return notifications;
  }
}
