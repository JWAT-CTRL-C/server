import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { Blog } from './blog.entity';

@Entity()
export class Source {
  @PrimaryColumn('uuid')
  src_id: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  src_name: string;
  @Column({ type: 'text' })
  src_url: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  // Workspace
  @ManyToOne(() => Workspace, (workspaces) => workspaces.sources)
  @JoinColumn({ name: 'wksp_id' })
  workspace: Workspace;

  // Blog
  @OneToOne(() => Blog)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
