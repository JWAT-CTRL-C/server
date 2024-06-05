import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Key {
  @PrimaryGeneratedColumn('increment')
  key_id: number;
  @Column('text', { nullable: false })
  public_key: string;
  @Column('text', { nullable: false })
  private_key: string;
  @Column('text', { array: true, default: [] })
  refresh_token_used: string[];
  @CreateDateColumn()
  crd_at: Date;
  @UpdateDateColumn()
  upd_at: Date;

  //User
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
