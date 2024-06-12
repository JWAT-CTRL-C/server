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
import { User } from './user.entity';
import { Workspace } from './workspace.entity';
import { Tag } from './tag.entity';
import { BlogImage } from './blog-image.entity';
import { BlogComment } from './blog-comment.entity';
import { BlogRating } from './blog-rating.entity';
import { Resource } from './resource.entity';

@Entity()
export class Blog {
  @PrimaryColumn('varchar')
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
  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'auth_id' })
  user: User;

  // Workspace
  @ManyToOne(() => Workspace, (workspace) => workspace.blogs)
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

  // BlogImage
  @OneToOne(() => BlogImage, (blogImage) => blogImage.blog)
  @JoinColumn({ name: 'blog_img_id' })
  blogImage: BlogImage;

  // BlogComments
  @OneToMany(() => BlogComment, (blogComments) => blogComments.blog)
  blogComments: BlogComment[];

  // BlogRatings
  @OneToMany(() => BlogRating, (blogRatings) => blogRatings.blog)
  blogRatings: BlogRating[];

  // Resource
  @OneToOne(() => Resource, (resource) => resource.blog)
  resource: Resource;
  @DeleteDateColumn()
  dld_at: Date;
}
