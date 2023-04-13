import { Module } from '@nestjs/common';
import { FriendsController } from './controller';
import { FriendsService } from './service';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, WsGateway, RedisService],
})
export class FriendsModule {}
