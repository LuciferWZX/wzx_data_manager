import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../type/Gender';
import { Authority } from '../type/Authority';
import { PlatformType } from '../type/PlatformType';
import { TBBan } from './ban.entity';

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
  @Column({
    type: 'varchar',
    length: 20,
    select: false,
  })
  password: string;
  @Column({ name: 'first_name', nullable: true })
  firstName: string;
  @Column({ name: 'last_name', nullable: true })
  lastName: string;
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  username: string; //只能是英文
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '签名描述一下自己的心情',
  })
  sign: string; //签名
  @Column({
    name: 'phone_prefix',
    type: 'varchar',
    nullable: true,
    length: 4,
  })
  phonePrefix: string;
  @Column({
    type: 'varchar',
    nullable: true,
    length: 11,
  })
  phone: string;
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  avatar: string;
  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
    nullable: true,
  })
  email: string;
  @CreateDateColumn({ name: 'create_date' })
  createDate: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate: string;
  @Column({
    type: 'enum',
    enum: Authority,
    default: Authority.user,
  })
  authority: Authority;
  @Column({
    type: 'enum',
    enum: PlatformType,
    default: PlatformType.DM,
  })
  platform: PlatformType;
  // @Column({
  //   name: 'ban_id',
  //   comment: '如果被ban过这边会有id号',
  //   nullable: true,
  // })
  // banId: number | null;
  @OneToOne(() => TBBan)
  @JoinColumn()
  ban: TBBan;
}
