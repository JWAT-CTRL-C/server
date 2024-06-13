import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { Blog } from './blog.entity';
import { Notification } from './notification.entity';
import { BlogRating } from './blog-rating.entity';
import { BlogComment } from './blog-comment.entity';

@Entity()
export class User {
  @PrimaryColumn('integer')
  user_id: number;
  @Column('varchar', { length: 50, nullable: false })
  usrn: string;
  @Column('text', { nullable: true })
  avatar: string;
  @Column('varchar', { length: 125, nullable: true })
  email: string;
  @Column('varchar', { length: 30, nullable: true })
  fuln: string;
  @Column('varchar', { length: 20, nullable: true })
  phone: number;
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
  @ManyToMany(() => Workspace, (workspaces) => workspaces.users)
  workspaces: Workspace[];

  // Workspaces-owner
  @OneToMany(() => Workspace, (workspaces) => workspaces.owner)
  workspacesOwner: Workspace[];

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
