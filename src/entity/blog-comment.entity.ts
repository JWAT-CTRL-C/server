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
import { Blog } from './blog.entity';

@Entity()
export class BlogComment {
  @PrimaryColumn('varchar')
  blog_cmt_id: string;
  @Column('text', { nullable: false })
  blog_cmt_cont: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations
  // user
  @ManyToOne(() => User, (user) => user.blogComments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // blog
  @ManyToOne(() => Blog, (blog) => blog.blogComments)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
