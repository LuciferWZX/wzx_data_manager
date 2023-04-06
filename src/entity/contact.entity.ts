import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_contact' })
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  uid: number;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  fid: number;
  @Column({
    type: 'varchar',
    name: 'user_group_id',
    nullable: false,
  })
  uGroupId: number;
  @Column({
    type: 'varchar',
    name: 'friend_group_id',
    nullable: false,
  })
  fGroupId: number;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
}
