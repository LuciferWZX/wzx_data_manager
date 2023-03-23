import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../type/Gender';

@Entity({ name: 'tb_user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryColumn('varchar', { length: 15 })
  dm: string;
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.male,
  })
  gender: Gender;
  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: true,
  })
  nickname: string;
  @Column({ name: 'first_name' })
  firstName: string;
  @Column({ name: 'last_name' })
  lastName: string;
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: true,
  })
  username: string; //只能是英文
  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
  })
  email: string;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
}
