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
import { Source } from './source.entity';
import { Notification } from './notification.entity';

@Entity()
export class Workspace {
  @PrimaryColumn('uuid')
  wksp_id: string;
  @Column('varchar', { length: 50, nullable: false })
  wksp_name: string;
  @Column('varchar', { length: 125 })
  wksp_desc: string;
  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations

  // user-owner
  @ManyToOne(() => User, (users) => users.workspaceOwner)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Users
  @OneToMany(() => User, (users) => users.workspaces)
  users: User[];

  // Blogs
  @OneToMany(() => Blog, (blogs) => blogs.workspace)
  blogs: Blog[];

  // Sources
  @OneToMany(() => Source, (sources) => sources.workspace)
  sources: Source[];

  // Notifications
  @OneToMany(() => Notification, (notifications) => notifications.workspace)
  notifications: Notification[];
}
