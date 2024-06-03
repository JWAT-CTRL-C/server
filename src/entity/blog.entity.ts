import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Workspaces } from './workspace.entity';
import { Tag } from './tag.entity';
import { Sources } from './source.entity';

@Entity()
export class Blogs {
  @PrimaryColumn('uuid')
  blog_id: string;
  @Column('varying character', { length: 150, nullable: false })
  blog_tle: string;
  @Column('text', { nullable: false })
  blog_cont: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  
  // User
  @ManyToOne(() => Users, (users) => users.blogs)
  user: Users;

  // Workspace
  @ManyToOne(() => Workspaces, (workspaces) => workspaces.blogs)
  workspace: Workspaces;

  // Tags
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  // BlogImages
  @OneToMany(() => BlogImages, (blogImages) => blogImages.blog)
  blogImages: BlogImages[];

  // BlogComments
  @OneToMany(() => BlogComments, (blogComments) => blogComments.blog)
  blogComments: BlogComments[];

  // BlogRatings
  @OneToMany(() => BlogRatings, (blogRatings) => blogRatings.blog)
  blogRatings: BlogRatings[];

}

export class BlogImages {
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
  @ManyToOne(() => Blogs, (blogs) => blogs.blogImages)
  blog: Blogs;
}

export class BlogComments {
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
  @ManyToOne(() => Users, (users) => users.blogComments)
  user: Users;

  // blog
  @ManyToOne(() => Blogs, (blogs) => blogs.blogComments)
  blog: Blogs;
}
export class BlogRatings {
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
  @ManyToOne(() => Users, (users) => users.blogRatings)
  user: Users;

  // blog
  @ManyToOne(() => Blogs, (blogs) => blogs.blogRatings)
  blog: Blogs;
}
