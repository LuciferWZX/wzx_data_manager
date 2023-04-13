import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationType } from '../type/NotificationType';
import { ContactRecord } from './contact_request_records.entity';

//@todo 站内信之后在设计
@Entity({
  name: 'tb_notification',
})
export class NotificationEntity {
  @PrimaryGeneratedColumn({
    comment: '该条数据的id',
  })
  id: number;
  @Column({
    type: 'int',
    nullable: false,
    comment: '该条通知的接收者 -1代表所有人',
  })
  receiverId: number;
  /**
   * 通知的类型
   */
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.System,
    comment: '通知的类型',
  })
  type: NotificationType;

  @OneToOne(() => ContactRecord)
  @JoinColumn()
  contactRecord: ContactRecord; //发送请求的那条数据
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @DeleteDateColumn({
    name: 'deleted_time',
    comment: '删除时间',
  })
  deletedTime: string;
}
