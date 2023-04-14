import { Module } from '@nestjs/common';
import { AuthController } from './controller';
import { AuthService } from './service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from '../users/service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: 'wxy', // 设置私钥
      // signOptions: { expiresIn: '24h' }, // 过期时间
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersService,
    ConfigService,
    RedisService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
