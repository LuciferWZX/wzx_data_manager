import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeletedStatus, RecordStatus } from '../type/RecordStatus';
import { UserBasicProfile } from './user_basic_profile';
import { User } from './user.entity';

@Entity({ name: 'tb_contact_record' })
export class ContactRecord {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'int',
    nullable: false,
  })
  uid: number; //发送者id
  @OneToOne(() => User)
  @JoinColumn()
  sProfile: UserBasicProfile;
  @Column({
    type: 'int',
    nullable: false,
  })
  fid: number; //接收者id
  @OneToOne(() => User)
  @JoinColumn()
  rProfile: UserBasicProfile;
  @Column({
    type: 'int',
    name: 'user_group_id',
    nullable: false,
  })
  uGroupId: number; //发送者默认接收者的分组id
  @Column({
    type: 'varchar',
    length: 50,
    name: 'sender_desc',
    nullable: true,
  })
  senderDesc: string; //发送者向接收者发送一条描述
  @Column({
    type: 'varchar',
    length: 20,
    name: 'sender_remark',
    nullable: true,
  })
  senderRemark: string; //发送者对接收者进行备注
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
    nullable: true,
  })
  rejectReason: string; //如果拒绝，拒绝的原因
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @Column({
    type: 'enum',
    enum: DeletedStatus,
    default: DeletedStatus.Nothing,
  })
  deleted: DeletedStatus; //当前的记录状态
}
