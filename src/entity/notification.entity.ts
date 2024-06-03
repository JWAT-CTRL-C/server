import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Workspaces } from './workspace.entity';

@Entity()
export class Notifications{
  @PrimaryColumn('uuid')
  noti_id: string;
  @Column('varying character', { length: 150, nullable: false })
  noti_tle: string;
  @Column('text')
  noti_cont: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations
  // user
  @ManyToOne(() => Users, (users) => users.notifications)
  user: Users;

  // Workspace
  @ManyToOne(() => Workspaces, (workspaces) => workspaces.notifications)
  workspace: Workspaces;
}
