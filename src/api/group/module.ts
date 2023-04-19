import { Module } from '@nestjs/common';
import { GroupController } from './controller';
import { GroupService } from './service';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { RedisService } from '../../redis/redis.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, WsGateway, RedisService],
})
export class GroupModule {}
