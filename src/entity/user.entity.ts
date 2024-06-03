import { join } from 'path';
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
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspaces } from './workspace.entity';
import { BlogComments, BlogRatings, Blogs } from './blog.entity';
import { Notifications } from './notification.entity';

@Entity()
export class Users {
  @PrimaryColumn('integer')
  user_id: number;
  @Column('varying character', { length: 50, nullable: false })
  usrn: string;
  @Column('varying character', { length: 125, nullable: false })
  pass: string;
  @Column({
    type: 'enum',
    enum: ['MA', 'HM', 'PM', 'EM'],
    default: 'EM',
    nullable: false,
  })
  role: string;
  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  // Workspaces
  @ManyToMany(() => Workspaces)
  @JoinTable()
  workspaces: Workspaces[];
  // Workspace-owner
  @OneToMany(() => Workspaces, (workspaces) => workspaces.owner)
  workspaceOwner: Workspaces;

  // Blogs
  @OneToMany(() => Blogs, (blogs) => blogs.user)
  blogs: Blogs[];

  // Notifications
  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];

  // Blog Ratings
  @OneToMany(() => BlogRatings, (blogRatings) => blogRatings.user)
  blogRatings: BlogRatings[];

  //Blog Comments
  @OneToMany(() => BlogComments, (blogComments) => blogComments.user)
  blogComments: BlogComments[];
}
