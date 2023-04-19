import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'tb_group' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'int',
    name: 'creator_id',
    nullable: false,
    comment: '创建者',
  })
  creatorId: number; //创建者的id
  @Column({
    type: 'varchar',
    length: 20,
    comment: '群聊的名称',
  })
  name: string;
  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];
  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];
  @Column({
    type: 'varchar',
    length: 200,
    comment: '该群的描述',
  })
  desc: string;
  @Column({
    type: 'varchar',
    length: 255,
    comment: '群公告',
  })
  announcement: string;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @DeleteDateColumn({ name: 'deleted_time', comment: '删除时间' })
  deletedDate: string;
}
