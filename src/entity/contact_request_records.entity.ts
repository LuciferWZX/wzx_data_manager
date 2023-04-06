import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Authority } from '../type/Authority';
import { RecordStatus } from '../type/RecordStatus';

@Entity({ name: 'tb_contact_record' })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  uid: number; //发送者id
  @Column({
    type: 'varchar',
    nullable: false,
  })
  fid: number; //接收者id
  @Column({
    type: 'varchar',
    name: 'user_group_id',
    nullable: false,
  })
  uGroupId: number; //发送者默认接收者的分组id
  @Column({
    type: 'varchar',
    name: 'friend_group_id',
    nullable: false,
  })
  fGroupId: number; //接收者默认发送者的分组id
  @Column({
    type: 'varchar',
    length: 50,
    name: 'sender_remark',
  })
  senderRemark: string; //发送者向接收者发送一条备注
  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.Waiting,
  })
  status: RecordStatus; //当前的记录状态
  @Column({
    type: 'varchar',
    length: 50,
    name: 'reject_reason',
  })
  rejectReason: string; //如果拒绝，拒绝的原因
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.Waiting,
  })
  deleted: RecordStatus; //当前的记录状态
}
