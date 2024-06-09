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
export class BlogRating {
  @PrimaryColumn('varchar')
  blog_rtg_id: string;
  @Column('boolean', { default: true })
  is_rated: boolean;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations
  // user
  @ManyToOne(() => User, (user) => user.blogRatings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // blog
  @ManyToOne(() => Blog, (blog) => blog.blogRatings)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
