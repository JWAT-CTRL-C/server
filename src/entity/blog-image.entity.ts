import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class BlogImage {
  @PrimaryColumn('varchar')
  blog_img_id: string;
  @Column('text', { nullable: false })
  blog_img_url: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  // blog
  @OneToOne(() => Blog, (blog) => blog.blogImage)
  blog: Blog;
}
