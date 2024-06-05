import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { BlogComment, BlogRating, Blog } from './blog.entity';
import { Notification } from './notification.entity';

@Entity()
export class User {
  @PrimaryColumn('integer')
  user_id: number;
  @Column('varchar', { length: 50, nullable: false })
  usrn: string;
  @Column('varchar', { length: 125, nullable: false })
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
  @ManyToMany(() => Workspace, (workspaces) => workspaces.users)
  @JoinTable({
    name: 'user_workspace',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'wksp_id' },
  })
  workspaces: Workspace[];
  // Workspace-owner
  @OneToMany(() => Workspace, (workspaces) => workspaces.owner)
  workspaceOwner: Workspace;

  // Blogs
  @OneToMany(() => Blog, (blogs) => blogs.user)
  blogs: Blog[];

  // Notifications
  @OneToMany(() => Notification, (notifications) => notifications.user)
  notifications: Notification[];

  // Blog Ratings
  @OneToMany(() => BlogRating, (blogRatings) => blogRatings.user)
  blogRatings: BlogRating[];

  //Blog Comments
  @OneToMany(() => BlogComment, (blogComments) => blogComments.user)
  blogComments: BlogComment[];
}
