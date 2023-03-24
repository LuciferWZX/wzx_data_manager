import { Module } from '@nestjs/common';
import { UsersController } from './controller';
import { UsersService } from './service';
import { RedisService } from '../../redis/redis.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RedisService],
})
export class UsersModule {}
