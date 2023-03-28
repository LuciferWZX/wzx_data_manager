import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { RedisService } from '../../redis/redis.service';

@Module({
  providers: [WsGateway, RedisService],
})
export class WsModule {}
