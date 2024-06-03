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
import { Workspaces } from './workspace.entity';
import { Blogs } from './blog.entity';

@Entity()
export class Sources {
  @PrimaryColumn('uuid')
  src_id: string;
  @Column({ type: 'number', nullable: false })
  src_name: string;
  @Column({ type: 'text' })
  src_url: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  // Workspace
  @ManyToOne(() => Workspaces, (workspaces) => workspaces.sources)
  workspace: Workspaces;

  // Blog
  @OneToOne(() => Blogs)
  @JoinColumn()
  blog: Blogs;
}
