import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageType } from '../type/message/MessageType';

@Entity({ name: 'tb_message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'int',
    name: 'sender_id',
    nullable: false,
  })
  senderId: number; //发送者的id
  @Column({
    type: 'boolean',
    default: false,
    comment: '发送者是否删除',
  })
  senderDeleted: boolean;
  @Column({
    type: 'int',
    name: 'receiver_id',
    nullable: false,
  })
  receiverId: number; //接受者的id
  @Column({
    type: 'boolean',
    default: false,
    comment: '接受者是否删除',
  })
  receiverDeleted: boolean;
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
