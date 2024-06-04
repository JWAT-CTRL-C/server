import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';

@Entity()
export class Notification {
  @PrimaryColumn('uuid')
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
  @ManyToOne(() => User, (users) => users.notifications)
  @JoinColumn({ name: 'auth_id' })
  user: User;

  // Workspace
  @ManyToOne(() => Workspace, (workspaces) => workspaces.notifications)
  @JoinColumn({ name: 'wksp_id' })
  workspace: Workspace;
}
