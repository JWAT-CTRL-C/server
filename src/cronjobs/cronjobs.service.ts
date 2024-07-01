import { Notification } from 'src/entity/notification.entity';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CronjobsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: 'delete_notifications' })
  async handleDeleteNotifications() {
    // delete notifications older than 8 weeks
    const date = new Date();
    date.setDate(date.getDate() - 56);

    await this.notificationRepository.delete({ crd_at: MoreThanOrEqual(date) });
  }
}
