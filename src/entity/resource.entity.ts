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
export class Resource {
  @PrimaryColumn('varchar')
  resrc_id: string;
  @Column({ type: 'varchar', length: 50, nullable: false })
  resrc_name: string;
  @Column({ type: 'text' })
  resrc_url: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // Relations
  // Workspace
  @ManyToOne(() => Workspace, (workspace) => workspace.resources)
  @JoinColumn({ name: 'wksp_id' })
  workspace: Workspace;

  // Blog
  @OneToOne(() => Blog)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
