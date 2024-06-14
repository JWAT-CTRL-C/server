import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { User } from './user.entity';

@Entity()
export class UserWorkspace {
  @PrimaryGeneratedColumn('increment')
  user_workspace_id: number;
  @DeleteDateColumn()
  deleted_at: Date;
  @Column('integer', { nullable: true })
  deleted_user_id: number;
  @CreateDateColumn()
  crd_at: Date;
  @Column('integer', { nullable: true })
  crd_user_id: number;
  @UpdateDateColumn()
  upd_at: Date;
  @Column('integer', { nullable: true })
  upd_user_id: number;

  // Relations
  // Workspaces
  @ManyToOne(() => Workspace, (workspaces) => workspaces.users)
  workspace: Workspace;

  // Users
  @ManyToOne(() => User, (user) => user.workspaces)
  user: User;
}
