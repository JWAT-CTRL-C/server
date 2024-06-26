import { Namespace } from 'socket.io';
import { Notification } from 'src/entity/notification.entity';
import { Workspace } from 'src/entity/workspace.entity';
import {
  relationNotification,
  selectNotification,
} from 'src/lib/constant/notification';
import { relationWorkspace } from 'src/lib/constant/workspace';
import { NotificationType } from 'src/lib/type';
import { generateUUID, removeFalsyFields } from 'src/lib/utils';
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
    io: Namespace,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    try {
      const newNotification = this.notificationRepository.create({
        ...createNotificationDTO,
        noti_id: generateUUID('notification', createNotificationDTO.user_id),
        user: { user_id: createNotificationDTO.user_id },
        workspace: null,
      });

      await this.notificationRepository.save(newNotification);

      io.emit(NotificationType.SUCCESS, {
        success: true,
        message: 'Global notification created',
      });
      const notification = await this.notificationRepository.findOne({
        where: { noti_id: newNotification.noti_id },
        relations: relationNotification,
        select: selectNotification,
      });
      io.emit(NotificationType.NEW, notification);

      return {
        event: NotificationType.CREATE_GLOBAL,
        data: newNotification,
      };
    } catch (error) {
      io.emit(NotificationType.ERROR, {
        success: false,
        message: 'Error creating global notification',
      });
      throw new BadRequestException('Error creating global notification');
    }
  }

  async createWorkspaceNotification(
    io: Namespace,
    createNotificationDTO: CreateNotificationDTO,
  ) {
    try {
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

      io.emit(NotificationType.SUCCESS, {
        success: true,
        message: 'Workspace notification created',
      });
      const notification = await this.notificationRepository.findOne({
        where: { noti_id: newNotification.noti_id },
        relations: relationNotification,
        select: selectNotification,
      });
      io.to(workspace.wksp_id).emit(NotificationType.NEW, notification);

      return {
        event: NotificationType.CREATE_WORKSPACE,
        data: newNotification,
      };
    } catch (error) {
      io.emit(NotificationType.ERROR, {
        success: false,
        message: 'Error creating workspace notification',
      });
      throw new BadRequestException('Error creating workspace notification');
    }
  }

  async createSystemGlobalNotification(
    io: Namespace,
    createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    try {
      const newNotification = this.notificationRepository.create({
        ...createSystemNotificationDTO,
        noti_id: generateUUID('notification', 'system'),
        user: null,
        workspace: null,
      });

      await this.notificationRepository.save(newNotification);

      const notification = await this.notificationRepository.findOne({
        where: { noti_id: newNotification.noti_id },
        relations: relationNotification,
        select: selectNotification,
      });
      io.emit(NotificationType.NEW, notification);

      return {
        event: NotificationType.CREATE_SYSTEM_GLOBAL,
        data: newNotification,
      };
    } catch (error) {
      throw new BadRequestException('Error creating system notification');
    }
  }

  async createSystemWorkspaceNotification(
    io: Namespace,
    createSystemNotificationDTO: CreateSystemNotificationDTO,
  ) {
    try {
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

      const notification = await this.notificationRepository.findOne({
        where: { noti_id: newNotification.noti_id },
        relations: relationNotification,
        select: selectNotification,
      });

      io.to(workspace.wksp_id).emit(NotificationType.NEW, notification);

      return {
        event: NotificationType.CREATE_SYSTEM_WORKSPACE,
        data: newNotification,
      };
    } catch (error) {
      throw new BadRequestException('Error creating system notification');
    }
  }

  async getNotifications(user_id: number, page = 1) {
    const skip = page * this.LIMIT;

    const workspaces = await this.workspaceRepository.find({
      where: { users: { user: { user_id: user_id } } },
    });

    const notifications = await this.notificationRepository.find({
      where: [
        {
          workspace: IsNull(),
          userNotificationRead: [{ user_id: user_id }, { is_read: IsNull() }],
        },
        {
          workspace: {
            wksp_id: In(workspaces.map((wksp) => wksp.wksp_id)),
          },
          userNotificationRead: [{ user_id: user_id }, { is_read: IsNull() }],
        },
      ],
      order: { crd_at: 'DESC' },
      relations: relationNotification,
      select: selectNotification,
      skip,
      take: this.LIMIT,
    });

    const formated_notifications = notifications.map((notification) => {
      return {
        ...notification,
        userNotificationRead: undefined,
        is_read: notification.userNotificationRead.length
          ? notification.userNotificationRead[0].is_read
          : false,
      };
    });

    return removeFalsyFields(formated_notifications);
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
      where: {
        workspace: { wksp_id: workspace.wksp_id },
        userNotificationRead: [{ user_id: user_id }, { is_read: IsNull() }],
      },
      order: { crd_at: 'DESC' },
      relations: relationNotification,
      select: selectNotification,
      skip,
      take: this.LIMIT,
    });

    const formated_notifications = notifications.map((notification) => {
      return {
        ...notification,
        userNotificationRead: undefined,
        is_read: notification.userNotificationRead.length
          ? notification.userNotificationRead[0].is_read
          : false,
      };
    });
    return removeFalsyFields(formated_notifications);
  }
}
