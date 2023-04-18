import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageType } from '../type/message/MessageType';

@Entity({ name: 'tb_system_message' })
export class SystemMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.text,
  })
  messageType: MessageType;
  @Column({ type: 'text', charset: 'utf8mb4' })
  content: string;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @DeleteDateColumn({ name: 'deleted_time', comment: '删除时间' })
  deletedDate: string;
}
