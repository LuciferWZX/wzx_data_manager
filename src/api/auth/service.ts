import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/service';
import { JwtService } from '@nestjs/jwt';
import { Authority } from '../../type/Authority';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entity/user.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}
  async validateUser(
    way: string, //可以是 'username' | 'email' | 'phone' | 'dm'中的任意一个,
    value: string,
  ) {
    return this.usersService.password_login(way, value);
  }

  async login(user: User | null, ip: string, password: string) {
    const failedCount = (await this.redisService.get(`${ip}_failedCount`)) ?? 0;
    if (failedCount >= 3) {
      throw new HttpException(
        '已输入密码三次错误，请三分钟后登录',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.password !== password) {
      await this.redisService.set(`${ip}_failedCount`, failedCount + 1, 5);
      throw new HttpException(
        {
          message: '密码不正确',
          data: { failedCount: failedCount + 1 },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = this.generateToken({
      id: user.id,
      dm: user.dm,
      auth: user.authority,
    });
    const newestUser = {
      user,
      ...token,
    };
    //存入redis
    await this.redisService.set(`user_${user.id}`, user, 1 * 60 * 60 * 24);
    return newestUser;
  }
  generateToken({ id, dm, auth }: { id: number; dm: string; auth: Authority }) {
    const token = this.jwtService.sign({ id, dm, auth });
    const expires = this.configService.get('jwt').expiresTime;
    return {
      token,
      expires,
    };
  }
}
