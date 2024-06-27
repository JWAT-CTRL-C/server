import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';
import { UserNotificationRead } from './user_nofitication_read.entity';

@Entity()
export class Notification {
  @PrimaryColumn('varchar')
  noti_id: string;
  @Column('varchar', { length: 150, nullable: false })
  noti_tle: string;
  @Column('text')
  noti_cont: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations
  // user
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'auth_id' })
  user: User;

  // Workspace
  @ManyToOne(() => Workspace, (workspace) => workspace.notifications)
  @JoinColumn({ name: 'wksp_id' })
  workspace: Workspace;
  @OneToMany(
    () => UserNotificationRead,
    (userNotificationRead) => userNotificationRead.notification,
  )
  userNotificationRead: UserNotificationRead[];
}
