import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./user.entity";
import { Blogs } from "./blog.entity";
import { Sources } from "./source.entity";
import { Notifications } from "./notification.entity";

@Entity()
export class Workspaces {
  @PrimaryColumn('uuid')
  wkps_id: string;
  @Column('varying character', { length: 50, nullable: false })
  wkps_name: string;
  @Column('varying character', { length: 125 })
  wkps_desc: string;
  @DeleteDateColumn()
  deleted_at: Date;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  // relations

  // user-owner
  @ManyToOne(() => Users, (users) => users.workspaceOwner)
  owner: Users;

  // Blog
  @OneToMany(() => Blogs, (blogs) => blogs.workspace)
  blogs: Blogs[];

  // Sources
  @OneToMany(() => Sources, (sources) => sources.workspace)
  sources: Sources[];

  // Notifications
  @OneToMany(() => Notifications, (notifications) => notifications.workspace)
  notifications: Notifications[];
}
