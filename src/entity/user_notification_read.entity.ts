import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Notification } from './notification.entity';

@Entity()
export class UserNotificationRead {
  @PrimaryGeneratedColumn('increment')
  user_noti_read_id: number;

  @Column('integer', { nullable: false })
  user_id: number;
  @Column('varchar', { nullable: false })
  noti_id: string;
  @Column('boolean', { nullable: false, default: true })
  is_read: boolean;
  @CreateDateColumn()
  crd_at: Date;
  @ManyToOne(() => User, (user) => user.userNotificationRead)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(
    () => Notification,
    (notification) => notification.userNotificationRead,
  )
  @JoinColumn({ name: 'noti_id' })
  notification: Notification;
}
