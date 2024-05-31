import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('identity')
  user_id: number;

  @Column({ type: 'varchar', length: 30 })
  usrn: string;

  @Column({ type: 'varchar' })
  pass: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  crd_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  upd_at: Date;
}
