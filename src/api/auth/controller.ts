import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { ipHandle } from '../../utils/ip_handle';
import { User } from '../../entity/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RedisService } from '../../redis/redis.service';
declare module 'express' {
  interface Request {
    user: User;
  }
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: Request, @Body('value') password) {
    const ip = ipHandle(req.ip);
    return this.authService.login(req.user, ip, password);
  }
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async info(@Req() req: Request) {
    const { id } = req.user;
    const user = await this.redisService.get(`user_${id}`);
    if (!user) {
      throw new UnauthorizedException('请登录');
    }
    return user;
  }
}
