import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Blog } from './blog.entity';
import { Resource } from './resource.entity';
import { Notification } from './notification.entity';

@Entity()
export class Workspace {
  @PrimaryColumn('varchar')
  wksp_id: string;
  @Column('varchar', { length: 50, nullable: false })
  wksp_name: string;
  @Column('varchar', { length: 125 })
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
  @ManyToOne(() => User, (user) => user.workspacesOwner)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  // Users
  @ManyToMany(() => User, (user) => user.workspaces)
  @JoinTable({
    name: 'user_workspace',
    joinColumn: { name: 'wksp_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: User[];

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
