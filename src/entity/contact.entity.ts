import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserBasicProfile } from './user_basic_profile';

@Entity({ name: 'tb_contact' })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'int',
    nullable: false,
  })
  uid: number;
  @ManyToOne(() => User)
  uProfile: User;
  @Column({
    type: 'int',
    nullable: false,
  })
  fid: number;
  @ManyToOne(() => User)
  fProfile: User;
  @Column({
    type: 'int',
    name: 'user_group_id',
    nullable: false,
  })
  uGroupId: number;
  @Column({
    type: 'int',
    name: 'friend_group_id',
    nullable: false,
  })
  fGroupId: number;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
}
