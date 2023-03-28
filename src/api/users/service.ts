import { DataSource } from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { getDM } from '../../utils/dm_number';
import { RedisService } from '../../redis/redis.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { TBBan } from '../../entity/ban.entity';

@Injectable()
export class UsersService {
  private LOGIN_EXP = 1 * 60 * 3;
  constructor(
    private dataSource: DataSource,
    private redisService: RedisService,
  ) {}

  /**
   * 新建用户
   * @param createUserDto
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ id: number; dm: string }> {
    const {
      type,
      email,
      phone,
      phonePrefix,
      username,
      password,
      nickname,
      verifyCode,
    } = createUserDto;
    if (!verifyCode) {
      throw new HttpException('验证码不存在', HttpStatus.BAD_REQUEST);
    }
    const cacheVerifyCode = await this.redisService.get(email);
    if (!cacheVerifyCode) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }
    if (verifyCode !== cacheVerifyCode) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }
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
  /**
   * 修改用户
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //连接
    const { verifyCode, ...restData } = updateUserDto;
    const updateProps: Partial<UpdateUserDto> = restData;
    await queryRunner.manager.update(User, { id: id }, updateProps);
    const user = await queryRunner.manager.findOne(User, { where: { id: id } });
    const cacheUser = await this.redisService.get(`user_${id}`);
    //更新redis
    if (cacheUser) {
      await this.redisService.set(`user_${id}`, user);
    }
    await queryRunner.release(); //释放
    return 'OK';
  }

  /**
   * 密码登录
   * @param way
   * @param value
   */
  async password_login(way: string, value: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); //连接
    const user = await queryRunner.manager.findOne(User, {
      where: [
        {
          dm: way,
        },
        {
          username: way,
        },
        {
          email: way,
        },
        {
          phone: way,
        },
      ],
    });

    if (!user) {
      await queryRunner.release();
      throw new UnauthorizedException('该用户不存在');
    }
    const isBand = await queryRunner.manager.findOne(TBBan, {
      where: {
        uId: user.id,
        banded: true,
        deleted: false,
      },
    });
    if (!!isBand) {
      await queryRunner.release();
      throw new UnauthorizedException('该用户已被封禁，请联系管理员');
    }
    await queryRunner.release();
    return user;
  }
}
