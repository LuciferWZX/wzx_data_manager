import { Module } from '@nestjs/common';
import { GPTController } from './controller';
import { GPTService } from './service';
import { RedisService } from '../../redis/redis.service';

@Module({
  controllers: [GPTController],
  providers: [GPTService, RedisService],
})
export class GPTModule {}
