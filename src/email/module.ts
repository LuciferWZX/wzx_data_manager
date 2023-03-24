import { Module } from '@nestjs/common';
import { EmailController } from './controller';
import { EmailService } from './service';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [],
  controllers: [EmailController],
  providers: [EmailService, RedisService],
  exports: [EmailService],
})
export class EmailModule {}
