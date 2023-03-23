import { DataSource } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { getDM } from '../../utils/dm_number';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ id: number; dm: string }> {
    const { type, email, phone, phonePrefix, username, password, nickname } =
      createUserDto;
    const user: any = {};
    if (type === 'email') {
      user.email = email;
    } else {
      user.phone = phone;
      user.phonePrefix = phonePrefix;
    }
    user.dm = getDM();
    user.username = username;
    user.password = password;
    user.nickname = nickname;
    const dm = getDM();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //连接
    const existUser = await queryRunner.manager.findOne(User, {
      where: [
        {
          username,
        },
        {
          nickname,
        },
        {
          email,
        },
        {
          phone,
        },
      ],
    });
    if (existUser) {
      let message = '';
      if (existUser.nickname === nickname) {
        message = '该昵称已存在';
      }
      if (existUser.username === username) {
        message = '该用户名已存在';
      }
      if (existUser.email === email) {
        message = '该邮箱已存在';
      }
      if (existUser.phone === phone) {
        message = '该手机已存在';
      }
      await queryRunner.release(); //释放
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
    try {
      //验证用户的各个属性是否合理

      const newUser: User = await queryRunner.manager.save(User, {
        ...user,
        dm,
      });
      return {
        id: newUser.id,
        dm: newUser.dm,
      };
    } catch (err) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release(); //释放
    }
  }
}
