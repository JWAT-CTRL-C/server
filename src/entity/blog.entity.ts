import {
  Column,
  CreateDateColumn,
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
import { Workspace } from './workspace.entity';
import { Tag } from './tag.entity';

@Entity()
export class Blog {
  @PrimaryColumn('uuid')
  blog_id: string;
  @Column('varchar', { length: 150, nullable: false })
  blog_tle: string;
  @Column('text', { nullable: false })
  blog_cont: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations

  // User
  @ManyToOne(() => User, (users) => users.blogs)
  @JoinColumn({ name: 'auth_id' })
  user: User;

  // Workspace
  @ManyToOne(() => Workspace, (workspaces) => workspaces.blogs)
  @JoinColumn({ name: 'wksp_id' })
  workspace: Workspace;

  // Tags
  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'blog_tag',
    joinColumn: { name: 'blog_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags: Tag[];

  // BlogImages
  @OneToMany(() => BlogImage, (blogImages) => blogImages.blog)
  blogImages: BlogImage[];

  // BlogComments
  @OneToMany(() => BlogComment, (blogComments) => blogComments.blog)
  blogComments: BlogComment[];

  // BlogRatings
  @OneToMany(() => BlogRating, (blogRatings) => blogRatings.blog)
  blogRatings: BlogRating[];
}

@Entity()
export class BlogImage {
  @PrimaryColumn('uuid')
  blog_img_id: string;
  @Column('text', { nullable: false })
  blog_img_url: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  // blog
  @ManyToOne(() => Blog, (blogs) => blogs.blogImages)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}

@Entity()
export class BlogComment {
  @PrimaryColumn('uuid')
  blog_cmt_id: string;
  @Column('text', { nullable: false })
  blog_cmt_cont: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations
  // user
  @ManyToOne(() => User, (users) => users.blogComments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // blog
  @ManyToOne(() => Blog, (blogs) => blogs.blogComments)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}

@Entity()
export class BlogRating {
  @PrimaryColumn('uuid')
  blog_rtg_id: string;
  @Column('boolean', { default: true })
  is_rated: boolean;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations
  // user
  @ManyToOne(() => User, (users) => users.blogRatings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // blog
  @ManyToOne(() => Blog, (blogs) => blogs.blogRatings)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
