import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Tag {
  @PrimaryGeneratedColumn('increment')
  tag_id: number;
  @Column('varying character', { length: 50, nullable: false })
  tag_name: string;
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;
}
