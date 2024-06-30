import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from './blog.entity';
import { Resource } from './resource.entity';
import { Notification } from './notification.entity';
import { UserWorkspace } from './user_workspace.entity';

@Entity()
export class Workspace {
  @PrimaryColumn('varchar')
  wksp_id: string;
  @Column('varchar', { length: 50, nullable: false })
  wksp_name: string;
  @Column('text')
  wksp_desc: string;
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

  // relations
  // user-owner
  @ManyToOne(() => User, (user) => user.workspacesOwner, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Users
  @OneToMany(() => UserWorkspace, (user_workspace) => user_workspace.workspace)
  users: UserWorkspace[];

  // Blogs
  @OneToMany(() => Blog, (blogs) => blogs.workspace)
  blogs: Blog[];

  // Sources
  @OneToMany(() => Resource, (resource) => resource.workspace)
  resources: Resource[];

  // Notifications
  @OneToMany(() => Notification, (notifications) => notifications.workspace)
  notifications: Notification[];
}
