import { Module } from '@nestjs/common';
import { MessageService } from './service';
import { WsGateway } from '../../gateway/ws/ws.gateway';
import { RedisService } from '../../redis/redis.service';
import { MessageController } from './controller';

@Module({
  controllers: [MessageController],
  providers: [MessageService, WsGateway, RedisService],
})
export class MessageModule {}
