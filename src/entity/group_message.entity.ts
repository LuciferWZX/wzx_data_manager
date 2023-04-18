import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageType } from '../type/message/MessageType';

@Entity({ name: 'tb_group_message' })
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'int',
    name: 'sender_id',
    nullable: false,
    comment: '发送者的id',
  })
  senderId: number; //发送者的id
  @Column({
    type: 'int',
    name: 'group_id',
    nullable: false,
    comment: '群组的id',
  })
  groupId: number; //群组的id
  @Column({
    type: 'simple-array',
    comment: '群组里面哪些是删除了这条记录',
  })
  delIds: number[];
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.text,
    comment: '消息的类型',
  })
  messageType: MessageType;
  @Column({ type: 'text', charset: 'utf8mb4', comment: '内容' })
  content: string;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @DeleteDateColumn({ name: 'deleted_time', comment: '删除时间' })
  deletedDate: string;
}
