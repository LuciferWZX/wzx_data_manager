import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../type/Gender';
import { Authority } from '../type/Authority';
import { PlatformType } from '../type/PlatformType';

@Entity({ name: 'tb_user_ban' })
export class TBBan {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  uId: number;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  reason: string;
  @Column({
    type: 'boolean',
    default: true,
  })
  banded: boolean;
  @Column({
    type: 'boolean',
    default: false,
  })
  deleted: boolean;
}
