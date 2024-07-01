import { Notification } from 'src/entity/notification.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CronjobsService } from './cronjobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [CronjobsService],
})
export class CronjobsModule {}
