import { Namespace } from 'socket.io';
import { Notification } from 'src/entity/notification.entity';
import { Workspace } from 'src/entity/workspace.entity';
import {
  relationNotification,
  selectNotification,
} from 'src/lib/constant/notification';
import { relationWorkspace } from 'src/lib/constant/workspace';
import { DecodeUser, NotificationType } from 'src/lib/type';
import { canPassThrough, generateUUID, removeFalsyFields } from 'src/lib/utils';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateNotificationDTO } from './dto/create-notification.dto';
import { CreateSystemNotificationDTO } from './dto/create-system-notification.dto';
import { User } from 'src/entity/user.entity';
import { UserNotificationRead } from 'src/entity/user_notification_read.entity';

@Injectable()
export class NotificationsService {
  private readonly LIMIT = 20;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserNotificationRead)
    private userNotificationReadRepository: Repository<UserNotificationRead>,
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
      throw new InternalServerErrorException(
        'Error creating global notification',
      );
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
        throw new NotFoundException('Workspace not found');
      }

      const newNotification = this.notificationRepository.create({
        ...createNotificationDTO,
        noti_id: generateUUID('notification', createNotificationDTO.user_id),
        user: { user_id: createNotificationDTO.user_id },
        workspace,
      });

      await this.dataSource.manager.transaction(async (manager) => {
        await manager.save(newNotification);
      });

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
      throw new InternalServerErrorException(
        'Error creating workspace notification',
      );
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
      throw new InternalServerErrorException(
        'Error creating system notification',
      );
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
        throw new NotFoundException('Workspace not found');
      }

      const newNotification = this.notificationRepository.create({
        ...createSystemNotificationDTO,
        noti_id: generateUUID('notification', 'system'),
        user: null,
        workspace,
      });

      await this.dataSource.manager.transaction(async (manager) => {
        await manager.save(newNotification);
      });

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
      throw new InternalServerErrorException(
        'Error creating system notification',
      );
    }
  }

  async getNotifications(user_id: number, page = 1, withoutSys: number) {
    const skip = (page - 1) * this.LIMIT;

    const workspaces = await this.workspaceRepository.find({
      where: { users: { user: { user_id: user_id } } },
    });

    const notifications = await this.notificationRepository.find({
      where: [
        {
          workspace: IsNull(),
          // userNotificationRead: [{ user_id: user_id }, { user_id: IsNull() }],
          ...(!!withoutSys ? { user: Not(IsNull()) } : {}),
        },
        {
          workspace: {
            wksp_id: In(workspaces.map((wksp) => wksp.wksp_id)),
          },
          // userNotificationRead: [{ user_id: user_id }, { user_id: IsNull() }],
          ...(!!withoutSys ? { user: Not(IsNull()) } : {}),
        },
      ],
      order: { crd_at: 'DESC' },
      relations: relationNotification,
      select: selectNotification,
      skip,
      take: this.LIMIT,
    });
    const formatted_notifications = notifications.map((notification) => {
      return {
        ...notification,
        userNotificationRead: undefined,
        is_read: notification.userNotificationRead.length
          ? notification.userNotificationRead.some(
              (u) => u.user_id === user_id && u.is_read,
            )
          : false,
      };
    });

    return removeFalsyFields(formatted_notifications);
  }

  async getWorkspaceNotifications(user: DecodeUser, wksp_id: string, page = 1) {
    const skip = (page - 1) * this.LIMIT;
    const workspace = await this.workspaceRepository.findOne({
      where: {
        wksp_id,
        ...canPassThrough<object>(user, {
          onApprove: {},
          onDecline: { users: { user: { user_id: user.user_id } } },
        }),
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const notifications = await this.notificationRepository.find({
      where: {
        workspace: { wksp_id: workspace.wksp_id },
        // userNotificationRead: [
        //   { user_id: user.user_id },
        //   { is_read: IsNull() },
        // ],
      },
      order: { crd_at: 'DESC' },
      relations: relationNotification,
      select: selectNotification,
      skip,
      take: this.LIMIT,
    });

    const formatted_notifications = notifications.map((notification) => {
      return {
        ...notification,
        userNotificationRead: undefined,
        is_read: notification.userNotificationRead.length
          ? notification.userNotificationRead.some(
              (u) => u.user_id === user.user_id && u.is_read,
            )
          : false,
      };
    });
    return removeFalsyFields(formatted_notifications);
  }

  async getUnreadNotificationAmount(user_id: number) {
    const workspaces = await this.workspaceRepository.find({
      where: { users: { user: { user_id: user_id } } },
    });

    const notifications = await this.notificationRepository.find({
      where: [
        {
          workspace: IsNull(),
          // userNotificationRead: { is_read: IsNull() },
        },
        {
          workspace: {
            wksp_id: In(workspaces.map((wksp) => wksp.wksp_id)),
          },
          // userNotificationRead: { is_read: IsNull() },
        },
      ],
      relations: {
        workspace: true,
        userNotificationRead: true,
      },
    });

    const unreadAmount = notifications.reduce((acc, curr) => {
      if (!curr.userNotificationRead.some((u) => u.user_id === user_id))
        return acc + 1;
      return acc;
    }, 0);

    return { unreadAmount };
  }

  async getNotificationsForAdmin(page = 1, user: DecodeUser) {
    const foundUser = await this.userRepository.findOne({
      where: { user_id: user.user_id },
    });
    if (!foundUser) throw new NotFoundException('User not found');

    const skip = (page - 1) * this.LIMIT;

    const [notifications, totalNotifications] =
      await this.notificationRepository.findAndCount({
        order: { crd_at: 'DESC' },
        relations: relationNotification,
        select: selectNotification,
        skip,
        take: this.LIMIT,
      });

    const formatted_notifications = notifications.map((notification) => {
      return {
        ...notification,
        userNotificationRead: undefined,
        is_read: notification.userNotificationRead.length
          ? notification.userNotificationRead[0].is_read
          : false,
      };
    });

    const totalPages = Math.ceil(totalNotifications / this.LIMIT);
    return {
      data: formatted_notifications,
      currentPage: parseInt(page.toString()),
      totalPages,
    };
  }
  async deleteGlobalNotification(noti_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { noti_id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.userNotificationReadRepository.delete({
      noti_id,
    });
    await this.notificationRepository.remove(notification);
    return { success: true, message: 'Notification deleted' };
  }

  async deleteWorkspaceNotification(noti_id: string, wksp_id: string) {
    const notification = await this.notificationRepository.findOne({
      where: {
        noti_id,
        workspace: { wksp_id },
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.userNotificationReadRepository.delete({
      noti_id,
    });
    await this.notificationRepository.remove(notification);
    return { success: true, message: 'Notification deleted' };
  }
}
